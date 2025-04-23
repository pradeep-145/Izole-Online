const orderModel = require("../models/order.model.js");
exports.OrderController = {
  createOrder: async (req, res) => {
    try {
    } catch (error) {}
  },
  getOrders: async (req, res) => {
    const user = req.user;
    try {
      const response = await orderModel.find({ customerId: user._id });
      res.status(200).json(response);
    } catch (error) {
      console.log("Error in getting orders", error);
      res.status(500).json({ message: "Error in getting orders" });
    }
  },
  confirmOrder: async (req, res) => {
    try {
    } catch (error) {
      console.log("Error in confirming order", error);
      res.status(500).json({ message: "Error in confirming order" });
    }
  },
  cancelOrder: async (req, res) => {
    try {
    } catch (error) {
      console.log("Error in canceling order", error);
      res.status(500).json({ message: "Error in canceling order" });
    }
  },
  updateOrder: async (req, res) => {
    try {
    } catch (error) {
      console.log("Error in updating order", error);
      res.status(500).json({ message: "Error in updating order" });
    }
  },
  deleteOrder: async (req, res) => {
    try {
    } catch (error) {
      console.log("Error in deleting order", error);
      res.status(500).json({ message: "Error in deleting order" });
    }
  },
};
