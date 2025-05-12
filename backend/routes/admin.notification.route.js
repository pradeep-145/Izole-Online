const express = require("express");
const router = express.Router();
const AdminNotificationController = require("../controllers/admin.notification.controller");

// All routes require admin authentication
// Get notifications with filtering
router.get("/", AdminNotificationController.getAllNotifications);

// Get notification analytics
router.get("/analytics", AdminNotificationController.getNotificationAnalytics);

// Mark notifications as read
router.patch(
  "/mark-read/:notificationId",
  AdminNotificationController.markAsRead
);
router.patch("/mark-all-read", AdminNotificationController.markAllAsRead);

// Send notification to customers
router.post("/send", AdminNotificationController.sendNotification);

// Delete notification
router.delete(
  "/:notificationId",
  AdminNotificationController.deleteNotification
);

module.exports = router;
