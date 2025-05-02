const Notification = require("../models/notification.model.js");
const Customer = require("../models/customer.model.js");

const customerController = {
  // Fetch notifications for the logged-in customer
  getNotifications: async (req, res) => {
    try {
      const customerId = req.user._id; // Assuming `req.user` contains the authenticated user's data
      const notifications = await Notification.find({ customerId }).sort({
        createdAt: -1,
      });
      res.status(200).json({ success: true, notifications });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ success: false, message: "Failed to fetch notifications" });
    }
  },

  // Fetch profile for the logged-in customer
  getProfile: async (req, res) => {
    try {
      const customerId = req.user._id; // Assuming `req.user` contains the authenticated user's data
      const profile = await Customer.findById(customerId).select(
        "name email phone address avatar createdAt"
      );
      res.status(200).json({ success: true, profile });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ success: false, message: "Failed to fetch profile" });
    }
  },
};

module.exports = customerController;