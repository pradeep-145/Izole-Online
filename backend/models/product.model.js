  const mongoose = require("mongoose");

  const ProductSchema = new mongoose.Schema({
    images: [
      {
        image: [{ type: String }],
        color: { type: String, required: true },
        size: [{ type: String, required: true }], // Added size field from sample data
        quantity: {
          type: Number,
          required: true,
          default: 0,
        },
        details: [{ type: String }], // Added details from sample data
        price: {
          type: Number,
          required: true,
        },
        originalPrice: {
          type: Number,
          required: true, // Included to match the sample data
        },
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
    category: {
      type: String,
      required: true,
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
  },{timestamps:true});

  module.exports = mongoose.model("Product", ProductSchema);
