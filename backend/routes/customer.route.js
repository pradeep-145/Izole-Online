const router = require("express").Router();
const customerController = require("../controllers/customer.controller.js");

// Add this route for fetching notifications
router.get("/notifications", customerController.getNotifications);

// Add this route for fetching profile
router.get("/profile", customerController.getProfile);

module.exports = router;