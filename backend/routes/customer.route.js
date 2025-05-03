const router = require("express").Router();
const customerController = require("../controllers/customer.controller.js");
const customerAuth = require("../middlewares/customer.middleware.js");

// Add these routes to the customer router
router.get("/notifications", customerAuth, customerController.getNotifications);
router.put(
  "/notifications/:notificationId/read",
  customerAuth,
  customerController.markNotificationRead
);
router.delete(
  "/notifications/:notificationId",
  customerAuth,
  customerController.deleteNotification
);

// Add this route for fetching profile
router.get("/profile", customerController.getProfile);

module.exports = router;
