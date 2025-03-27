const productSchema = require('./product.model.js')
const mongoose = require('mongoose');
const Order= new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  sessionId: { type: String, required: true, index: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'COMPLETED', 'CANCELLED'], 
    default: 'PENDING',
    index: true
  },
  delivery:{
    type: String, 
    enum: ['PENDING', 'COMPLETED', 'CANCELLED'], 
    default: 'PENDING',
    index: true
  }


})

Order.statics.storeOrder=async function(params) {
    
  return this.create({  
    params
  })
}


module.exports=mongoose.model('Order',Order); 