const serverless = require("serverless-http");
const app = require("./server.js");
const orderModel = require("./models/order.model.js");
const productModel = require("./models/product.model.js");
const expressHandler = serverless(app);

const eventBridgeHandler = async (event) => {
  console.log("EventBridge event received:", event);

  const { orderId, action } = event; // EventBridge passes the payload directly
  if (action === "processOrderTimeout") {
    try {
      console.log(`Processing timeout for order: ${orderId}`);
      const order = await orderModel.findById(orderId);

      if (!order) {
        console.log(`Order not found: ${orderId}`);
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Order not found" }),
        };
      }

      // Find the product and update the quantity in the correct variant and size
      await productModel.updateOne(
        {
          _id: order.productId,
          "variants.color": order.color,
          "variants.sizeOptions.size": order.size,
        },
        {
          $inc: {
            "variants.$[variant].sizeOptions.$[sizeOption].quantity":
              order.quantity,
          },
        },
        {
          arrayFilters: [
            { "variant.color": order.color },
            { "sizeOption.size": order.size },
          ],
        }
      );

      // Delete the order after updating the inventory
      await orderModel.findByIdAndDelete(orderId);

      console.log(`Successfully processed timeout for order: ${orderId}`);
    } catch (error) {
      console.error(`Error processing order timeout: ${error.message}`);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Error processing order timeout",
          error: error.message,
        }),
      };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Event processed successfully!" }),
  };
};

module.exports.handler = async (event, context) => {
  console.log("Lambda function invoked:", event);
  if (event.routeKey == "$default") {
    return expressHandler(event, context);
  }
  return eventBridgeHandler(event);
};
