const serverless = require('serverless-http');
const app = require('./server.js');
const orderModel=require('./models/order.model.js')
const productModel=require('./models/product.model.js')
const expressHandler = serverless(app);


const eventBridgeHandler = async (event) => {
    console.log('EventBridge event received:', event);

    const { orderId, action } = event; // EventBridge passes the payload directly
    if (action === 'processOrderTimeout') {
        console.log(`Processing timeout for order: ${orderId}`);
        const response= await orderModel.findById(orderId);
        await orderModel.findByIdAndDelete(orderId);
        await productModel.findByIdAndUpdate(response.productId,{$set:{$elemMatch:{'images.color':response.color},$inc:{'images.$.quantity':response.quantity}}})

    
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Event processed successfully!' }),
    };
};


module.exports.handler = async (event, context) => {
    console.log('Lambda function invoked:', event);
    if (event.routeKey=='$default') {
        return expressHandler(event, context);
    }
    return eventBridgeHandler(event);
};