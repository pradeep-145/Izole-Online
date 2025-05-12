const Notification = require("../models/notification.model.js");
const customerModel = require("../models/customer.model.js");
const mongoose = require("mongoose");

const AdminNotificationController = {
  // Get all notifications (admin view)
  getAllNotifications: async (req, res) => {
    try {
      const { type, limit = 50, page = 1, status } = req.query;
      const skip = (page - 1) * limit;

      const query = {};

      // Filter by type if specified
      if (type && type !== "all") {
        query.type = type;
      }

      // Filter by read status if specified
      if (status === "read") {
        query.read = true;
      } else if (status === "unread") {
        query.read = false;
      }

      // Get notifications with populated customer details
      const notifications = await Notification.find(query)
        .populate("customerId", "name email avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const total = await Notification.countDocuments(query);

      // Get counts for dashboard indicators
      const unreadCount = await Notification.countDocuments({ read: false });
      const todayCount = await Notification.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      });

      res.status(200).json({
        success: true,
        notifications,
        meta: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
          unreadCount,
          todayCount,
        },
      });
    } catch (error) {
      console.error("Error fetching admin notifications:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch notifications",
        error: error.message,
      });
    }
  },

  // Mark notification as read (admin view)
  markAsRead: async (req, res) => {
    try {
      const { notificationId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid notification ID format",
        });
      }

      const notification = await Notification.findByIdAndUpdate(
        notificationId,
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
      const { type } = req.query;
      const query = {};

      if (type && type !== "all") {
        query.type = type;
      }

      query.read = false; // Only update unread notifications

      const result = await Notification.updateMany(query, {
        $set: { read: true },
      });

      res.status(200).json({
        success: true,
        message: `Marked ${result.modifiedCount} notifications as read`,
        modifiedCount: result.modifiedCount,
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({
        success: false,
        message: "Failed to mark notifications as read",
        error: error.message,
      });
    }
  },

  // Create and send notification to customer(s)
  sendNotification: async (req, res) => {
    try {
      const { customers, title, message, type = "general" } = req.body;

      if (!title || !message) {
        return res.status(400).json({
          success: false,
          message: "Title and message are required",
        });
      }

      if (!customers || !Array.isArray(customers) || customers.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one customer must be specified",
        });
      }

      // Validate customer IDs
      const validCustomers = customers.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );

      if (validCustomers.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid customer IDs provided",
        });
      }

      // Check if customers exist
      const existingCustomers = await customerModel
        .find({
          _id: { $in: validCustomers },
        })
        .select("_id");

      if (existingCustomers.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No valid customers found",
        });
      }

      // Create notifications for each customer
      const notificationPromises = existingCustomers.map((customer) => {
        return Notification.create({
          customerId: customer._id,
          title,
          message,
          type,
          read: false,
        });
      });

      await Promise.all(notificationPromises);

      res.status(201).json({
        success: true,
        message: `Sent notifications to ${existingCustomers.length} customer(s)`,
        count: existingCustomers.length,
      });
    } catch (error) {
      console.error("Error sending notifications:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send notifications",
        error: error.message,
      });
    }
  },

  // Delete a notification
  deleteNotification: async (req, res) => {
    try {
      const { notificationId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid notification ID format",
        });
      }

      const notification = await Notification.findByIdAndDelete(notificationId);

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete notification",
        error: error.message,
      });
    }
  },

  // Get notification analytics for admin dashboard
  getNotificationAnalytics: async (req, res) => {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const [
        totalCount,
        unreadCount,
        todayCount,
        yesterdayCount,
        orderNotifications,
        promotionNotifications,
        generalNotifications,
      ] = await Promise.all([
        Notification.countDocuments({}),
        Notification.countDocuments({ read: false }),
        Notification.countDocuments({ createdAt: { $gte: today } }),
        Notification.countDocuments({
          createdAt: { $gte: yesterday, $lt: today },
        }),
        Notification.countDocuments({ type: "order" }),
        Notification.countDocuments({ type: "promotion" }),
        Notification.countDocuments({ type: "general" }),
      ]);

      // Calculate growth percentage
      const growthPercentage =
        yesterdayCount === 0
          ? todayCount * 100
          : ((todayCount - yesterdayCount) / yesterdayCount) * 100;

      res.status(200).json({
        success: true,
        analytics: {
          total: totalCount,
          unread: unreadCount,
          today: todayCount,
          yesterday: yesterdayCount,
          growth: parseFloat(growthPercentage.toFixed(2)),
          byType: {
            order: orderNotifications,
            promotion: promotionNotifications,
            general: generalNotifications,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching notification analytics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch notification analytics",
        error: error.message,
      });
    }
  },
};

module.exports = AdminNotificationController;
