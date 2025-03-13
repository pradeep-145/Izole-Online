const mongoose = require("mongoose");

const Product = mongoose.Schema({
  images: [
    {
      image:[{type:String}],
      color: String,
    },
  ],
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  category:{
    type:String,
    required:true
  },
  orderCount: {
    type: Number,
    default: 0,
  },
  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = mongoose.model("Product", Product);
