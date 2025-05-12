import { Bell, Check, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../Components/customer/Navbar";
import { useNotifications } from "../../zustand/useNotifications";

const NotificationItem = ({ notification, onRead }) => {
  const navigate = useNavigate();
  const formattedDate = new Date(notification.createdAt).toLocaleString();

  const handleClick = () => {
    if (!notification.read) {
      onRead(notification._id);
    }

    // Handle navigation based on notification type
    if (notification.type === "order") {
      const orderIdMatch = notification.message.match(/#([A-Z0-9]{6})/);
      if (orderIdMatch && orderIdMatch[1]) {
        navigate("/customer/orders"); // Or specific order page if you have the full ID
      } else {
        navigate("/customer/orders");
      }
    }
  };

  return (
    <div
      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-mustard/10 transition-colors duration-200 ${
        !notification.read ? "bg-wineRed/5" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start">
        <div
          className={`mt-1 mr-3 p-2 rounded-full ${
            notification.type === "order"
              ? "bg-blue-100"
              : notification.type === "promotion"
              ? "bg-green-100"
              : "bg-gray-100"
          }`}
        >
          <Bell
            size={16}
            className={
              notification.type === "order"
                ? "text-blue-600"
                : notification.type === "promotion"
                ? "text-green-600"
                : "text-gray-600"
            }
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg text-wineRed">
              {notification.title}
            </h3>
            {!notification.read && (
              <span className="bg-wineRed text-white text-xs px-2 py-1 rounded-full">
                New
              </span>
            )}
          </div>
          <p className="text-gray-700 mt-1">{notification.message}</p>
          <div className="mt-2 text-xs text-gray-500">{formattedDate}</div>
        </div>
      </div>
    </div>
  );
};

const Notifications = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'unread', 'read'

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      await fetchNotifications(true);
      setLoading(false);
    };

    loadNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  // Filter notifications based on current filter
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  return (
    <div className="min-h-screen bg-yellow-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 pt-24">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 mr-3 bg-white rounded-full shadow hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold text-wineRed">Notifications</h1>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-wineRed text-white rounded-md flex items-center hover:bg-wineRed/90"
            >
              <Check size={16} className="mr-2" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md ${
              filter === "all"
                ? "bg-mustard text-wineRed"
                : "bg-white text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-md ${
              filter === "unread"
                ? "bg-mustard text-wineRed"
                : "bg-white text-gray-700"
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-4 py-2 rounded-md ${
              filter === "read"
                ? "bg-mustard text-wineRed"
                : "bg-white text-gray-700"
            }`}
          >
            Read
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          {loading ? (
            <div className="p-10 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-wineRed mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onRead={handleMarkAsRead}
                />
              ))}
            </div>
          ) : (
            <div className="p-10 text-center">
              <Bell size={40} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl font-medium text-gray-700">
                No notifications
              </p>
              <p className="text-gray-500 mt-2">
                {filter === "all"
                  ? "You don't have any notifications yet."
                  : filter === "unread"
                  ? "You don't have any unread notifications."
                  : "You don't have any read notifications."}
              </p>
              <Link
                to="/customer"
                className="mt-4 inline-block px-4 py-2 bg-wineRed text-white rounded-md hover:bg-wineRed/90"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
