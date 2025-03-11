const mongoose=require('mongoose')

const Review=mongoose.Schema({
    customerName:{
        type:String,
        required:true
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    review:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model("Review",Review);