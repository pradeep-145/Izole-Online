const orders = require("../models/order.model.js");
const products = require("../models/product.model.js");
const customer = require("../models/customer.model.js");
const Notification = require("../models/notification.model.js");
const Product = products; // Adding this reference for clarity

const adminController = {
  get: async (req, res) => {
    try {
      const orderResponse = await orders.find({});
      const productsResponse = await products.find({});
      const customerResponse = await customer.find({});
      res.status(200).json({
        orders: orderResponse,
        products: productsResponse,
        customers: customerResponse,
      });
    } catch (error) {
      console.log("Error in admin get", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Fetch inventory
  getInventory: async (req, res) => {
    try {
      const inventory = await products.find({});
      res.status(200).json({ success: true, inventory });
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch inventory" });
    }
  },

  // Update inventory
  updateInventory: async (req, res) => {
    const { productId, variantId, quantity } = req.body;
    try {
      const product = await products.findById(productId);

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      // Find the variant and update its quantity
      const variant = product.variants.id(variantId);
      if (!variant) {
        return res
          .status(404)
          .json({ success: false, message: "Variant not found" });
      }

      variant.quantity = quantity;
      await product.save();

      res.status(200).json({ success: true, product });
    } catch (error) {
      console.error("Error updating inventory:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update inventory" });
    }
  },

  // Fetch orders
  getOrders: async (req, res) => {
    try {
      const ordersList = await orders.find({}).populate("customerId");
      res.status(200).json({ success: true, orders: ordersList });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch orders" });
    }
  },

  // Update order status
  updateOrders: async (req, res) => {
    const { orderId, status } = req.body;
    try {
      const updatedOrder = await orders.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      // Create a notification for the customer when order status changes
      if (updatedOrder) {
        const newNotification = new Notification({
          customerId: updatedOrder.customerId,
          title: `Order Status Update`,
          message: `Your order #${orderId.slice(
            -6
          )} has been updated to ${status}`,
          type: "order",
          read: false,
        });

        await newNotification.save();
      }

      res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
      console.error("Error updating order status:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update order status" });
    }
  },

  // Get customers
  getCustomers: async (req, res) => {
    try {
      const customers = await customer.find({});
      res.status(200).json({ success: true, customers });
    } catch (error) {
      console.error("Error fetching customers:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch customers" });
    }
  },

  // Get customer details
  getCustomerDetails: async (req, res) => {
    const { customerId } = req.params;
    try {
      const customerDetails = await customer.findById(customerId);
      const customerOrders = await orders.find({ customerId });

      if (!customerDetails) {
        return res
          .status(404)
          .json({ success: false, message: "Customer not found" });
      }

      res.status(200).json({
        success: true,
        customer: customerDetails,
        orders: customerOrders,
      });
    } catch (error) {
      console.error("Error fetching customer details:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch customer details" });
    }
  },

  saveProduct: async (req, res) => {
    try {
      // Updated to use new product structure with variants
      const { name, description, category, variants , weight} = req.body;
      console.log(req.body);

      const product = new Product({
        name,
        description,
        category,
        variants,
        orderCount: 0,
        review: [],
      });

      await product.save();
      res
        .status(200)
        .json({ message: "Product added successfully", product: product });
    } catch (error) {
      console.log("Error at saveProduct", error);
      res.status(500).json("Internal server Error");
    }
  },

  // Update product
  updateProduct: async (req, res) => {
    try {
      const { productId, name, description, category, variants } = req.body;

      const updatedProduct = await products.findByIdAndUpdate(
        productId,
        { name, description, category, variants },
        { new: true }
      );

      if (!updatedProduct) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update product" });
    }
  },

  // Remove product
  removeProduct: async (req, res) => {
    try {
      const { productId } = req.body;

      const deletedProduct = await products.findByIdAndDelete(productId);

      if (!deletedProduct) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to delete product" });
    }
  },

  // Get dashboard analytics
  getDashboardAnalytics: async (req, res) => {
    try {
      // Get orders from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentOrders = await orders
        .find({
          createdAt: { $gte: thirtyDaysAgo },
        })
        .populate("customerId");

      // Get total sales amount
      const totalSales = recentOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );

      // Get total customers
      const totalCustomers = await customer.countDocuments();

      // Get low stock products
      const lowStockProducts = await products.find({
        "variants.quantity": { $lt: 10 },
      });

      // Get top selling products
      const topProducts = await products
        .find()
        .sort({ orderCount: -1 })
        .limit(5);

      res.status(200).json({
        success: true,
        analytics: {
          totalSales,
          orderCount: recentOrders.length,
          customerCount: totalCustomers,
          lowStockCount: lowStockProducts.length,
          topProducts,
          recentOrders: recentOrders.slice(0, 5),
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard analytics:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch analytics" });
    }
  },

  // Send notification to customer
  sendNotification: async (req, res) => {
    const { customerId, title, message, type } = req.body;

    try {
      const newNotification = new Notification({
        customerId,
        title,
        message,
        type: type || "general",
        read: false,
      });

      await newNotification.save();

      res.status(200).json({
        success: true,
        notification: newNotification,
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to send notification" });
    }
  },
};

module.exports = adminController;
