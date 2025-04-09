const mongoose = require("mongoose");

const Cart = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      color: {
        type: String,
        required: true
      },
      size: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      image: {
        type: String,
        required: true
      }
    },
  ],
}, {
  timestamps: {
    currentTime: () => new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata'
    })
  }
});

module.exports = mongoose.model("Cart", Cart);