const mongoose = require('mongoose');
const Order=mongoose.model('Order',{
    customerName:{
        type:String,
        required:true
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    },
    totalPrice:{
        type:Number,
        required :true
    },
    status:{
        type:String,
        required:true
    }


})
module.exports=Order;