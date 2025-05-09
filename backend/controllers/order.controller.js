const orderModel = require("../models/order.model.js");
const {
  createScheduler,
  deleteOrderScheduler,
} = require("../utils/scheduler.js");
require("dotenv").config();
const {
  createOrder,
  getAuthToken,
  cancelOrder,
  generateAWB,
  trackOrder,
  getShiprocketOrders,
  getShiprocketOrderById,
  updateShiprocketOrder,
} = require("../services/shiprocket.service.js");
const productModel = require("../models/product.model.js");
const axios = require("axios");
exports.OrderController = {
  createOrder: async (req, res) => {
    const { totalAmount, products, address, billingAddress, shippingInfo } =
      req.body;
    console.log(billingAddress);

    if (
      !process.env.CASHFREE_CLIENT_ID ||
      !process.env.CASHFREE_CLIENT_SECRET
    ) {
      throw new Error("Cashfree credentials not configured");
    }
    console.log(address);
    try {
      // Validate that products is an array
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Products should be provided as a non-empty array",
        });
      }

      // Validate and sanitize product data before creating order
      const validatedProducts = products.map((product) => ({
        id: product.id || "default_id",
        name: product.name || "Unknown Product",
        price: parseFloat(product.price || 0),
        quantity: parseInt(product.quantity || 1, 10),
        image: product.image || "https://via.placeholder.com/150",
        color: product.color || "Default",
        size: product.size || "Default",
      }));

      // 1. Create order in your database with validated products
      const order = await orderModel.create({
        customerId: req.user._id,
        products: validatedProducts,
        totalAmount,
        address,
        shippingInfo: JSON.stringify(shippingInfo),
      });

      // 2. Update product quantities for each product that has a valid ID
      for (const product of validatedProducts) {
        if (
          product.id &&
          product.id !== "default_id" &&
          product.color &&
          product.size &&
          product.quantity
        ) {
          const quantityToDeduct = parseInt(product.quantity, 10);
          if (!isNaN(quantityToDeduct)) {
            try {
              await productModel.updateOne(
                {
                  _id: product.id,
                  "variants.color": product.color,
                  "variants.sizeOptions.size": product.size,
                },
                {
                  $inc: {
                    "variants.$[variant].sizeOptions.$[sizeOption].quantity":
                      -quantityToDeduct,
                  },
                },
                {
                  arrayFilters: [
                    { "variant.color": product.color },
                    { "sizeOption.size": product.size },
                  ],
                }
              );
            } catch (updateError) {
              console.error("Error updating product quantity:", updateError);
              // Continue with de creation even if quantity update fails
            }
          }
        }
      }

      const orderId = `order_${order._id}`;
      const schedulerName= await createScheduler(order._id);
      console.log("Scheduler name:", schedulerName);
      let paymentSessionId = null;
      let paymentLink = null;

      // Create Shiprocket order first
      const shiprocketOrder = {
        order_id: `order_${order._id}`,
        order_date:
          new Date().toISOString().split("T")[0] +
          " " +
          new Date().toLocaleTimeString("en-IN", { hour12: false }).slice(0, 5), // Added time
        pickup_location: "Home",
        comment: "", // Added empty comment field

        // Billing Address (complete)
        billing_customer_name: billingAddress.firstName || "Customer",
        billing_last_name: billingAddress.lastName || "Customer",
        billing_address: billingAddress.address || "Default Address",
        billing_address_2: "", // Added missing field
        billing_city: billingAddress.city || "Tiruppur",
        billing_pincode: billingAddress.zipCode?.toString() || "641604",
        billing_state: billingAddress.state || "Tamil Nadu",
        billing_country: billingAddress.country || "India",
        billing_email: billingAddress.email || "customer@example.com",
        billing_phone: billingAddress.phone
          ? billingAddress.phone.toString()
          : "9999999999",

        // Shipping Address (complete, even with shipping_is_billing=true)
        shipping_is_billing: true,
        shipping_customer_name: "", // Added all required shipping fields
        shipping_last_name: "",
        shipping_address: "",
        shipping_address_2: "",
        shipping_city: "",
        shipping_pincode: "",
        shipping_state: "",
        shipping_country: "",
        shipping_email: "",
        shipping_phone: "",

        // Order Items
        order_items: validatedProducts.map((product) => ({
          name: product.name,
          sku: product.id,
          units: product.quantity,
          selling_price: product.price.toString(),
          discount: "", // Added
          tax: "", // Added
          hsn: 1234, // Added with fallback
        })),

        // Payment and charges
        payment_method: "Prepaid", // Capitalized to match sample
        shipping_charges: 0, // Added
        giftwrap_charges: 0, // Added
        transaction_charges: 0, // Added
        total_discount: 0, // Added

        // Totals and dimensions
        sub_total: totalAmount.toString(),
        length: 10,
        breadth: 10,
        height: 7,
        weight: shippingInfo.weight,
      };

      try {
        console.log(req.shiprocketToken);
        const { data, token } = await createOrder(
          req.shiprocketToken,
          shiprocketOrder
        );
        console.log("Shiprocket order response:", data);
        // Save Shiprocket data to order if needed
        order.shipmentOrderId = data?.order_id || null;
        order.shipmentId = data?.shipment_id || null;

        // Update token if needed
        if (token != req.shiprocketToken || !req.shiprocketToken) {
          const maxAge = 10 * 24 * 60 * 60;
          console.log("token setting cookie");
          res.setHeader("Set-Cookie", [
            `shiprocket=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge};`,
          ]);
        }
      } catch (shiprocketError) {
        console.error("Shiprocket order creation error:", shiprocketError);
        // Continue with order creation even if Shiprocket fails
      }

      // Now create payment session with Cashfree
      try {
        const cashfree = await axios.post(
          "https://sandbox.cashfree.com/pg/orders",
          {
            order_amount: parseFloat(totalAmount).toFixed(2),
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
              customer_id: req.user._id.toString(),
              customer_phone: req.user.phoneNumber
                ? req.user.phoneNumber.toString()
                : "9999999999",
              customer_email: req.user.email || "customer@example.com",
              customer_name: req.user.name || "Customer",
            },
            order_meta: {
              payment_methods: "cc,dc,upi",
              return_url: `http://localhost:5173/customer/payment/redirect?order_id=${orderId}&status=success`,
            },
            order_expiry_time: new Date(
              Date.now() + 30 * 60 * 1000
            ).toISOString(),
          },
          {
            headers: {
              "x-client-id": process.env.CASHFREE_CLIENT_ID,
              "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
              "x-api-version": "2025-01-01",
              "Content-Type": "application/json",
            },
          }
        );

        // Save payment information
        paymentSessionId = cashfree.data.payment_session_id;
        paymentLink = `https://sandbox.cashfree.com/pg/view/order/${orderId}/${cashfree.data.payment_session_id}`;
        order.paymentSessionId = paymentSessionId;
        order.paymentLink = paymentLink;
        order.schedulerName = schedulerName;
      } catch (paymentError) {
        console.error("Payment gateway error:", paymentError);
        // Continue with order creation even if payment setup fails
      }

      // Save all changes to the order
      await order.save();

      // Finally send the response
      res.status(201).json({
        success: true,
        order: {
          _id: order._id,
          totalAmount: order.totalAmount,
          address: order.address,
          products: order.products,
          paymentLink: order.paymentLink,
        },
        paymentSessionId: order.paymentSessionId,
        message: "Order created successfully",
      });
    } catch (error) {
      console.error("Error in creating order:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Error in creating order",
        error: error.toString(),
      });
    }
  },

  confirmPayment: async (req, res) => {
    const { orderId } = req.body;

    try {
      const response = await axios.get(
        `https://sandbox.cashfree.com/pg/orders/order_${orderId}/payments`,
        {
          headers: {
            "x-client-id": process.env.CASHFREE_CLIENT_ID,
            "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
            "x-api-version": "2025-01-01",
          },
        }
      );

      if (response.data[0].payment_status !== "SUCCESS") {
        return res.status(400).json({
          success: false,
          message: "Payment not verified",
        });
      }
      const order = await orderModel.findById(orderId);
      const awb={
        shipment_id: order.shipmentId,
        courier_id: JSON.parse(order.shippingInfo).courier_company_id,
      }
      console.log(awb)
      const { data, token } = await generateAWB(req.shiprocketToken, awb);
      if (token != req.shiprocketToken || !req.shiprocketToken) {
        const maxAge = 10 * 24 * 60 * 60;
        console.log("token setting cookie");
        res.setHeader("Set-Cookie", [
          `shiprocket=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge};`,
        ]);
      }
      if(!data.pickup_scheduled){
        const {data,token} = await shcedulePickup(req.shiprocketToken, order.shipmentId)
        if (token != req.shiprocketToken || !req.shiprocketToken) {
          const maxAge = 10 * 24 * 60 * 60;
          console.log("token setting cookie");
          res.setHeader("Set-Cookie", [
            `shiprocket=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge};`,
          ]);
        }
        order.pickupDate = data.pickup_scheduled_date;
        order.estimatedDeliveryDate = data.est;
        order.trackingUrl = data.tracking_url;
        order.shippingCharge = data.shipping_charges; 
      }
      order.awb=data.awb
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Delete the scheduler
      if (order.schedulerName) {
        await deleteOrderScheduler(order.schedulerName);
      }

      // Update the order status

      order.paymentStatus = "COMPLETED";
      order.expiresAt = undefined;
      await order.save();

      res.status(200).json({
        success: true,
        order,
        message: "Payment confirmed successfully",
      });
    } catch (error) {
      console.log("Error in confirming payment", error);
      res.status(500).json({
        success: false,
        message: "Error in confirming payment",
      });
    }
  },
  paymentFailed: async (req, res) => {
    const { orderId } = req.body;

    try {
      const order = await orderModel.findByIdAndDelete(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
       try {
              const productArray = Array.isArray(order.products)
                ? order.products
                : [order.products];
      
              await Promise.all(
                productArray.map(async (product) => {
                  return productModel.updateOne(
                    {
                      _id: product.id,
                      "variants.color": product.color,
                      "variants.sizeOptions.size": product.size,
                    },
                    {
                      $inc: {
                        "variants.$[variant].sizeOptions.$[sizeOption].quantity":
                          product.quantity,
                      },
                    },
                    {
                      arrayFilters: [
                        { "variant.color": product.color },
                        { "sizeOption.size": product.size },
                      ],
                    }
                  );
                })
              );
      
              console.log(
                `Successfully restored inventory for all products in order: ${orderId}`
              );
            } catch (inventoryError) {
              console.error(
                `Error restoring product quantities: ${inventoryError.message}`
              );
              // Continue with order deletion even if inventory update fails
            }
      if (order.schedulerName) {
        await deleteOrderScheduler(order.schedulerName);
      }

      order.paymentStatus = "FAILED";
      order.expiresAt = undefined;
      await order.save();

      res.status(200).json({
        success: true,
        order,
        message: "Payment failed",
      });
    } catch (error) {
      console.log("Error in payment failure", error);
      res.status(500).json({
        success: false,
        message: "Error in payment failure",
      });
    }
  },

  getOrders: async (req, res) => {
    const user = req.user;
    try {
      const response = await orderModel.find({ customerId: user._id });
      res.status(200).json({
        success: true,
        order: response,
        message: "Orders fetched successfully",
      });
    } catch (error) {
      console.log("Error in getting orders", error);
      res.status(500).json({
        success: false,
        message: "Error in getting orders",
      });
    }
  },

  cancelOrder: async (req, res) => {
    const { orderId } = req.params;
    const { reason } = req.body;

    try {
      const order = await orderModel.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Check if user is authorized to cancel this order
      if (order.customerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to cancel this order",
        });
      }

      // Only allow cancellation for orders that are not already delivered or cancelled
      if (order.status === "DELIVERED" || order.status === "CANCELLED") {
        return res.status(400).json({
          success: false,
          message: `Cannot cancel order that is already ${order.status.toLowerCase()}`,
        });
      }

      // Process refund if payment was completed
      if (order.paymentStatus === "COMPLETED") {
        try {
          await axios.post(
            `https://sandbox.cashfree.com/pg/orders/order_${orderId}/refunds`,
            {
              refund_amount: order.totalAmount,
              refund_id: `refund_${orderId}`,
              refund_note: reason || "Customer cancelled order",
            },
            {
              headers: {
                "x-client-id": process.env.CASHFREE_CLIENT_ID,
                "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
                "x-api-version": "2025-01-01",
                "Content-Type": "application/json",
              },
            }
          );
        } catch (refundError) {
          console.error("Refund processing error:", refundError);
          // Continue with cancellation even if refund has issues
        }
      }
      const {data, token} = await cancelOrder(req.shiprocketToken, order.shipmentOrderId)
      if (token != req.shiprocketToken || !req.shiprocketToken) {
        const maxAge = 10 * 24 * 60 * 60;
        console.log("token setting cookie");
        res.setHeader("Set-Cookie", [
          `shiprocket=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge};`,
        ]);
      }
      // Delete the scheduler if exists
      if (order.schedulerName) {
        await deleteOrderScheduler(order.schedulerName);
      }

      // Update order status
      order.status = "CANCELLED";
      order.cancelReason = reason || "Customer cancelled order";
      order.cancelledAt = new Date();
      order.expiresAt = undefined; // Remove expiration
      await order.save();

      res.status(200).json({
        success: true,
        order: order,
        message: "Order cancelled successfully",
      });
    } catch (error) {
      console.log("Error in canceling order", error);
      res.status(500).json({
        success: false,
        message: "Error in canceling order",
      });
    }
  },

  updateOrder: async (req, res) => {
    const { orderId } = req.params;
    const { quantity, address, status, delivery, paymentStatus } = req.body;

    try {
      // Find order and verify ownership if needed
      const order = await orderModel.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Optional: Check if user owns this order
      if (req.user && order.customerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this order",
        });
      }

      // Only update fields that were provided
      const updateData = {};
      if (quantity) updateData.quantity = quantity;
      if (address) updateData.address = address;
      if (status) updateData.status = status;
      if (delivery) updateData.delivery = delivery;
      if (paymentStatus) updateData.paymentStatus = paymentStatus;

      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        { $set: updateData },
        { new: true }
      );

      res.status(200).json({
        success: true,
        response: updatedOrder,
        message: "Order updated successfully",
      });
    } catch (error) {
      console.log("Error in updating order", error);
      res.status(500).json({
        success: false,
        message: "Error in updating order",
      });
    }
  },

  deleteOrder: async (req, res) => {
    const { orderId } = req.params;

    try {
      const order = await orderModel.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Optional: Check if user owns this order
      if (req.user && order.customerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to delete this order",
        });
      }

      // Delete associated scheduler if exists
      if (order.schedulerName) {
        await deleteOrderScheduler(order.schedulerName);
      }

      await orderModel.findByIdAndDelete(orderId);

      res.status(200).json({
        success: true,
        message: "Order deleted successfully",
      });
    } catch (error) {
      console.log("Error in deleting order", error);
      res.status(500).json({
        success: false,
        message: "Error in deleting order",
      });
    }
  },

  // Get a single order by ID
  getOrderById: async (req, res) => {
    const { orderId } = req.params;

    try {
      const order = await orderModel.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.status(200).json({
        success: true,
        order,
        message: "Order fetched successfully",
      });
    } catch (error) {
      console.log("Error in getting order", error);
      res.status(500).json({
        success: false,
        message: "Error in getting order",
      });
    }
  },
};


// Response from Shiprocket: {
//   awb_assign_status: 1,
//   response: {
//     data: {
//       courier_company_id: 217,
//       awb_code: 'JH020263933IN',
//       cod: 0,
//       order_id: 829847468,
//       shipment_id: 826214621,
//       awb_code_status: 1,
//       assigned_date_time: [Object],
//       applied_weight: 0.15,
//       company_id: 6268306,
//       courier_name: 'India Post-Speed Post Air Prepaid',
//       child_courier_name: null,
//       freight_charges: 29.5,
//       pickup_scheduled_date: '2025-05-09 09:00:00',
//       pickup_scheduled: '2025-05-09 09:00:00',
//       routing_code: '',
//       rto_routing_code: null,
//       invoice_no: 'Retail00005',
//       transporter_id: '',
//       transporter_name: '',
//       shipped_by: [Object]
//     }
//   },
//   no_pickup_popup: 0,
//   quick_pick: 0
// }