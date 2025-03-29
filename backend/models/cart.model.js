const mongoose = require("mongoose");

const Cart = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
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
      color:{
        type:String,
        required:true
      },
      size:{
        type:String,
        required:true
      }
    },
  ],
});

module.exports = mongoose.model("Cart", Cart);
