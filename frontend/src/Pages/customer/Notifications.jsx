import axios from "axios";
import {
  Bell,
  CheckCircle,
  RefreshCcw,
  ShoppingBag,
  Tag,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/customer/notifications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `/api/customer/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/api/customer/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Remove from local state
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification._id !== notificationId
        )
      );

      // Close delete confirmation
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter notifications based on type
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    return notification.type === filter;
  });

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="text-blue-500" size={20} />;
      case "promotion":
        return <Tag className="text-purple-500" size={20} />;
      default:
        return <Bell className="text-wineRed" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Bell className="text-wineRed" size={24} />
          Notifications
        </h1>

        {/* Filter tabs */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-sm rounded-full transition-all ${
              filter === "all"
                ? "bg-wineRed text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("order")}
            className={`px-4 py-2 text-sm rounded-full transition-all ${
              filter === "order"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setFilter("promotion")}
            className={`px-4 py-2 text-sm rounded-full transition-all ${
              filter === "promotion"
                ? "bg-purple-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Promotions
          </button>
          <button
            onClick={fetchNotifications}
            className="ml-auto flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            title="Refresh notifications"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wineRed mb-4"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 border border-gray-200 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-600 mb-2">You have no notifications.</p>
            <p className="text-sm text-gray-500">
              Notifications about your orders and promotions will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white shadow rounded-lg overflow-hidden border transition-all hover:shadow-md
                  ${
                    notification.read
                      ? "border-gray-200"
                      : "border-l-4 border-l-blue-500 border-r border-r-gray-200 border-t border-t-gray-200 border-b border-b-gray-200"
                  }`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                          {notification.title}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircle size={18} className="text-blue-500" />
                        </button>
                      )}
                      <button
                        onClick={() => setShowDeleteConfirm(notification._id)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        title="Delete notification"
                      >
                        <X size={18} className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Delete confirmation */}
                {showDeleteConfirm === notification._id && (
                  <div className="bg-red-50 p-3 flex items-center justify-between border-t border-red-100">
                    <p className="text-sm text-red-700">
                      Delete this notification?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
