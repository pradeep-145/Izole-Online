const Product = require("../models/product.model.js");
const ProductController = {
  saveProduct: async (req, res) => {
    try {
      const { name, description, price, quantity, colors } = req.body;
      const images = req.files;
      const imageData = {};
      colors.forEach((color, index) => {
        if (!imageData[color]) {
          imageData[color] = [];
        }
        imageData[color].push(images[index].path);
      });

      const imageArray = Object.keys(imageData).map((color) => ({
        color,
        image: imageData[color],
      }));

      const product = new Product({
        name,
        description,
        price,
        quantity,
        images: imageArray,
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
