const Product = require("../models/product.model.js");
const ProductController = {
  saveProduct: async (req, res) => {
    try {
      const { name, description, price, quantity, images } = req.body;
      console.log(req.body);

      const product = new Product({
        name,
        description,
        price,
        quantity,
        images,
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

module.exports = ProductController;
