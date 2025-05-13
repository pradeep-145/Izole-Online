const express = require("express");
const { OrderController } = require("../controllers/order.controller.js");
const authenticateUser = require("../middlewares/customer.middleware.js");
const extractShiprocketToken = require("../middlewares/shiprocket.middleware.js");

const OrderRoute = express.Router();

OrderRoute.use(authenticateUser);

// Add shiprocket middleware to all routes that need it
OrderRoute.post(
  "/create-order",
  extractShiprocketToken,
  OrderController.createOrder
);
OrderRoute.post(
  "/confirm-payment",
  extractShiprocketToken,
  OrderController.confirmPayment
);
OrderRoute.post("/payment-failed", OrderController.paymentFailed);
OrderRoute.get("/get-orders", OrderController.getOrders);
OrderRoute.get("/get-order/:orderId", OrderController.getOrderById);
OrderRoute.post(
  "/cancel/:orderId",
  extractShiprocketToken,
  OrderController.cancelOrder
);
OrderRoute.put("/update/:orderId", OrderController.updateOrder);
OrderRoute.delete("/delete/:orderId", OrderController.deleteOrder);

module.exports = OrderRoute;
