const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    mobileNo: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified:{
        type:Boolean,
        default:false
    }
}, {
    timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;