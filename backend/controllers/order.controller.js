
const orderModel = require('../models/order.model.js');
exports.OrderController={
    addOrder:async(req,res)=>{
        try {
            
        } catch (error) {
            
        }
    },
    getOrders:async (req,res)=>{
        const user=req.user;
        try {
            const response=await orderModel.find({customerId:user._id})
            res.status(200).json(response);
        } catch (error) {
            console.log("Error in getting orders",error);
            res.status(500).json({message:"Error in getting orders"});
        }
    }
}