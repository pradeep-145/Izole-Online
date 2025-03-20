const mongoose = require("mongoose");

const customerSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 10 * 24 * 60 * 60,
    },
    otp: {
      code: Number,
      createdAt: {
        type: Date,
        default: Date.now,
        expires: 600, // 10 minutes in seconds
      },
    },
  },
  { timestamps: true }
);

customerSchema.index({ "otp.createdAt": 1 }, { expireAfterSeconds: 600 });

customerSchema.statics.storeOTP = async function (username, otpCode) {
  return this.findOneAndUpdate(
    { username },
    {
      otp: {
        code: otpCode,
        createdAt: new Date(),
      },
    },
    { new: true }
  );
};

customerSchema.statics.verifyOTP = async function (username, otpCode) {
  const user = await this.findOne({ username, "otp.code": otpCode });
  if (!user) return false;

  await this.findOneAndUpdate(
    { username },
    {
      isVerified: true,
      $unset: { otp: "" },
    }
  );

  return true;
};

module.exports = mongoose.model("Customer", customerSchema);
