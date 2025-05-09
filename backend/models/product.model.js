const { min } = require("moment-timezone");
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
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
  variants: [
    {
      color: { type: String, required: true },
      images: [{ type: String }],
      sizeOptions: [
        {
          size: { type: String, required: true },
          quantity: { type: Number, required: true, default: 0,
            min: 0
           },
          price: { type: Number, required: true },
          originalPrice: { type: Number, required: true },
        }
      ],
      details: [{ type: String }]
    }
  ],
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
  weight:{
    type: Number,
    required: true,
  }
}, {
  timestamps: {
    currentTime: () => new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata'
    })
  }
});

module.exports = mongoose.model("Product", ProductSchema);