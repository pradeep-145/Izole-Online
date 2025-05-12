const Notification = require("../models/notification.model.js");

const NotificationController = {
  // Get all notifications for a user
  getUserNotifications: async (req, res) => {
    try {
      const customerId = req.user._id;
      const notifications = await Notification.find({ customerId })
        .sort({ createdAt: -1 })
        .limit(50);

      res.status(200).json({
        success: true,
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch notifications",
        error: error.message,
      });
    }
  },

  // Mark notification as read
  markAsRead: async (req, res) => {
    try {
      const { notificationId } = req.params;
      const customerId = req.user._id;

      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, customerId },
        { read: true },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      res.status(200).json({
        success: true,
        notification,
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({
        success: false,
        message: "Failed to mark notification as read",
        error: error.message,
      });
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (req, res) => {
    try {
      const customerId = req.user._id;

      await Notification.updateMany(
        { customerId, read: false },
        { read: true }
      );

      res.status(200).json({
        success: true,
        message: "All notifications marked as read",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({
        success: false,
        message: "Failed to mark all notifications as read",
        error: error.message,
      });
    }
  },

  // Create a new notification (for admin or system use)
  createNotification: async (req, res) => {
    try {
      const { customerId, title, message, type } = req.body;

      // Validate required fields
      if (!customerId || !title || !message) {
        return res.status(400).json({
          success: false,
          message: "Customer ID, title and message are required",
        });
      }

      const notification = await Notification.create({
        customerId,
        title,
        message,
        type: type || "general",
      });

      res.status(201).json({
        success: true,
        notification,
      });
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create notification",
        error: error.message,
      });
    }
  },
};

module.exports = NotificationController;
