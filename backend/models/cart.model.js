const mongoose= require('mongoose');

const Cart = new mongoose.Schema({
    user:{
        type: String,
        required: true
    },
    products:[{
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity:{
            type: Number,
            required: true,
            default: 1
        }
    }]

})

module.exports=mongoose.model("Cart",Cart);