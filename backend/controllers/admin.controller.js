const orders = require("../models/order.model.js");
const products = require("../models/product.model.js");
const customer = require("../models/customer.model.js");
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
      res.status(500).json({ success: false, message: "Failed to fetch inventory" });
    }
  },

  // Update inventory
  updateInventory: async (req, res) => {
    const { productId, quantity } = req.body;
    try {
      const product = await products.findByIdAndUpdate(
        productId,
        { $set: { "variants.$[].quantity": quantity } },
        { new: true }
      );
      res.status(200).json({ success: true, product });
    } catch (error) {
      console.error("Error updating inventory:", error);
      res.status(500).json({ success: false, message: "Failed to update inventory" });
    }
  },

  // Fetch orders
  getOrders: async (req, res) => {
    try {
      const ordersList = await orders.find({}).populate("customerId");
      res.status(200).json({ success: true, orders: ordersList });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ success: false, message: "Failed to fetch orders" });
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
      res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ success: false, message: "Failed to update order status" });
    }
  },

  saveProduct: async (req, res) => {
    try {
      // Updated to use new product structure with variants
      const { name, description, category, variants } = req.body;
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
};

module.exports = adminController;
