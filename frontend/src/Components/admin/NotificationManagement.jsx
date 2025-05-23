import axios from "axios";
import {
  Bell,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const NotificationManagement = () => {
  // States
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    total: 0,
    unread: 0,
    today: 0,
    growth: 0,
    byType: { order: 0, promotion: 0, general: 0 },
  });
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [showSendForm, setShowSendForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  // Form data for sending notifications
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "general",
  });

  // Fetch notifications
  const fetchNotifications = async (resetPage = false) => {
    setLoading(true);
    try {
      const page = resetPage ? 1 : pagination.page;

      const response = await axios.get(
        "https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/admin/notifications",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          params: {
            page,
            limit: pagination.limit,
            type: typeFilter,
            status: statusFilter,
          },
        }
      );

      setNotifications(response.data.notifications);
      setPagination({
        page: response.data.meta.page,
        limit: response.data.meta.limit,
        total: response.data.meta.total,
        pages: response.data.meta.pages,
      });

      // Refresh analytics
      fetchAnalytics();
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // Fetch notification analytics
  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(
        "https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/admin/notifications/analytics",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  // Fetch customers for dropdown
  const fetchCustomers = async () => {
    if (customers.length > 0) return; // Only fetch once

    setLoadingCustomers(true);
    try {
      const response = await axios.get(
        "https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/admin/customers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      setCustomers(response.data.customers || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to load customers");
    } finally {
      setLoadingCustomers(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/admin/notifications/mark-read/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      // Update local state
      setNotifications(
        notifications.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );

      // Update analytics
      fetchAnalytics();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to update notification");
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await axios.patch(
        "https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/admin/notifications/mark-all-read",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          params: {
            type: typeFilter,
          },
        }
      );

      // Update local state
      setNotifications(
        notifications.map((notification) => ({ ...notification, read: true }))
      );

      // Update analytics
      fetchAnalytics();

      toast.success("Marked all notifications as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to update notifications");
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      await axios.delete(
        `https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/admin/notifications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      // Update local state
      setNotifications(
        notifications.filter((notification) => notification._id !== id)
      );

      // Update analytics
      fetchAnalytics();

      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  // Send notification
  const sendNotification = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Title and message are required");
      return;
    }

    if (selectedCustomers.length === 0) {
      toast.error("Please select at least one customer");
      return;
    }

    try {
      await axios.post(
        "https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/admin/notifications/send",
        {
          ...formData,
          customers: selectedCustomers,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      toast.success(
        `Notification sent to ${selectedCustomers.length} customers`
      );

      // Reset form
      setFormData({
        title: "",
        message: "",
        type: "general",
      });
      setSelectedCustomers([]);
      setShowSendForm(false);

      // Refresh data
      fetchNotifications();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification");
    }
  };

  // Handle pagination
  const changePage = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPagination({ ...pagination, page: newPage });
  };

  // Toggle customer selection
  const toggleCustomerSelection = (customerId) => {
    if (selectedCustomers.includes(customerId)) {
      setSelectedCustomers(selectedCustomers.filter((id) => id !== customerId));
    } else {
      setSelectedCustomers([...selectedCustomers, customerId]);
    }
  };

  // Select all customers
  const selectAllCustomers = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map((customer) => customer._id));
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Apply filters and refresh data
  const applyFilters = () => {
    fetchNotifications(true); // Reset to page 1 when filtering
  };

  // Initial data loading
  useEffect(() => {
    fetchNotifications();
  }, [pagination.page]); // Refetch when page changes

  // Load customers when showing the form
  useEffect(() => {
    if (showSendForm) {
      fetchCustomers();
    }
  }, [showSendForm]);

  return (
    <div className="bg-white rounded-lg shadow-md ">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Notification Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage customer notifications and send new messages
            </p>
          </div>
          <button
            onClick={() => setShowSendForm(!showSendForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Send className="w-4 h-4 mr-2" />
            {showSendForm ? "Cancel" : "Send New Notification"}
          </button>
        </div>
      </div>

      {/* Send Notification Form */}
      {showSendForm && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Send New Notification
          </h3>
          <form onSubmit={sendNotification} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notification Title*
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter notification title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notification Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="general">General</option>
                  <option value="promotion">Promotion</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message Content*
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Enter notification message"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Recipients*
              </label>
              {loadingCustomers ? (
                <div className="text-center p-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-sm text-gray-500">
                    Loading customers...
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-2 flex items-center">
                    <input
                      type="checkbox"
                      id="select-all"
                      checked={
                        selectedCustomers.length === customers.length &&
                        customers.length > 0
                      }
                      onChange={selectAllCustomers}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="select-all"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Select All ({customers.length})
                    </label>
                    <span className="ml-2 text-xs text-blue-600">
                      {selectedCustomers.length} selected
                    </span>
                  </div>

                  <div className="border border-gray-300 rounded-md max-h-60 overflow-y-auto p-2">
                    {customers.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No customers found
                      </p>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {customers.map((customer) => (
                          <li key={customer._id} className="py-2">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`customer-${customer._id}`}
                                checked={selectedCustomers.includes(
                                  customer._id
                                )}
                                onChange={() =>
                                  toggleCustomerSelection(customer._id)
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label
                                htmlFor={`customer-${customer._id}`}
                                className="ml-2 text-sm text-gray-700 cursor-pointer flex items-center"
                              >
                                <img
                                  src={
                                    customer.avatar ||
                                    "https://avatar.iran.liara.run/public/boy"
                                  }
                                  alt={customer.name}
                                  className="h-6 w-6 rounded-full mr-2"
                                />
                                {customer.name} ({customer.email})
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
                disabled={selectedCustomers.length === 0}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Notification
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Notifications</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics.total}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full h-10 w-10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Unread</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics.unread}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full h-10 w-10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Notifications</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics.today}
              </p>
            </div>
            <div
              className={`p-2 ${
                analytics.growth >= 0 ? "bg-green-100" : "bg-red-100"
              } rounded-full h-10 w-10 flex items-center justify-center`}
            >
              <span
                className={`text-sm font-bold ${
                  analytics.growth >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {analytics.growth > 0 ? "+" : ""}
                {analytics.growth}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">By Type</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                  Orders: {analytics.byType.order}
                </span>
                <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                  Promo: {analytics.byType.promotion}
                </span>
                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">
                  General: {analytics.byType.general}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Types</option>
              <option value="order">Order</option>
              <option value="promotion">Promotion</option>
              <option value="general">General</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="read">Read</option>
              <option value="unread">Unread</option>
            </select>
          </div>

          <button
            onClick={applyFilters}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none"
          >
            <Filter className="h-4 w-4 mr-1 text-gray-500" />
            Apply
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => fetchNotifications()}
            className="p-1.5 rounded-full hover:bg-gray-100"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4 text-gray-500" />
          </button>

          {analytics.unread > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Notifications Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center p-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-10">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">
              No notifications found
            </h3>
            <p className="mt-1 text-gray-500">
              {typeFilter !== "all" || statusFilter !== "all" || searchTerm
                ? "Try changing your filters or search term"
                : "Notifications will appear here when they are created"}
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Notification
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.map((notification) => (
                <tr
                  key={notification._id}
                  className={notification.read ? "" : "bg-blue-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap max-w-sm">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 truncate">
                        {notification.title}
                      </span>
                      <p className="text-sm text-gray-500 truncate">
                        {notification.message}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {notification.customerId ? (
                        <>
                          <img
                            src={
                              notification.customerId.avatar ||
                              "https://avatar.iran.liara.run/public/boy"
                            }
                            alt={notification.customerId.name}
                            className="h-8 w-8 rounded-full mr-2"
                          />
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">
                              {notification.customerId.name}
                            </p>
                            <p className="text-gray-500">
                              {notification.customerId.email}
                            </p>
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-500">Unknown</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        notification.type === "order"
                          ? "bg-blue-100 text-blue-800"
                          : notification.type === "promotion"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {notification.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(notification.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        notification.read
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {notification.read ? "Read" : "Unread"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Mark as read"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && notifications.length > 0 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of <span className="font-medium">{pagination.total}</span>{" "}
              notifications
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => changePage(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm ${
                pagination.page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                // Show pages around current page
                let pageNum;
                if (pagination.pages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => changePage(pageNum)}
                    className={`inline-flex items-center px-3 py-2 border rounded-md text-sm ${
                      pagination.page === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => changePage(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm ${
                pagination.page === pagination.pages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationManagement;
