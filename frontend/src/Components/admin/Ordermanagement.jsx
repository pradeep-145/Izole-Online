import {
  Check,
  ChevronLeft,
  Clock,
  Package,
  Search,
  Truck,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAdmin } from "../../zustand/useAdmin";

const OrderManagement = () => {
  const { fetchOrders, updateOrderStatus, isLoading } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({ status: "", searchTerm: "" });
  const [activeOrder, setActiveOrder] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [page, limit, filters]);

  const loadOrders = async () => {
    const queryFilters = { ...filters };
    if (queryFilters.searchTerm) {
      queryFilters.search = queryFilters.searchTerm;
      delete queryFilters.searchTerm;
    }

    const result = await fetchOrders(page, limit, queryFilters);
    if (result.orders) {
      setOrders(result.orders);
      setTotalOrders(result.totalCount);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setShowStatusDropdown(null);

        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        toast.error(result.message || "Failed to update order status");
      }
    } catch (error) {
      toast.error("An error occurred while updating the order");
    }
  };

  const viewOrderDetails = (order) => {
    setActiveOrder(order);
  };

  const closeOrderDetails = () => {
    setActiveOrder(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "Processing":
        return <Package className="w-4 h-4 text-blue-500" />;
      case "Shipped":
        return <Truck className="w-4 h-4 text-purple-500" />;
      case "Delivered":
        return <Check className="w-4 h-4 text-green-500" />;
      case "Canceled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalPages = Math.ceil(totalOrders / limit);

  return (
    <div className="bg-white rounded-lg shadow">
      {activeOrder ? (
        <div className="p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={closeOrderDetails}
              className="p-2 rounded-full hover:bg-gray-100 mr-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold">Order Details</h2>
          </div>

          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Order Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Order ID:</div>
                  <div>{activeOrder._id}</div>
                  <div className="text-gray-600">Date:</div>
                  <div>
                    {new Date(activeOrder.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-gray-600">Status:</div>
                  <div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                        activeOrder.status
                      )}`}
                    >
                      {activeOrder.status}
                    </span>
                  </div>
                  <div className="text-gray-600">Total Amount:</div>
                  <div className="font-medium">
                    ₹{activeOrder.totalAmount.toFixed(2)}
                  </div>
                  <div className="text-gray-600">Payment Method:</div>
                  <div>{activeOrder.paymentMethod}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Customer Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Name:</div>
                  <div>{activeOrder.shippingAddress.name}</div>
                  <div className="text-gray-600">Email:</div>
                  <div>
                    {activeOrder.user ? activeOrder.user.email : "Guest"}
                  </div>
                  <div className="text-gray-600">Phone:</div>
                  <div>{activeOrder.shippingAddress.phone}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm">
                {activeOrder.shippingAddress.street},{" "}
                {activeOrder.shippingAddress.city},{" "}
                {activeOrder.shippingAddress.state}{" "}
                {activeOrder.shippingAddress.zipCode},{" "}
                {activeOrder.shippingAddress.country}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Variant
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Size
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {item.productName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.color}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        ₹{item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-medium">Order Summary</h3>
            </div>
            <div className="text-right">
              <div className="flex justify-end items-center space-x-4">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  ₹{activeOrder.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-end items-center space-x-4">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">
                  ₹
                  {activeOrder.shippingCost
                    ? activeOrder.shippingCost.toFixed(2)
                    : "0.00"}
                </span>
              </div>
              <div className="flex justify-end items-center space-x-4 font-bold mt-2">
                <span className="text-gray-900">Total:</span>
                <span className="text-gray-900">
                  ₹
                  {(
                    activeOrder.totalAmount + (activeOrder.shippingCost || 0)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(activeOrder._id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Update Status
              </button>

              {showStatusDropdown === activeOrder._id && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  {[
                    "Pending",
                    "Processing",
                    "Shipped",
                    "Delivered",
                    "Canceled",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        handleStatusChange(activeOrder._id, status)
                      }
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h2 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">
                Order Management
              </h2>

              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search orders..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      value={filters.searchTerm}
                      onChange={(e) =>
                        setFilters({ ...filters, searchTerm: e.target.value })
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
                  >
                    Search
                  </button>
                </form>

                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm w-full sm:w-auto"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order ID
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
                    Total
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
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{order._id.slice(-6)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.shippingAddress.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.user ? order.user.email : "Guest"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span
                            className={`ml-1 px-2 py-1 text-xs rounded-full ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        ₹{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-xs font-medium"
                          >
                            View
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => setShowStatusDropdown(order._id)}
                              className="px-3 py-1 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 text-xs font-medium"
                            >
                              Update
                            </button>

                            {showStatusDropdown === order._id && (
                              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                                {[
                                  "Pending",
                                  "Processing",
                                  "Shipped",
                                  "Delivered",
                                  "Canceled",
                                ].map((status) => (
                                  <button
                                    key={status}
                                    onClick={() =>
                                      handleStatusChange(order._id, status)
                                    }
                                    className="block w-full text-left px-3 py-1 text-xs text-gray-700 hover:bg-gray-100"
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {orders.length} of {totalOrders} orders
            </div>
            <div className="flex-1 flex justify-between sm:justify-end">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white ${
                  page === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white ${
                  page >= totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
