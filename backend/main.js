const serverless = require('serverless-http');
const app = require('./server.js');
const orderModel=require('./models/order.model.js')

const expressHandler = serverless(app);


const eventBridgeHandler = async (event) => {
    console.log('EventBridge event received:', event);

    const { orderId, action } = event; // EventBridge passes the payload directly
    if (action === 'processOrderTimeout') {
        console.log(`Processing timeout for order: ${orderId}`);
        const response= await orderModel.findById(orderId);
        await orderModel.findByIdAndDelete(orderId); 

    
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

    // Otherwise, assume it's an EventBridge event
    return eventBridgeHandler(event);
};