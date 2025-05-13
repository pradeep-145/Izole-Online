const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["order", "promotion", "general"],
      default: "general",
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      index: true,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
notificationSchema.index({ customerId: 1, createdAt: -1 });
notificationSchema.index({ customerId: 1, read: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
