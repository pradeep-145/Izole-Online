const { default: mongoose } = require("mongoose");
const customerModel = require("../models/customer.model.js");

const OTPSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Customer", // Optional: reference to customer model
    },
    code: {
        type: Number,
        required: true,
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        expires: 600, // Expires after 10 minutes
    },
});

OTPSchema.statics.storeOTP = async function (customerId, code) {
    return this.findOneAndUpdate(
        { customerId },
        { customerId, code },
        { new: true, upsert: true }
    );
};

OTPSchema.statics.verifyOTP = async function (customerId, code) {
    const otp = await this.findOne({ customerId, code });
    if (otp) {
        await customerModel.updateVerify(customerId);
        await this.deleteOne({ customerId });
        return true;
    }
    return false;
};

OTPSchema.statics.passwordResetVerification = async function (customerId, code) {
    const otp = await this.findOne({ customerId, code });
    if (otp) {
        await this.deleteOne({ customerId });
        return true;
    }
    return false;
};

module.exports = mongoose.model("OTP", OTPSchema);
