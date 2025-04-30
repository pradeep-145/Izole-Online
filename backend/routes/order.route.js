const router = require("express").Router();
const { OrderController } = require("../controllers/order.controller.js");

const customerAuth = require("../middlewares/customer.middleware.js");
router.post("/create-order", customerAuth, OrderController.createOrder);
router.post("/confirm-payment", customerAuth, OrderController.confirmPayment);
router.get("/get-orders", customerAuth, OrderController.getOrders);
router.post("/confirm-order", OrderController.confirmOrder);
router.post("/cancel-order", OrderController.cancelOrder);
router.put("/update-order/:orderId", OrderController.updateOrder);
router.delete("/delete-order/:orderId", OrderController.deleteOrder);
router.get("/order/:orderId", customerAuth, OrderController.getOrderById);


module.exports = router;
