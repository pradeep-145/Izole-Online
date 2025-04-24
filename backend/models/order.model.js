const mongoose = require("mongoose");

const Order = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    quantity: { 
      type: Number, 
      required: true 
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
    address: {
      type: String,
      required: true,
    },
    delivery: {
      type: String,
      enum: ["PENDING", "COMPLETED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    schedulerName: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: function() {
        return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
      },
      expires: 10 * 60, // TTL index in seconds
    },
    totalAmount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: {
      currentTime: () =>
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        }),
    },
  }
);

// Static method for storing orders
Order.statics.storeOrder = async function (params) {
  return this.create({
    ...params,
  });
};

// Method to calculate order total based on product price and quantity
Order.methods.calculateTotal = async function() {
  const Product = mongoose.model('Product');
  const product = await Product.findById(this.productId);
  
  if (product) {
    this.totalAmount = product.price * this.quantity;
    return this.totalAmount;
  }
  return 0;
};

// Pre-save middleware to calculate total if not set
Order.pre('save', async function(next) {
  if (this.totalAmount === 0) {
    try {
      await this.calculateTotal();
    } catch (error) {
      console.log("Error calculating total:", error);
    }
  }
  next();
});

module.exports = mongoose.model("Order", Order);