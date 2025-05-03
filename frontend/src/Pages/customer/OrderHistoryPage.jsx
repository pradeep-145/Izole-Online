import {
  Box,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Package,
  Truck,
} from "lucide-react";
import React, { useState } from "react";
import Navbar from "../../Components/customer/Navbar";
import { useOrders } from "../../zustand/useOrders";

const OrderHistoryPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sample order data
  const { orders } = useOrders();

  const getStatusIcon = (status) => {
    switch (status) {
      case "Order Placed":
        return <Calendar size={16} />;
      case "Payment Confirmed":
        return <Check size={16} />;
      case "Processing":
        return <Box size={16} />;
      case "Shipped":
        return <Package size={16} />;
      case "Out for Delivery":
        return <Truck size={16} />;
      case "Delivered":
        return <Check size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get order number from ID (last 6 characters)
  const getOrderNumber = (id) => {
    if (!id) return "";
    return id.slice(-6).toUpperCase();
  };

  // Helper function to generate status timeline
  const generateOrderTimeline = (order) => {
    const statusSteps = [
      {
        status: "Order Placed",
        completed: true,
        date: order.createdAt ? formatDate(order.createdAt) : "N/A",
      },
      {
        status: "Payment Confirmed",
        completed: order.status !== "PENDING",
        date: "N/A",
      },
      {
        status: "Processing",
        completed: ["PROCESSING", "SHIPPED", "DELIVERED"].includes(
          order.status
        ),
        date: "N/A",
      },
      {
        status: "Shipped",
        completed: ["SHIPPED", "DELIVERED"].includes(order.status),
        date: "N/A",
      },
      {
        status: "Delivered",
        completed: order.status === "DELIVERED",
        date: order.deliveredAt ? formatDate(order.deliveredAt) : "N/A",
      },
    ];
    return statusSteps;
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 lg:mt-28 bg-yellow-50">
        <h1 className="text-3xl font-bold mb-8 text-center text-wineRed">
          My Orders
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h2 className="text-xl font-semibold mb-4 text-wineRed">
                Order History
              </h2>
              {orders.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Package size={40} className="mx-auto mb-2 text-gray-300" />
                  <p>You haven't placed any orders yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className={`p-3 rounded-md cursor-pointer transition-all duration-300 hover:bg-mustard flex justify-between items-center ${
                        selectedOrder?._id === order._id
                          ? "bg-gray-100 border-l-4 border-wineRed shadow-md transform scale-[1.02]"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedOrder(order);
                        console.log(order);
                      }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <p className="font-semibold">
                            Order #{getOrderNumber(order._id)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </p>
                        <div className="flex items-center mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              order.status === "DELIVERED"
                                ? "bg-green-100 text-green-800"
                                : order.status === "SHIPPED"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "PROCESSING"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "PENDING"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="font-semibold text-wineRed">
                        ₹{order.totalAmount?.toFixed(2) || "0.00"}
                        </p>
                        <div className="mt-2">
                          <ChevronRight
                            size={16}
                            className="text-gray-400 transform group-hover:translate-x-1 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            {selectedOrder ? (
              <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-500 animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-wineRed">
                      Order #{getOrderNumber(selectedOrder._id)}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Placed on {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`badge badge-lg ${
                      selectedOrder.status === "DELIVERED"
                        ? "bg-green-100 text-green-800"
                        : selectedOrder.status === "SHIPPED"
                        ? "bg-blue-100 text-blue-800"
                        : selectedOrder.status === "PROCESSING"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedOrder.status === "PENDING"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>

                {/* Order Timeline */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex text-wineRed items-center">
                    <Clock className="mr-2 text-[#FFC107]" size={18} /> Order
                    Status
                  </h3>
                  <div className="relative">
                    {generateOrderTimeline(selectedOrder).map((step, index) => (
                      <div
                        key={`status-${index}`}
                        className="flex mb-4 items-start transition-all duration-300 hover:translate-x-1"
                      >
                        <div
                          className={`rounded-full h-6 w-6 flex items-center justify-center mr-3 transition-colors duration-300 ${
                            step.completed
                              ? "bg-wineRed text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          {getStatusIcon(step.status)}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              step.completed ? "text-gray-800" : "text-gray-300"
                            }`}
                          >
                            {step.status}
                          </p>
                          <p className="text-sm text-gray-500">{step.date}</p>
                        </div>
                      </div>
                    ))}
                    <div className="absolute top-0 left-3 w-px bg-gray-300 h-full -z-10 transform -translate-x-1/2"></div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-wineRed">
                    <Package className="mr-2 text-[#FFC107]" size={18} /> Items
                    in this Order
                  </h3>
                  <div className="space-y-4">
                    {selectedOrder.products &&
                      selectedOrder.products.map((item, index) => (
                        <div
                          key={`item-${index}-${item._id || item.productId}`}
                          className="flex items-center p-3 border text-wineRed border-gray-200 rounded-md transition-all duration-300 hover:shadow-md hover:border-wineRed"
                        >
                          <img
                            src={item.image || "/placeholder-product.png"}
                            alt={item.name || "Product"}
                            className="w-20 h-24 object-cover rounded mr-4"
                          />
                          <div className="flex-1 text-wineRed">
                            <p className="font-medium">
                              {item.name || "Product Name"}
                            </p>
                            <div className="text-sm text-gray-600">
                              <p>
                                {item.size && `Size: ${item.size}`}
                                {item.color && ` | Color: ${item.color}`}
                              </p>
                              <p>Quantity: {item.quantity || 1}</p>
                            </div>
                          </div>
                          <div className="font-semibold text-wineRed">
                          ₹{(item.price || 0).toFixed(2)}
                          </div>
                        </div>
                      ))}

                    {(!selectedOrder.products ||
                      selectedOrder.products.length === 0) && (
                      <div className="text-center py-4 text-gray-500">
                        No items found in this order
                      </div>
                    )}
                  </div>
                  <div className="text-right mt-4 font-bold text-lg text-wineRed">
                    Total: ₹{selectedOrder.totalAmount?.toFixed(2) || "0.00"}
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card bg-base-100 shadow-sm p-4 transition-all duration-300 hover:shadow-md">
                    <h3 className="text-lg font-semibold mb-2 flex text-wineRed items-center">
                      <Truck className="mr-2 text-[#FFC107]" size={18} />{" "}
                      Shipping Details
                    </h3>
                    <p className="text-gray-700">
                      {selectedOrder.shippingAddress ||
                        "No shipping address available"}
                    </p>
                  </div>
                  <div className="card bg-base-100 shadow-sm p-4 transition-all duration-300 hover:shadow-md">
                    <h3 className="text-lg font-semibold mb-2 text-wineRed flex items-center">
                      <Check className="mr-2 text-[#FFC107]" size={18} />{" "}
                      Payment Method
                    </h3>
                    <p className="text-gray-700">
                      {selectedOrder.paymentMethod || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-full transition-all duration-300 hover:shadow-lg">
                <Package
                  size={64}
                  className="text-gray-300 mb-4 animate-pulse"
                />
                <p className="text-xl text-gray-500">
                  Select an order to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
