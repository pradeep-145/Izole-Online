import {
  AlertCircle,
  Box,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Package,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/customer/Navbar";
import { useOrders } from "../../zustand/useOrders";

const OrderHistoryPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  // Get orders and fetch function from Zustand store
  const { orders, fetchOrders, cancelOrder, isLoading } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelOrder = async () => {
    if (!selectedOrder || !cancelReason.trim()) return;

    setCancelLoading(true);
    try {
      await cancelOrder(selectedOrder._id, cancelReason);
      setShowCancelModal(false);
      setCancelReason("");
      // Refresh orders after cancellation
      fetchOrders(true);
    } catch (error) {
      console.error("Error canceling order:", error);
    } finally {
      setCancelLoading(false);
    }
  };

  // Check if order can be canceled (before pickup)
  const canCancelOrder = (order) => {
    // Can only cancel if status is Pending or Processing and not picked up
    return (
      (order.status === "Pending" || order.status === "Processing") &&
      (!order.pickupDate || new Date(order.pickupDate) > new Date())
    );
  };

  // Format complete address from address object or string
  const formatAddress = (address) => {
    if (!address) return "Address not available";

    // Handle string address format
    if (typeof address === "string") {
      return address;
    }

    // Handle object address format
    if (typeof address === "object") {
      return `${address.firstName || ""} ${address.lastName || ""}, 
              ${address.addressLine1 || ""}, 
              ${address.addressLine2 ? `${address.addressLine2}, ` : ""}
              ${address.city || ""}, ${address.state || ""}, 
              ${address.postalCode || ""}
              ${address.country ? `${address.country}` : ""}
              ${address.phone ? `Phone: ${address.phone}` : ""}`;
    }

    return "Address format not recognized";
  };

  // Parse shipping info from JSON string if needed
  const parseShippingInfo = (info) => {
    if (!info) return null;

    try {
      if (typeof info === "string") {
        const parsed = JSON.parse(info);
        return {
          courierName: parsed.courier_name || "Standard Shipping",
          estimatedDeliveryDays: parsed.estimated_delivery_days || "N/A",
          rate: parsed.rate || 0,
        };
      }
      return info;
    } catch (e) {
      console.error("Error parsing shipping info:", e);
      return { courierName: "Standard Shipping" };
    }
  };

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
        completed: order.paymentStatus === "COMPLETED",
        date:
          order.paymentStatus === "COMPLETED"
            ? formatDate(order.updatedAt)
            : "N/A",
      },
      {
        status: "Processing",
        completed: ["Processing", "Shipped", "Delivered"].includes(
          order.status
        ),
        date:
          order.status === "Processing" ? formatDate(order.updatedAt) : "N/A",
      },
      {
        status: "Shipped",
        completed: ["Shipped", "Delivered"].includes(order.status),
        date: order.pickupDate ? formatDate(order.pickupDate) : "N/A",
      },
      {
        status: "Delivered",
        completed: order.status === "Delivered",
        date:
          order.status === "Delivered"
            ? formatDate(order.updatedAt)
            : order.estimatedDeliveryDate
            ? `Est. ${formatDate(order.estimatedDeliveryDate)}`
            : "N/A",
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

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <div className="loader animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wineRed"></div>
          </div>
        )}

        {orders.length === 0 && !isLoading && (
          <div className="bg-white p-10 rounded-lg shadow-md text-center">
            <Package size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't placed any orders yet.
            </p>
            <Link
              to="/customer/products"
              className="btn bg-wineRed hover:bg-wineRed/90 text-white"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {orders.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h2 className="text-xl font-semibold mb-4 text-wineRed flex items-center">
                  <Package className="mr-2 text-[#FFC107]" size={20} /> Order
                  History
                </h2>
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
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "Processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "Pending"
                                ? "bg-gray-100 text-gray-800"
                                : order.status === "CANCELLED"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
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
              </div>
            </div>

            <div className="md:col-span-2">
              {selectedOrder ? (
                <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-500 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-wineRed">
                        Order #{getOrderNumber(selectedOrder._id)}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(selectedOrder.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-3 items-center mt-3 sm:mt-0">
                      <span
                        className={`badge badge-lg ${
                          selectedOrder.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : selectedOrder.status === "Shipped"
                            ? "bg-blue-100 text-blue-800"
                            : selectedOrder.status === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : selectedOrder.status === "Pending"
                            ? "bg-gray-100 text-gray-800"
                            : selectedOrder.status === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedOrder.status}
                      </span>

                      {canCancelOrder(selectedOrder) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCancelModal(true);
                          }}
                          className="btn btn-sm bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          Cancel Order
                        </button>
                      )}

                      <Link
                        to={`/customer/order/${selectedOrder._id}`}
                        className="btn btn-sm bg-wineRed text-white hover:bg-wineRed/90"
                      >
                        Details
                      </Link>
                    </div>
                  </div>

                  {selectedOrder.status === "CANCELLED" && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center">
                        <AlertCircle size={18} className="text-red-600 mr-2" />
                        <h3 className="font-medium text-red-700">
                          Order Cancelled
                        </h3>
                      </div>
                      {selectedOrder.cancelReason && (
                        <p className="mt-1 text-sm text-red-600">
                          Reason: {selectedOrder.cancelReason}
                        </p>
                      )}
                      {selectedOrder.cancelledAt && (
                        <p className="mt-1 text-xs text-gray-500">
                          Cancelled on {formatDate(selectedOrder.cancelledAt)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Payment Status */}
                  <div className="mb-4 flex items-center">
                    <div
                      className={`px-3 py-2 rounded-md ${
                        selectedOrder.paymentStatus === "COMPLETED"
                          ? "bg-green-50"
                          : "bg-yellow-50"
                      }`}
                    >
                      <span className="text-sm font-medium mr-2">Payment:</span>
                      <span
                        className={`text-sm ${
                          selectedOrder.paymentStatus === "COMPLETED"
                            ? "text-green-700"
                            : "text-yellow-700"
                        }`}
                      >
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex text-wineRed items-center">
                      <Clock className="mr-2 text-[#FFC107]" size={18} /> Order
                      Status
                    </h3>
                    <div className="relative">
                      {generateOrderTimeline(selectedOrder).map(
                        (step, index) => (
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
                                  step.completed
                                    ? "text-gray-800"
                                    : "text-gray-300"
                                }`}
                              >
                                {step.status}
                              </p>
                              <p className="text-sm text-gray-500">
                                {step.date}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                      <div className="absolute top-0 left-3 w-px bg-gray-300 h-full -z-10 transform -translate-x-1/2"></div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-wineRed">
                      <Package className="mr-2 text-[#FFC107]" size={18} />{" "}
                      Order Items
                    </h3>
                    <div className="space-y-2">
                      {selectedOrder.products &&
                        selectedOrder.products
                          .slice(0, 2)
                          .map((item, index) => (
                            <div
                              key={`item-${index}-${item._id || item.id}`}
                              className="flex items-center p-3 border text-wineRed border-gray-200 rounded-md"
                            >
                              <img
                                src={item.image || "/placeholder-product.png"}
                                alt={item.name || "Product"}
                                className="w-16 h-20 object-cover rounded mr-4"
                              />
                              <div className="flex-1 text-wineRed">
                                <p className="font-medium">{item.name}</p>
                                <div className="text-xs text-gray-600 mt-1">
                                  <p>
                                    {item.size && `Size: ${item.size}`}
                                    {item.color && ` | Color: ${item.color}`}
                                  </p>
                                  <p className="mt-1">
                                    Qty: {item.quantity || 1}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-wineRed">
                                  ₹{(item.price || 0).toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Total: ₹
                                  {(
                                    (item.price || 0) * (item.quantity || 1)
                                  ).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          ))}

                      {selectedOrder.products &&
                        selectedOrder.products.length > 2 && (
                          <div className="text-center pt-2">
                            <Link
                              to={`/customer/order/${selectedOrder._id}`}
                              className="text-wineRed hover:text-wineRed/80 text-sm underline"
                            >
                              +{selectedOrder.products.length - 2} more items
                            </Link>
                          </div>
                        )}

                      {(!selectedOrder.products ||
                        selectedOrder.products.length === 0) && (
                        <div className="text-center py-4 text-gray-500">
                          No items found in this order
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between mt-4 pt-3 border-t border-gray-200">
                      <div>
                        {selectedOrder.shippingInfo && (
                          <div className="text-sm text-gray-600">
                            <p>
                              Shipping:{" "}
                              {parseShippingInfo(selectedOrder.shippingInfo)
                                ?.courierName || "Standard Shipping"}
                            </p>
                            {parseShippingInfo(selectedOrder.shippingInfo)
                              ?.estimatedDeliveryDays && (
                              <p>
                                Est. Delivery:{" "}
                                {
                                  parseShippingInfo(selectedOrder.shippingInfo)
                                    .estimatedDeliveryDays
                                }{" "}
                                days
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="font-bold text-lg text-wineRed">
                        Total: ₹
                        {selectedOrder.totalAmount?.toFixed(2) || "0.00"}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address Preview */}
                  <div className="flex justify-between">
                    <div className="card bg-base-100 shadow-sm p-4 transition-all duration-300 hover:shadow-md max-w-sm w-full">
                      <h3 className="text-lg font-semibold mb-2 flex text-wineRed items-center">
                        <Truck className="mr-2 text-[#FFC107]" size={18} />{" "}
                        Shipping Address
                      </h3>
                      <p className="text-gray-700 text-sm whitespace-pre-line">
                        {formatAddress(selectedOrder.address)}
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
        )}
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-wineRed">Cancel Order</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Reason for cancellation
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 min-h-[100px]"
                placeholder="Please provide a reason for cancellation..."
              ></textarea>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={cancelLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300"
                disabled={cancelLoading || !cancelReason.trim()}
              >
                {cancelLoading ? "Processing..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
