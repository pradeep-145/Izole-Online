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

      try {
        const productArray = Array.isArray(order.products)
          ? order.products
          : [order.products];

        await Promise.all(
          productArray.map(async (product) => {
            return productModel.updateOne(
              {
                _id: product.id,
                "variants.color": product.color,
                "variants.sizeOptions.size": product.size,
              },
              {
                $inc: {
                  "variants.$[variant].sizeOptions.$[sizeOption].quantity":
                    product.quantity,
                },
              },
              {
                arrayFilters: [
                  { "variant.color": product.color },
                  { "sizeOption.size": product.size },
                ],
              }
            );
          })
        );

        console.log(
          `Successfully restored inventory for all products in order: ${orderId}`
        );
      } catch (inventoryError) {
        console.error(
          `Error restoring product quantities: ${inventoryError.message}`
        );
        // Continue with order deletion even if inventory update fails
      }

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
