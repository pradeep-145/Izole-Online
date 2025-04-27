const router = require("express").Router();
const { OrderController } = require("../controllers/order.controller.js");
router.post("/create-order", OrderController.createOrder);
router.get("/get-orders", OrderController.getOrders);
router.post("/confirm-order", OrderController.confirmOrder);
router.post("/cancel-order", OrderController.cancelOrder);
router.put("/update-order", OrderController.updateOrder);
router.delete("/delete-order", OrderController.deleteOrder);

module.exports = router;
