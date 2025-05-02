const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        id: {
          type: String,
          default: "default_id",
        },
        name: {
          type: String,
          default: "Unknown Product",
        },
        price: {
          type: Number,
          default: 0,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        image: {
          type: String,
          default: "https://via.placeholder.com/150",
        },
        color: {
          type: String,
          default: "Default",
        },
        size: {
          type: String,
          default: "Default",
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "CANCELLED"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "COMPLETED", "Failed", "Refunded"],
      default: "Pending",
    },
    paymentSessionId: String,
    paymentLink: String,
    schedulerName: String,
    expiresAt: Date,
    cancelReason: String,
    cancelledAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
