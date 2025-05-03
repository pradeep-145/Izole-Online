const router = require("express").Router();
const adminController = require("../controllers/admin.controller.js");

// Dashboard and general routes
router.get("/get", adminController.get);
router.get("/dashboard-analytics", adminController.getDashboardAnalytics);

// Product management routes
router.post("/create-product", adminController.saveProduct);
router.put("/update-product", adminController.updateProduct);
router.delete("/remove-product", adminController.removeProduct);

// Inventory management routes
router.get("/inventory", adminController.getInventory);
router.put("/inventory/update", adminController.updateInventory);

// Order management routes
router.get("/orders", adminController.getOrders);
router.put("/orders/update", adminController.updateOrders);

// Customer management routes
router.get("/customers", adminController.getCustomers);
router.get("/customers/:customerId", adminController.getCustomerDetails);

// Notification routes
router.post("/notifications/send", adminController.sendNotification);

module.exports = router;
