const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
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
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      addressLine1: {
        type: String,
        required: true,
      },
      addressLine2: {
        type: String,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      }

    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "CANCELLED"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "COMPLETED", "Refunded"],
      default: "Pending",
    },
    paymentSessionId: String,
    paymentLink: String,
    schedulerName: String,
    shipmentId:{
      type:Number,
    },
    awb:{
      type:Number,
    },
    shippingCharge:{
      type:Number,
    },
    shipmentOrderId:{
      type:String,
    },
    shippingInfo:{
      type:String,
      required:true
    },
    pickupDate:{
      type:Date,
    },
    estimatedDeliveryDate:{
      type:Date,
    },
    trackingUrl:{
      type:String,
    },
    expiresAt: {
      type: Date,
      default: new Date(Date.now()),
      expires: 10 * 60,
    },
    cancelReason: String,
    cancelledAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
