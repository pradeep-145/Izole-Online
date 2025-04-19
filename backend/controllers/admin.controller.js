const orders=require('../models/order.model.js')
const products=require('../models/product.model.js')
const customer=require('../models/customer.model.js')
const adminController={
    get:async(req,res)=>{
        try{
            const response=await orders.find({})
            const productsResponse=await products.find({})
            const customerResponse=await customer.find({})
            res.status(200).json({
                orders:response,
                products:productsResponse,
                customers:customerResponse
            })
        }catch(error){
            console.log("Error in admin get",error);
            res.status(500).json({error:"Internal server error"})
        }
    },
    updateOrders:async (req,res)=>{
        const {orderId, status }=req.body;
        try{
            const response=await orders.findOneAndUpdate({_id:orderId}, {status:status}, {new:true})
            res.status(200).json(response)
        }catch(error){
            console.log("Error in admin update", error);
            res.status(500).json({error:"Internal server error"})
        }
    }

}

module.exports=adminController;