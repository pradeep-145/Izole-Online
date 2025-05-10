const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller.js");


// Admin routes
router.get("/", adminController.get);
router.get("/inventory", adminController.getInventory);
router.get("/inventory/stats", adminController.getInventoryStats);
router.get("/orders", adminController.getOrders);
router.get("/customers", adminController.getCustomers);
router.get("/customers/:customerId", adminController.getCustomerDetails);
router.get("/analytics", adminController.getDashboardAnalytics);
router.get("/report", adminController.generateReport);

router.post("/add-product", adminController.saveProduct);
router.post("/inventory/fix-issues", adminController.fixInventoryIssues);

// Fix the route that was causing the error
router.post("/inventory/update", adminController.updateInventoryItem);

router.put("/orders/update", adminController.updateOrders);
router.put("/update-product", adminController.updateProduct);
router.put("/inventory/bulk-update", adminController.bulkUpdateInventory);

router.delete("/remove-product", adminController.removeProduct);

module.exports = router;
