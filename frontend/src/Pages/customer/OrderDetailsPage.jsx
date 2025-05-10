import {
  AlertCircle,
  ArrowLeft,
  Box,
  Calendar,
  Check,
  Clock,
  Download,
  ExternalLink,
  Package,
  Receipt,
  Truck,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/customer/Navbar";
import { useOrders } from "../../zustand/useOrders";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState(null);

  const { fetchOrderDetails, cancelOrder, currentOrder, isLoading, error } =
    useOrders();

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId, fetchOrderDetails]);

  // Parse shipping info when order changes
  useEffect(() => {
    if (currentOrder?.shippingInfo) {
      try {
        if (typeof currentOrder.shippingInfo === "string") {
          const parsedInfo = JSON.parse(currentOrder.shippingInfo);
          setShippingInfo(parsedInfo);
        } else {
          setShippingInfo(currentOrder.shippingInfo);
        }
      } catch (e) {
        console.error("Error parsing shipping info:", e);
        setShippingInfo(null);
      }
    }
  }, [currentOrder]);

  const handleCancelOrder = async () => {
    if (!orderId || !cancelReason.trim()) return;

    setCancelLoading(true);
    try {
      const result = await cancelOrder(orderId, cancelReason);
      if (result.success) {
        setShowCancelModal(false);
        setCancelReason("");
        // Refresh order details after cancellation
        fetchOrderDetails(orderId, true);
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    } finally {
      setCancelLoading(false);
    }
  };

  // Check if order can be canceled (before pickup)
  const canCancelOrder = (order) => {
    if (!order) return false;
    // Can only cancel if status is Pending or Processing and not picked up
    return (
      (order.status === "Pending" || order.status === "Processing") &&
      (!order.pickupDate || new Date(order.pickupDate) > new Date())
    );
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

  // Format address from address object or string
  const formatAddress = (address) => {
    if (!address) return "Address not available";

    // If address is a string, return it directly
    if (typeof address === "string") {
      return <p className="whitespace-pre-line">{address}</p>;
    }

    // If address is an object
    if (typeof address === "object") {
      return (
        <div className="space-y-1">
          <p className="font-medium">
            {address.firstName} {address.lastName}
          </p>
          <p>{address.addressLine1}</p>
          {address.addressLine2 && <p>{address.addressLine2}</p>}
          <p>
            {address.city}, {address.state}, {address.postalCode}
          </p>
          <p>{address.country}</p>
          <p className="pt-1">📞 {address.phone}</p>
          <p>📧 {address.email}</p>
        </div>
      );
    }

    return <p>Address format not recognized</p>;
  };

  // Get order number from ID (last 6 characters)
  const getOrderNumber = (id) => {
    if (!id) return "";
    return id.slice(-6).toUpperCase();
  };

  // Generate order timeline status
  const generateOrderTimeline = (order) => {
    if (!order) return [];

    const statusSteps = [
      {
        status: "Order Placed",
        description: "Your order has been placed",
        completed: true,
        date: order.createdAt ? formatDate(order.createdAt) : "N/A",
        icon: <Calendar size={18} />,
      },
      {
        status: "Payment Confirmed",
        description:
          order.paymentStatus === "COMPLETED"
            ? "Payment has been confirmed"
            : "Awaiting payment confirmation",
        completed: order.paymentStatus === "COMPLETED",
        date:
          order.paymentStatus === "COMPLETED"
            ? formatDate(order.updatedAt)
            : "Pending",
        icon: <Check size={18} />,
      },
      {
        status: "Processing",
        description: "Your order is being processed",
        completed: ["Processing", "Shipped", "Delivered"].includes(
          order.status
        ),
        date:
          order.status === "Processing"
            ? formatDate(order.updatedAt)
            : ["Shipped", "Delivered"].includes(order.status)
            ? "Completed"
            : "Pending",
        icon: <Box size={18} />,
      },
      {
        status: "Shipped",
        description: order.awb
          ? `Tracking #: ${order.awb}`
          : "Order will be shipped soon",
        completed: ["Shipped", "Delivered"].includes(order.status),
        date: order.pickupDate ? formatDate(order.pickupDate) : "Pending",
        icon: <Package size={18} />,
      },
      {
        status: "Out for Delivery",
        description: "Your package is out for delivery",
        completed:
          order.status === "Out for Delivery" || order.status === "Delivered",
        date:
          order.status === "Out for Delivery"
            ? formatDate(order.updatedAt)
            : order.status === "Delivered"
            ? "Completed"
            : "Pending",
        icon: <Truck size={18} />,
      },
      {
        status: "Delivered",
        description:
          order.status === "Delivered"
            ? "Your order has been delivered"
            : order.estimatedDeliveryDate
            ? `Estimated delivery by ${formatDate(order.estimatedDeliveryDate)}`
            : "Delivery pending",
        completed: order.status === "Delivered",
        date:
          order.status === "Delivered"
            ? formatDate(order.updatedAt)
            : "Pending",
        icon: <Check size={18} />,
      },
    ];

    return statusSteps;
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-6xl mx-auto p-6 lg:mt-28 bg-yellow-50 min-h-screen flex justify-center items-center">
          <div className="loader animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-wineRed"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="max-w-6xl mx-auto p-6 lg:mt-28 bg-yellow-50 min-h-[50vh]">
          <div className="bg-red-50 border border-red-200 p-4 rounded-md flex items-start">
            <AlertCircle className="text-red-600 mt-1 mr-3" size={20} />
            <div>
              <h3 className="font-semibold text-red-700">
                Error loading order
              </h3>
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => navigate("/customer/orders")}
                className="mt-3 text-wineRed hover:underline flex items-center"
              >
                <ArrowLeft size={16} className="mr-1" /> Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div>
        <Navbar />
        <div className="max-w-6xl mx-auto p-6 lg:mt-28 bg-yellow-50 min-h-[50vh]">
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md flex items-start">
            <AlertCircle className="text-yellow-600 mt-1 mr-3" size={20} />
            <div>
              <h3 className="font-semibold text-yellow-700">Order not found</h3>
              <p className="text-yellow-600">
                The order you're looking for could not be found.
              </p>
              <button
                onClick={() => navigate("/customer/orders")}
                className="mt-3 text-wineRed hover:underline flex items-center"
              >
                <ArrowLeft size={16} className="mr-1" /> Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 lg:mt-28 bg-yellow-50">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link
              to="/customer/orders"
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-wineRed">
              Order Details
            </h1>
          </div>
          {canCancelOrder(currentOrder) && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="btn bg-red-600 hover:bg-red-700 text-white"
            >
              Cancel Order
            </button>
          )}
        </div>

        {/* Order header information */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4 mb-4">
            <div>
              <div className="flex items-center mb-1">
                <h2 className="text-xl font-bold text-wineRed mr-3">
                  Order #{getOrderNumber(currentOrder._id)}
                </h2>
                <span
                  className={`badge ${
                    currentOrder.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : currentOrder.status === "Shipped"
                      ? "bg-blue-100 text-blue-800"
                      : currentOrder.status === "Processing"
                      ? "bg-yellow-100 text-yellow-800"
                      : currentOrder.status === "Pending"
                      ? "bg-gray-100 text-gray-800"
                      : currentOrder.status === "CANCELLED"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {currentOrder.status}
                </span>
              </div>
              <p className="text-gray-600">
                Placed on {formatDate(currentOrder.createdAt)}
              </p>
            </div>
            <div className="mt-2 sm:mt-0 flex flex-col sm:items-end">
              <span className="text-xs text-gray-600 mb-1">Payment Status</span>
              <span
                className={`badge ${
                  currentOrder.paymentStatus === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : currentOrder.paymentStatus === "Refunded"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {currentOrder.paymentStatus}
              </span>
            </div>
          </div>

          {/* Cancelled order message */}
          {currentOrder.status === "CANCELLED" && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertCircle size={18} className="text-red-600 mr-2" />
                <h3 className="font-medium text-red-700">Order Cancelled</h3>
              </div>
              {currentOrder.cancelReason && (
                <p className="mt-1 text-sm text-red-600">
                  Reason: {currentOrder.cancelReason}
                </p>
              )}
              {currentOrder.cancelledAt && (
                <p className="mt-1 text-xs text-gray-500">
                  Cancelled on {formatDate(currentOrder.cancelledAt)}
                </p>
              )}
            </div>
          )}

          {/* Order IDs and References */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="text-sm">
              <p className="text-gray-500">Order ID:</p>
              <p className="font-medium">{currentOrder._id}</p>
            </div>
            {currentOrder.shipmentId && (
              <div className="text-sm">
                <p className="text-gray-500">Shipment ID:</p>
                <p className="font-medium">{currentOrder.shipmentId}</p>
              </div>
            )}
            {currentOrder.paymentSessionId && (
              <div className="text-sm mt-2">
                <p className="text-gray-500">Payment Reference:</p>
                <p className="font-medium text-xs break-words">
                  {currentOrder.paymentSessionId}
                </p>
              </div>
            )}
          </div>

          {/* Track shipment button - conditionally rendered */}
          {(currentOrder.status === "Shipped" ||
            currentOrder.status === "Out for Delivery") &&
            currentOrder.trackingUrl && (
              <div className="flex justify-center my-4">
                <a
                  href={currentOrder.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-wineRed text-white px-6 py-3 rounded-md inline-flex items-center hover:bg-wineRed/90 transition-colors"
                >
                  <Truck size={18} className="mr-2" />
                  Track Shipment
                  <ExternalLink size={16} className="ml-2" />
                </a>
              </div>
            )}

          {/* AWB Number display if available */}
          {currentOrder.awb && (
            <div className="bg-blue-50 p-3 rounded-md border border-blue-100 mt-4">
              <div className="flex items-center">
                <Package size={18} className="text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-blue-800">
                    Tracking Number (AWB):
                  </p>
                  <p className="font-medium text-blue-900">
                    {currentOrder.awb}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Timeline */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-6 flex text-wineRed items-center">
                <Clock className="mr-2 text-[#FFC107]" size={18} /> Order
                Timeline
              </h3>

              <div className="relative">
                {generateOrderTimeline(currentOrder).map((step, index) => (
                  <div
                    key={`status-${index}`}
                    className={`flex mb-6 items-start ${
                      !step.completed && "opacity-60"
                    }`}
                  >
                    <div
                      className={`rounded-full h-8 w-8 flex items-center justify-center mr-4 ${
                        step.completed
                          ? "bg-wineRed text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{step.status}</p>
                      <p className="text-sm text-gray-600">
                        {step.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{step.date}</p>
                    </div>
                  </div>
                ))}
                <div className="absolute top-0 left-4 w-px bg-gray-300 h-[calc(100%-2rem)] -z-10 transform -translate-x-1/2"></div>
              </div>
            </div>

            {/* Customer & Shipping Info */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4 flex text-wineRed items-center">
                <User className="mr-2 text-[#FFC107]" size={18} /> Customer
                Information
              </h3>
              <div className="mb-6">
                <h4 className="text-sm text-gray-500 mb-2">Shipping Address</h4>
                {formatAddress(currentOrder.address)}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm text-gray-500 mb-2">Shipping Details</h4>
                <div className="space-y-1">
                  {shippingInfo ? (
                    <>
                      <p className="font-medium">
                        {shippingInfo.courier_name || "Standard Shipping"}
                      </p>
                      {shippingInfo.estimated_delivery_days && (
                        <p className="text-sm">
                          Estimated Delivery:{" "}
                          {shippingInfo.estimated_delivery_days} days
                        </p>
                      )}
                      {shippingInfo.rate > 0 && (
                        <p className="text-sm text-gray-600">
                          Shipping Cost: ₹{shippingInfo.rate?.toFixed(2)}
                        </p>
                      )}
                    </>
                  ) : (
                    <p>{currentOrder.shippingInfo || "Standard Shipping"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 flex text-wineRed items-center">
                <Receipt className="mr-2 text-[#FFC107]" size={18} /> Payment
                Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">
                    {currentOrder.paymentMethod || "Online Payment"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span
                    className={`font-medium ${
                      currentOrder.paymentStatus === "COMPLETED"
                        ? "text-green-600"
                        : currentOrder.paymentStatus === "Refunded"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {currentOrder.paymentStatus}
                  </span>
                </div>

                {/* Conditionally show payment link */}
                {currentOrder.paymentLink &&
                  currentOrder.paymentStatus !== "COMPLETED" && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <a
                        href={currentOrder.paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
                      >
                        <Receipt size={14} className="mr-1" />
                        Complete Payment
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Order items and summary */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-6 flex text-wineRed items-center">
                <Package className="mr-2 text-[#FFC107]" size={20} /> Order
                Items
              </h3>

              {currentOrder.products && currentOrder.products.length > 0 ? (
                <div className="space-y-4">
                  {currentOrder.products.map((item, index) => (
                    <div
                      key={`item-${index}-${item._id || item.id}`}
                      className="flex items-center p-4 border border-gray-200 rounded-md hover:border-wineRed/60 transition-colors"
                    >
                      <img
                        src={item.image || "/placeholder-product.png"}
                        alt={item.name || "Product"}
                        className="w-20 h-24 object-cover rounded mr-4"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-wineRed">
                          {item.name}
                        </h4>
                        <div className="text-sm text-gray-600 mt-1">
                          {item.size && (
                            <span className="mr-3">Size: {item.size}</span>
                          )}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                        <div className="mt-2 flex items-center">
                          <span className="text-gray-600">
                            ₹{(item.price || 0).toFixed(2)} ×{" "}
                            {item.quantity || 1}
                          </span>
                        </div>
                      </div>
                      <div className="font-semibold text-wineRed text-right">
                        ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Package size={40} className="mx-auto mb-2 text-gray-300" />
                  <p>No items found in this order</p>
                </div>
              )}

              {/* Order Summary */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-wineRed mb-4">
                  Order Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>
                      ₹
                      {(
                        currentOrder.totalAmount -
                        (shippingInfo?.rate || currentOrder.shippingCharge || 0)
                      ).toFixed(2)}
                    </span>
                  </div>

                  {(shippingInfo?.rate > 0 ||
                    currentOrder.shippingCharge > 0) && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>
                        ₹
                        {(
                          shippingInfo?.rate || currentOrder.shippingCharge
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold pt-2 border-t border-gray-200 text-wineRed">
                    <span>Total</span>
                    <span>₹{currentOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Invoice Download */}
              <div className="mt-6 flex justify-center">
                <button className="btn bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center">
                  <Download size={16} className="mr-2" />
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
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

export default OrderDetailsPage;
