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
  updateOrders: async (req, res) => {
    const { orderId, status } = req.body;
    try {
      const response = await orders.findOneAndUpdate(
        { _id: orderId },
        { status: status },
        { new: true }
      );
      res.status(200).json(response);
    } catch (error) {
      console.log("Error in admin update", error);
      res.status(500).json({ error: "Internal server error" });
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
