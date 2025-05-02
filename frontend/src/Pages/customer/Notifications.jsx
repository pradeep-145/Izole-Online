import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    try {
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

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Bell className="text-wineRed" size={24} />
          Notifications
        </h1>

        {loading ? (
          <p className="text-gray-600">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-600">You have no notifications.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="bg-white shadow rounded-lg p-4 border border-gray-200"
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {notification.title}
                </h2>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;