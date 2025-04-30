const orderModel = require("../models/order.model.js");
const {
  createScheduler,
  deleteOrderScheduler,
} = require("../utils/scheduler.js");
require("dotenv").config();
const productModel = require("../models/product.model.js");
const axios = require("axios");
exports.OrderController = {
  createOrder: async (req, res) => {
    const { totalAmount, products, address } = req.body;
    if (!process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_CLIENT_SECRET) {
      throw new Error("Cashfree credentials not configured");
    }
    try {
      // 1. Create order in your database
      const order = await orderModel.create({
        customerId: req.user._id,
        products,
        totalAmount,
        address,
      });

      // 2. Update product quantities
      if (
        products &&
        products.id &&
        products.color &&
        products.size &&
        products.quantity
      ) {
        const quantityToDeduct = parseInt(products.quantity, 10);
        if (!isNaN(quantityToDeduct)) {
          await productModel.updateOne(
            {
              _id: products.id,
              "variants.color": products.color,
              "variants.sizeOptions.size": products.size,
            },
            {
              $inc: {
                "variants.$[variant].sizeOptions.$[sizeOption].quantity":
                  -quantityToDeduct,
              },
            },
            {
              arrayFilters: [
                { "variant.color": products.color },
                { "sizeOption.size": products.size },
              ],
            }
          );
        }
      }

      const orderId = `order_${order._id}`;
      const cashfree = await axios.post(
        "https://sandbox.cashfree.com/pg/orders",
        {
          // This is the request BODY 
          order_amount: parseFloat(totalAmount).toFixed(2),
          order_currency: "INR",
          order_id: orderId,
          customer_details: {
            customer_id: req.user._id,
            customer_phone: req.user.phoneNumber.toString(),
            customer_email: req.user.email,
            customer_name: req.user.name,
          },
          order_meta: {
            return_url: `https://www.cashfree.com/devstudio/preview/pg/web/card?order_id=${orderId}`,
            payment_methods: "cc,dc,upi",
          },
          order_expiry_time: new Date(
            Date.now() + 30 * 60 * 1000
          ).toISOString(),
        },
        {
          // This is the Axios config object where headers should be
          headers: {
            "x-client-id": process.env.CASHFREE_CLIENT_ID,
            "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
            "x-api-version": "2025-01-01",
            "Content-Type": "application/json",
          },
        }
      );

  
      order.paymentSessionId = cashfree.paymentSessionId;
      // order.schedulerName = await createScheduler(order._id); // Assuming createScheduler is defined elsewhere
      await order.save();
      console.log(cashfree.data);
      // 6. Return response
      res.status(201).json({
        success: true,
        order: order,
        paymentSessionId: cashfree.data.payment_session_id,
        message: "Order created successfully",
      });
    } catch (error) {
      console.error("Error in creating order:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Error in creating order",
        error: error,
      });
    }
  },

  confirmPayment: async (req, res) => {
    const { paymentIntentId, orderId } = req.body;

    try {
      // Verify the payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      if (!paymentIntent) {
        return res.status(400).json({
          success: false,
          message: "Payment not found",
        });
      }

      // Check payment status
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          success: false,
          message: `Payment not successful. Status: ${paymentIntent.status}`,
        });
      }

      // Get the order
      const order = await orderModel.findById(orderId);
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
      order.status = "COMPLETED";
      order.paymentStatus = "COMPLETED";
      order.expiresAt = undefined; // Remove expiration
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

  getOrders: async (req, res) => {
    const user = req.user;
    try {
      const response = await orderModel.find({ customerId: user.userId });

      res.status(200).json({
        success: true,
        response,
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

  confirmOrder: async (req, res) => {
    const { orderId } = req.body;

    try {
      const order = await orderModel.findById(orderId);

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

      // Update order status
      order.status = "COMPLETED";
      order.expiresAt = undefined; // Remove expiration
      await order.save();

      res.status(200).json({
        success: true,
        response: order,
        message: "Order confirmed successfully",
      });
    } catch (error) {
      console.log("Error in confirming order", error);
      res.status(500).json({
        success: false,
        message: "Error in confirming order",
      });
    }
  },

  cancelOrder: async (req, res) => {
    const { orderId, schedulerName } = req.body;

    try {
      // Find the order
      const order = await orderModel.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Delete the scheduler
      if (schedulerName || order.schedulerName) {
        await deleteOrderScheduler(schedulerName || order.schedulerName);
      }

      // Update order status
      order.status = "CANCELLED";
      order.expiresAt = undefined; // Remove expiration
      await order.save();

      res.status(200).json({
        success: true,
        response: order,
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
      const order = await orderModel
        .findById(orderId)
        .populate("productId", "name price description image")
        .populate("customerId", "name email phone");

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.status(200).json({
        success: true,
        response: order,
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
