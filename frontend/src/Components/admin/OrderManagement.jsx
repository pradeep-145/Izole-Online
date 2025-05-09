import axios from "axios";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Filter,
  Package,
  Printer,
  RefreshCw,
  Search,
  Truck,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});

  // Get status color and icon
  const getStatusDetails = (status) => {
    switch (status) {
      case "Pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <AlertCircle className="w-4 h-4 mr-1" />,
        };
      case "Processing":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: <Package className="w-4 h-4 mr-1" />,
        };
      case "Shipped":
        return {
          color: "bg-purple-100 text-purple-800",
          icon: <Truck className="w-4 h-4 mr-1" />,
        };
      case "Delivered":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="w-4 h-4 mr-1" />,
        };
      case "CANCELLED":
        return {
          color: "bg-red-100 text-red-800",
          icon: <AlertCircle className="w-4 h-4 mr-1" />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <AlertCircle className="w-4 h-4 mr-1" />,
        };
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    setIsUpdating(true);
    try {
      await axios.put(
        "/api/admin/orders/update",
        { orderId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      fetchOrders(); // Refresh orders after update

      // If the selected order was updated, update it in the state
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Toggle expanded view for mobile
  const toggleExpanded = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders based on status and search term
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch =
      searchTerm === "" ||
      (order.customerId?.name &&
        order.customerId.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (order._id && order._id.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format address from the structured address object
  const formatAddress = (address) => {
    if (!address) return "No address provided";

    // Check if address is a string (old format) or an object (new format)
    if (typeof address === "string") {
      return address;
    }

    // Format structured address
    const parts = [];
    if (address.firstName)
      parts.push(`${address.firstName} ${address.lastName || ""}`);
    if (address.addressLine1) parts.push(address.addressLine1);
    if (address.addressLine2) parts.push(address.addressLine2);
    if (address.city)
      parts.push(
        `${address.city}, ${address.state || ""} ${address.postalCode || ""}`
      );
    if (address.country) parts.push(address.country);

    return parts.join(", ") || "No address details";
  };

  // Open tracking link in new tab
  const openTrackingLink = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  // Parse shipping info if stored as JSON string
  const parseShippingInfo = (info) => {
    if (!info) return null;
    try {
      return typeof info === "string" ? JSON.parse(info) : info;
    } catch (e) {
      console.error("Error parsing shipping info:", e);
      return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Order Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track customer orders.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm flex items-center hover:bg-gray-50 transition-colors">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
          <button className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm flex items-center hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders or customers..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative w-full md:w-40">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter className="w-4 h-4 text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <button
            onClick={fetchOrders}
            className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            title="Refresh orders"
          >
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Mobile Orders View */}
      <div className="md:hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            <p className="mt-2 text-gray-500">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No orders found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <div key={order._id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-blue-600 font-medium">
                      #{order._id.slice(-6)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                        getStatusDetails(order.status).color
                      }`}
                    >
                      {order.status}
                    </span>
                    <button
                      onClick={() => toggleExpanded(order._id)}
                      className="p-1"
                    >
                      {expandedOrders[order._id] ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedOrders[order._id] && (
                  <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700">
                        Customer
                      </p>
                      <p className="text-sm">
                        {order.customerId?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.customerId?.email || "No email"}
                      </p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700">Items</p>
                      {order.products &&
                        order.products.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm py-1"
                          >
                            <p>
                              {item.name} ({item.color}, {item.size}) x{" "}
                              {item.quantity}
                            </p>
                            <p className="font-medium">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-100 mt-2">
                        <p>Total</p>
                        <p>₹{order.totalAmount?.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Shipping info for mobile */}
                    {order.awb && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700">
                          Shipping Details
                        </p>
                        <p className="text-sm">AWB: {order.awb}</p>
                        {order.trackingUrl && (
                          <button
                            onClick={() => openTrackingLink(order.trackingUrl)}
                            className="text-blue-600 text-sm flex items-center hover:underline"
                          >
                            Track Package{" "}
                            <ExternalLink size={14} className="ml-1" />
                          </button>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Update Status
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        disabled={isUpdating}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Orders Table and Details Split View */}
      <div className="hidden md:flex flex-col md:flex-row">
        {/* Orders Table */}
        <div className="w-full md:w-2/3 overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              <p className="mt-2 text-gray-500">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No orders found.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => setSelectedOrder(order)}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedOrder?._id === order._id ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerId?.name || "Unknown Customer"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.customerId?.email || "No email"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getStatusDetails(order.status).color
                        }`}
                      >
                        {getStatusDetails(order.status).icon}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{order.totalAmount?.toFixed(2) || "0.00"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Order Details Panel */}
        <div className="w-full md:w-1/3 border-l border-gray-200">
          {selectedOrder ? (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Order Details
              </h3>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500">Order ID</p>
                <p className="text-md font-medium text-blue-600">
                  #{selectedOrder._id.slice(-6)}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="mt-1">
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedOrder.status}
                    onChange={(e) =>
                      updateOrderStatus(selectedOrder._id, e.target.value)
                    }
                    disabled={isUpdating}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div className="mt-2 text-sm">
                  <p className="text-gray-500">
                    Payment:{" "}
                    <span
                      className={
                        selectedOrder.paymentStatus === "COMPLETED"
                          ? "text-green-600 font-medium"
                          : "text-amber-600 font-medium"
                      }
                    >
                      {selectedOrder.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500">
                  Customer Information
                </p>
                <p className="text-md font-medium text-gray-900 mt-1">
                  {selectedOrder.customerId?.name || "Unknown Customer"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedOrder.customerId?.email || "No email"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedOrder.customerId?.phoneNumber || "No phone"}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500">
                  Shipping Address
                </p>
                <div className="text-sm text-gray-700 mt-1">
                  {formatAddress(selectedOrder.address)}
                </div>
              </div>

              {/* Shipping Details Section */}
              {(selectedOrder.shipmentId ||
                selectedOrder.awb ||
                selectedOrder.trackingUrl) && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-500">
                    Shipping Details
                  </p>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    {selectedOrder.awb && (
                      <p className="text-sm mb-1">
                        <span className="font-medium">AWB:</span>{" "}
                        {selectedOrder.awb}
                      </p>
                    )}

                    {selectedOrder.shipmentId && (
                      <p className="text-sm mb-1">
                        <span className="font-medium">Shipment ID:</span>{" "}
                        {selectedOrder.shipmentId}
                      </p>
                    )}

                    {selectedOrder.pickupDate && (
                      <p className="text-sm mb-1">
                        <span className="font-medium">Pickup Date:</span>{" "}
                        {formatDate(selectedOrder.pickupDate)}
                      </p>
                    )}

                    {selectedOrder.estimatedDeliveryDate && (
                      <p className="text-sm mb-1">
                        <span className="font-medium">Est. Delivery:</span>{" "}
                        {formatDate(selectedOrder.estimatedDeliveryDate)}
                      </p>
                    )}

                    {selectedOrder.trackingUrl && (
                      <button
                        onClick={() =>
                          openTrackingLink(selectedOrder.trackingUrl)
                        }
                        className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <Truck className="w-4 h-4 mr-1" />
                        Track Package
                        <ExternalLink size={14} className="ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Parse shipping info if stored as JSON string */}
              {selectedOrder.shippingInfo && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-500">
                    Shipping Method
                  </p>
                  <div className="mt-1">
                    {(() => {
                      const shippingInfo = parseShippingInfo(
                        selectedOrder.shippingInfo
                      );
                      if (!shippingInfo)
                        return (
                          <p className="text-sm text-gray-500">
                            No shipping details
                          </p>
                        );

                      return (
                        <div className="text-sm text-gray-700">
                          <p>
                            <span className="font-medium">Carrier:</span>{" "}
                            {shippingInfo.courier_name || "Standard Shipping"}
                          </p>
                          {shippingInfo.rate && (
                            <p>
                              <span className="font-medium">Shipping Fee:</span>{" "}
                              ₹{shippingInfo.rate.toFixed(2)}
                            </p>
                          )}
                          {shippingInfo.estimated_delivery_days && (
                            <p>
                              <span className="font-medium">
                                Delivery Estimate:
                              </span>{" "}
                              {shippingInfo.estimated_delivery_days} days
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500">Order Items</p>
                <div className="mt-2 space-y-2">
                  {selectedOrder.products &&
                    selectedOrder.products.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between p-2 border-b border-gray-100"
                      >
                        <div className="flex items-center space-x-2">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          {!item.image && (
                            <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0"></div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.color}, {item.size} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">
                    ₹{selectedOrder.totalAmount?.toFixed(2) || "0.00"}
                  </p>
                </div>

                {/* Calculate and display shipping cost from shippingInfo or shippingCharge */}
                {(() => {
                  let shippingCost = selectedOrder.shippingCharge || 0;

                  // Try to get shipping cost from shippingInfo if not directly available
                  if (!shippingCost && selectedOrder.shippingInfo) {
                    const shippingInfo = parseShippingInfo(
                      selectedOrder.shippingInfo
                    );
                    if (shippingInfo && shippingInfo.rate) {
                      shippingCost = shippingInfo.rate;
                    }
                  }

                  return (
                    <div className="flex justify-between mt-1">
                      <p className="text-sm font-medium text-gray-500">
                        Shipping
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {shippingCost > 0
                          ? `₹${shippingCost.toFixed(2)}`
                          : "Free"}
                      </p>
                    </div>
                  );
                })()}

                <div className="flex justify-between mt-4 text-lg font-bold">
                  <p>Total</p>
                  <p>₹{selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
