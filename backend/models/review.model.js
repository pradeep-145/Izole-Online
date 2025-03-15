const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true, // Ensuring rating is mandatory
  },
  review: {
    type: String,
    required: true,
  }
},{timestamps:true});

module.exports = mongoose.model("Review", ReviewSchema);
