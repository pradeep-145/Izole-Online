import axios from "axios";
import {
  Activity,
  Mail,
  RefreshCw,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [notification, setNotification] = useState({
    title: "",
    message: "",
    type: "general",
  });
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch customers
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/customers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setCustomers(response.data.customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customer details
  const fetchCustomerDetails = async (customerId) => {
    try {
      const response = await axios.get(`/api/admin/customers/${customerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setCustomerDetails(response.data);
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  // Send notification
  const sendNotification = async () => {
    if (!notification.title || !notification.message) {
      return;
    }

    setIsSending(true);
    try {
      await axios.post(
        "/api/admin/notifications/send",
        {
          customerId: selectedCustomer._id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      setSuccessMessage("Notification sent successfully");
      setNotification({ title: "", message: "", type: "general" });
      setShowNotificationForm(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error sending notification:", error);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      fetchCustomerDetails(selectedCustomer._id);
    }
  }, [selectedCustomer]);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      searchTerm === "" ||
      (customer.name &&
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.email &&
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Customer Management
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          View and manage customer information.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={fetchCustomers}
          className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          title="Refresh customers"
        >
          <RefreshCw className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="m-4 p-3 bg-green-100 text-green-800 rounded-md flex items-center justify-between">
          <span className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {successMessage}
          </span>
          <button
            onClick={() => setSuccessMessage("")}
            className="text-green-800"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Customers Table and Details Split View */}
      <div className="flex flex-col md:flex-row">
        {/* Customers Table */}
        <div className="w-full md:w-1/2 overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              <p className="mt-2 text-gray-500">Loading customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No customers found.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    onClick={() => setSelectedCustomer(customer)}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedCustomer?._id === customer._id ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.name || "No Name"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {customer._id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {customer.email || "No email"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(customer.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Customer Details Panel */}
        <div className="w-full md:w-1/2 border-l border-gray-200">
          {selectedCustomer ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Customer Details
                </h3>
                <button
                  onClick={() => setShowNotificationForm(!showNotificationForm)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Send Notification
                </button>
              </div>

              {/* Notification Form */}
              {showNotificationForm && (
                <div className="mb-8 p-4 bg-gray-50 rounded-md border border-gray-200 animate-fade-in">
                  <h4 className="text-md font-medium text-gray-800 mb-3">
                    Send Notification
                  </h4>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notification Type
                    </label>
                    <select
                      value={notification.type}
                      onChange={(e) =>
                        setNotification({
                          ...notification,
                          type: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="general">General</option>
                      <option value="promotion">Promotion</option>
                      <option value="order">Order Update</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={notification.title}
                      onChange={(e) =>
                        setNotification({
                          ...notification,
                          title: e.target.value,
                        })
                      }
                      placeholder="Notification title"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      value={notification.message}
                      onChange={(e) =>
                        setNotification({
                          ...notification,
                          message: e.target.value,
                        })
                      }
                      placeholder="Notification message"
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowNotificationForm(false)}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={sendNotification}
                      disabled={
                        isSending ||
                        !notification.title ||
                        !notification.message
                      }
                      className={`px-3 py-1.5 text-white text-sm rounded-md flex items-center
                        ${
                          isSending ||
                          !notification.title ||
                          !notification.message
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                      {isSending && (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      )}
                      Send
                    </button>
                  </div>
                </div>
              )}

              {/* Personal Info */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Personal Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedCustomer.name || "No name provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedCustomer.email || "No email provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedCustomer.phone || "No phone provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Registered</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(selectedCustomer.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Address
                </h4>
                {selectedCustomer.address ? (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-800">
                      {selectedCustomer.address.street},{" "}
                      {selectedCustomer.address.city}
                      <br />
                      {selectedCustomer.address.state},{" "}
                      {selectedCustomer.address.postalCode}
                      <br />
                      {selectedCustomer.address.country}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No address provided</p>
                )}
              </div>

              {/* Order History */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <ShoppingBag className="w-4 h-4 mr-1" />
                  Order History
                </h4>

                {customerDetails && customerDetails.orders ? (
                  customerDetails.orders.length > 0 ? (
                    <div className="space-y-3">
                      {customerDetails.orders.map((order) => (
                        <div
                          key={order._id}
                          className="p-3 bg-gray-50 rounded-md"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-blue-600">
                                #{order._id.slice(-6)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "Shipped"
                                  ? "bg-purple-100 text-purple-800"
                                  : order.status === "Processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "CANCELLED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-sm font-medium text-gray-900">
                              ₹{order.totalAmount?.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.orderItems?.length || 0} items
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No order history</p>
                  )
                ) : (
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Activity */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <Activity className="w-4 h-4 mr-1" />
                  Recent Activity
                </h4>

                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">
                    Activity tracking coming soon
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">Select a customer to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;
