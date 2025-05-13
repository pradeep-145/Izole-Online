const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/notification.controller");
const authenticateJWT = require("../middlewares/customer.middleware.js");

// Routes that require authentication
router.get(
  "/get-notifications",
  authenticateJWT,
  NotificationController.getUserNotifications
);
router.patch(
  "/mark-read/:notificationId",
  authenticateJWT,
  NotificationController.markAsRead
);
router.patch(
  "/mark-all-read",
  authenticateJWT,
  NotificationController.markAllAsRead
);

// Admin-only routes (should be protected with admin middleware in production)
router.post("/create", NotificationController.createNotification);

module.exports = router;
