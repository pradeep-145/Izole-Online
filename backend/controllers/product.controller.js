const Product = require("../models/product.model.js");
const reviewModel = require("../models/review.model.js");
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
  getProducts:async(req,res)=>{
    try{
      
      const response =await Product.find({})
      res.status(200).json({result:response});
    }catch(error){
      console.log("Error ar getProducts",error);
      res.status(500).json("Internal server Error")
    }
  },
  addReview: async (req, res) => {
    try {
      const { productId, review } = req.body;
      const product = await Product.findById(productId);
      const response=await reviewModel.create(req.body);
      if(response){
        product.review.push(response._id);                                                                                                          
        await product.save();
      }
      else
      {
        throw new Error("Review not added")
      }
      res.status(200).json({ message: "Review added successfully" });
    } catch (error) {
      console.log("Error at addReview", error);
      res.status(500).json("Internal server Error");
    }
  },
  getProduct:async(req,res)=>{
    const response=await Product.find({"images._id":req.params.id});
    res.json(response);
  }
};

module.exports = ProductController;
