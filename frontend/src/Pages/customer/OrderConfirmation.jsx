import confetti from "canvas-confetti";
import {
  Calendar,
  Check,
  ChevronRight,
  ExternalLink,
  MapPin,
  Package,
  Receipt,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../Components/customer/Navbar";
import { useOrders } from "../../zustand/useOrders";

const OrderConfirmation = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { fetchOrderDetails } = useOrders();

  // Extract orderId from URL parameters
  const orderIdParam = params.get("orderDetails") || "";
  const orderId = orderIdParam.includes("_")
    ? orderIdParam.split("_")[1]
    : orderIdParam;

  const [animationComplete, setAnimationComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shippingInfo, setShippingInfo] = useState(null);

  // Animation states
  const [showCheck, setShowCheck] = useState(false);
  const [showOrderInfo, setShowOrderInfo] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger confetti effect
  useEffect(() => {
    if (showConfetti) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Use olive and gold colors
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#556B2F", "#8B7500", "#6B8E23", "#DAA520"],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#556B2F", "#8B7500", "#6B8E23", "#DAA520"],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [showConfetti]);

  useEffect(() => {
    const loadOrderDetails = async () => {
      setLoading(true);
      try {
        // Then load order details
        const { success, order, error } = await fetchOrderDetails(orderId);

        if (success && order) {
          setOrderDetails(order);

          // Parse shipping info if available
          if (order.shippingInfo) {
            try {
              const parsedInfo =
                typeof order.shippingInfo === "string"
                  ? JSON.parse(order.shippingInfo)
                  : order.shippingInfo;
              setShippingInfo(parsedInfo);
            } catch (err) {
              console.error("Error parsing shipping info:", err);
            }
          }
        } else {
          throw new Error(error || "Failed to load order details");
        }
      } catch (err) {
        console.error("Error loading order:", err);
        setError("Failed to load your order details.");
      } finally {
        setLoading(false);
      }
    };

    // Start animation sequence
    setTimeout(() => {
      setShowCheck(true);
      setTimeout(() => {
        setAnimationComplete(true);
        setTimeout(() => {
          setShowOrderInfo(true);
          setTimeout(() => {
            setShowConfetti(true);
          }, 500);
        }, 500);
      }, 1000);
    }, 500);

    // Load order data
    loadOrderDetails();

    // Clear any pending order data from localStorage
    localStorage.removeItem("pendingOrderId");
    localStorage.removeItem("pendingOrderDetails");
  }, [orderId, fetchOrderDetails, params]);

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "Not available";

    if (typeof address === "string") {
      return address;
    }

    return `${address.firstName} ${address.lastName}, 
            ${address.address || ""}, 
            ${address.city}, ${address.state},
            ${address.country} - ${address.postalCode}
            Phone: ${address.phone}`;
  };

  // Format date for better readability
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate estimated delivery date based on shipping info
  const getEstimatedDeliveryDate = () => {
    if (!orderDetails) return "Not available";

    if (orderDetails.estimatedDeliveryDate) {
      return formatDate(orderDetails.estimatedDeliveryDate);
    }

    if (shippingInfo?.estimated_delivery_days) {
      const createdDate = new Date(orderDetails.createdAt);
      const estimatedDate = new Date(createdDate);
      estimatedDate.setDate(
        createdDate.getDate() + parseInt(shippingInfo.estimated_delivery_days)
      );
      return formatDate(estimatedDate);
    }

    // Default fallback
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 5);
    return formatDate(defaultDate);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-olive-800 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-olive-800 font-medium">Processing your order...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !orderDetails) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-yellow-50 pt-16">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <div className="text-red-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-olive-800 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "We couldn't find details for your order."}
            </p>
            <button
              onClick={() => navigate("/customer/orders")}
              className="bg-olive-700 text-white px-6 py-2 rounded-md hover:bg-olive-800 transition-all"
            >
              View Your Orders
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-yellow-50 pt-20 pb-20">
        <div className="max-w-3xl mx-auto px-4">
          {/* Success Animation - Enhanced */}
          <div className="text-center mb-10">
            <div className="relative mx-auto mb-10">
              <div className="w-32 h-32 relative mx-auto">
                {/* Pulse effect behind checkmark */}
                <div
                  className={`absolute inset-0 rounded-full bg-olive-300 opacity-70
                  ${showCheck ? "animate-ping" : "opacity-0"} 
                  transition-all duration-1000`}
                ></div>

                {/* Main circle background */}
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br from-olive-600 to-olive-800
                  ${showCheck ? "scale-100 opacity-100" : "scale-0 opacity-0"} 
                  transition-all duration-700 transform shadow-xl`}
                ></div>

                {/* Added stronger glow effect for visibility */}
                <div
                  className={`absolute inset-0 rounded-full shadow-[0_0_15px_rgba(85,107,47,0.7)]
                  ${animationComplete ? "opacity-70" : "opacity-0"} 
                  transition-all duration-700`}
                ></div>

                {/* Tick mark with improved visibility */}
                <div
                  className={`absolute inset-0 flex items-center justify-center
                  ${animationComplete ? "opacity-100" : "opacity-0"} 
                  transition-all duration-500 delay-300`}
                >
                  {/* SVG check with stronger stroke and highlight effect */}
                  <svg
                    className="w-16 h-16 drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
                    viewBox="0 0 24 24"
                  >
                    <path
                      className="checkmark__check"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="30"
                      strokeDashoffset={animationComplete ? "0" : "30"}
                      d="M5 13l4 4L19 7"
                      style={{
                        transition: "stroke-dashoffset 0.7s ease-in-out 0.4s",
                        filter: "drop-shadow(0 0 2px rgba(0,0,0,0.3))",
                      }}
                    />
                  </svg>
                </div>
              </div>
            </div>

            <h1
              className={`text-3xl md:text-4xl font-bold text-olive-800 mb-3 drop-shadow-sm
              ${
                showOrderInfo
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-4"
              }
              transition-all duration-700`}
            >
              Thank You for Your Order!
            </h1>
            <p
              className={`text-lg text-olive-700 max-w-md mx-auto
              ${
                showOrderInfo
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-4"
              }
              transition-all duration-700 delay-100`}
            >
              Your order has been confirmed and is now being processed.
            </p>
          </div>

          {/* Order Information Card */}
          <div
            className={`bg-white rounded-lg shadow-xl overflow-hidden border border-olive-100
            ${
              showOrderInfo
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-8"
            }
            transition-all duration-700 delay-200`}
          >
            {/* Order header with improved gradient for better contrast */}
            <div className="bg-gradient-to-r from-olive-700 to-olive-800 text-white p-6 shadow-sm">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center text-white drop-shadow-sm">
                  <Package className="mr-2 filter drop-shadow" size={24} />
                  Order #{orderDetails._id.slice(-8)}
                </h2>
                <p className="text-white text-sm">
                  {formatDate(orderDetails.createdAt)}
                </p>
              </div>

              <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-md p-3 flex items-center">
                <div className="mr-3 bg-white/30 rounded-full p-1.5">
                  <Calendar size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-white">Estimated Delivery</p>
                  <p className="text-sm font-medium text-white">
                    {getEstimatedDeliveryDate()}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Status - Highlighted with better contrast */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-yellow-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Receipt className="text-olive-800 mr-2" size={20} />
                  <span className="text-olive-900 font-medium">
                    Payment Status
                  </span>
                </div>
                <span
                  className={`${
                    orderDetails.paymentStatus === "COMPLETED"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-yellow-100 text-yellow-800 border-yellow-300"
                  } px-4 py-1.5 rounded-full text-sm font-semibold border shadow-sm`}
                >
                  {orderDetails.paymentStatus}
                </span>
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center mb-4">
                <ShoppingBag className="text-olive-700 mr-2" size={20} />
                <h3 className="font-semibold text-lg text-olive-800">
                  Order Summary
                </h3>
              </div>

              <div className="space-y-4 mb-6">
                {orderDetails.products &&
                  orderDetails.products.map((product, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:border-olive-200 transition-colors"
                    >
                      <img
                        src={product.image || "/placeholder-product.png"}
                        alt={product.name || "Product"}
                        className="w-20 h-24 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-olive-900">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {product.color && `Color: ${product.color}`}
                          {product.size && ` • Size: ${product.size}`}
                          {` • Qty: ${product.quantity || 1}`}
                        </p>
                        <p className="text-olive-700 font-medium mt-2">
                          ₹{product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="font-semibold text-olive-800">
                        ₹{(product.price * (product.quantity || 1)).toFixed(2)}
                      </div>
                    </div>
                  ))}
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-olive-50 p-5 rounded-md shadow-sm">
                {/* Calculate subtotal excluding shipping */}
                <div className="flex justify-between py-1.5">
                  <span className="text-olive-700">Subtotal</span>
                  <span className="font-medium text-olive-800">
                    ₹
                    {(
                      orderDetails.totalAmount - (shippingInfo?.rate || 0)
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-olive-700">Shipping</span>
                  <span className="font-medium text-olive-800">
                    {shippingInfo?.rate
                      ? `₹${shippingInfo.rate.toFixed(2)}`
                      : "Free"}
                  </span>
                </div>
                <div className="border-t border-olive-200 mt-2 pt-3 flex justify-between font-bold">
                  <span className="text-olive-900">Total</span>
                  <span className="text-olive-900 text-lg">
                    ₹{orderDetails.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center mb-5">
                <MapPin className="text-olive-700 mr-2" size={20} />
                <h3 className="font-semibold text-lg text-olive-800">
                  Shipping Details
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 p-4 rounded-md">
                  <h4 className="text-sm text-olive-700 font-medium mb-2">
                    Shipping Address
                  </h4>
                  <p className="text-olive-900 whitespace-pre-line">
                    {formatAddress(orderDetails.address)}
                  </p>
                </div>

                <div className="bg-olive-50 p-4 rounded-md">
                  <h4 className="text-sm text-olive-700 font-medium mb-2">
                    Shipping Method
                  </h4>
                  <p className="text-olive-900 font-medium">
                    {shippingInfo?.courier_name || "Standard Shipping"}
                  </p>

                  <div className="mt-3 bg-white/70 rounded-md p-3">
                    <div className="flex items-center">
                      <Truck className="text-olive-600 mr-2" size={16} />
                      <span className="text-sm font-medium text-olive-800">
                        {orderDetails.status === "Pending"
                          ? "Your order is being processed"
                          : orderDetails.status}
                      </span>
                    </div>
                    {shippingInfo?.estimated_delivery_days && (
                      <p className="text-xs text-olive-600 mt-1 pl-7">
                        Estimated delivery in{" "}
                        {shippingInfo.estimated_delivery_days} days
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 flex flex-col sm:flex-row justify-between gap-3 bg-gray-50">
              <button
                onClick={() => navigate("/customer/orders")}
                className="px-5 py-3 border-2 border-olive-700 text-olive-800 rounded-md hover:bg-olive-50 transition-colors flex items-center justify-center font-semibold shadow-sm"
              >
                View Your Orders
              </button>

              {orderDetails.paymentStatus !== "COMPLETED" &&
                orderDetails.paymentLink && (
                  <a
                    href={orderDetails.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center font-semibold shadow-sm"
                  >
                    <span className="drop-shadow-sm">Complete Payment</span>
                    <ExternalLink size={16} className="ml-2 drop-shadow-sm" />
                  </a>
                )}

              <button
                onClick={() => navigate("/customer/products")}
                className="px-5 py-3 bg-gradient-to-br from-olive-600 to-olive-800 text-white rounded-md hover:opacity-95 transition-colors flex items-center justify-center font-semibold shadow-md"
              >
                <span className="drop-shadow-sm">Continue Shopping</span>
                <ChevronRight size={16} className="ml-2 drop-shadow-sm" />
              </button>
            </div>
          </div>

          {/* Order Tracking Steps */}
          <div
            className={`mt-8 bg-white rounded-lg shadow-xl p-6 border border-olive-100
            ${
              showOrderInfo
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-8"
            }
            transition-all duration-700 delay-300`}
          >
            <h3 className="font-semibold text-xl text-olive-800 mb-6 flex items-center">
              <Truck className="mr-2 text-olive-700" size={20} />
              Order Status Tracker
            </h3>

            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-6 top-0 ml-px border-l-2 border-dashed border-olive-200 h-full"></div>

              {/* Steps */}
              <div className="space-y-8">
                {/* Step 1: Order Confirmed - Always completed */}
                <div className="flex items-center">
                  <div className="z-10 flex items-center justify-center w-12 h-12 bg-green-100 rounded-full shadow-md border-2 border-green-300">
                    <Check className="w-6 h-6 text-green-700 drop-shadow-sm" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-olive-900 font-semibold">
                      Order Confirmed
                    </h4>
                    <p className="text-sm text-olive-700">
                      Your order has been placed successfully
                    </p>
                    <p className="text-xs text-olive-600 mt-1">
                      {formatDate(orderDetails.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Step 2: Payment Confirmed */}
                <div className="flex items-center">
                  <div
                    className={`z-10 flex items-center justify-center w-12 h-12 ${
                      orderDetails.paymentStatus === "COMPLETED"
                        ? "bg-green-100 border-2 border-green-300"
                        : "bg-gray-100 border-2 border-gray-200"
                    } rounded-full shadow-md`}
                  >
                    {orderDetails.paymentStatus === "COMPLETED" ? (
                      <Check className="w-6 h-6 text-green-700 drop-shadow-sm" />
                    ) : (
                      <Receipt className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div className="ml-4">
                    <h4
                      className={`font-semibold ${
                        orderDetails.paymentStatus === "COMPLETED"
                          ? "text-olive-900"
                          : "text-gray-500"
                      }`}
                    >
                      Payment Confirmed
                    </h4>
                    <p
                      className={`text-sm ${
                        orderDetails.paymentStatus === "COMPLETED"
                          ? "text-olive-700"
                          : "text-gray-500"
                      }`}
                    >
                      {orderDetails.paymentStatus === "COMPLETED"
                        ? "Your payment has been confirmed"
                        : "Awaiting payment confirmation"}
                    </p>
                    {orderDetails.paymentStatus === "COMPLETED" && (
                      <p className="text-xs text-olive-600 mt-1">
                        {formatDate(orderDetails.updatedAt)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Step 3: Processing */}
                <div className="flex items-center">
                  <div
                    className={`z-10 flex items-center justify-center w-12 h-12 ${
                      orderDetails.status === "Processing" ||
                      orderDetails.status === "Shipped" ||
                      orderDetails.status === "Delivered"
                        ? "bg-green-100 border-2 border-green-300"
                        : "bg-gray-100 border-2 border-gray-200"
                    } rounded-full shadow-md`}
                  >
                    {orderDetails.status === "Processing" ||
                    orderDetails.status === "Shipped" ||
                    orderDetails.status === "Delivered" ? (
                      <Check className="w-6 h-6 text-green-700 drop-shadow-sm" />
                    ) : (
                      <Package className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div className="ml-4">
                    <h4
                      className={`font-semibold ${
                        orderDetails.status === "Processing" ||
                        orderDetails.status === "Shipped" ||
                        orderDetails.status === "Delivered"
                          ? "text-olive-900"
                          : "text-gray-500"
                      }`}
                    >
                      Processing
                    </h4>
                    <p className="text-sm text-olive-700">
                      Your order is being processed
                    </p>
                  </div>
                </div>

                {/* Step 4: Shipped */}
                <div className="flex items-center">
                  <div
                    className={`z-10 flex items-center justify-center w-12 h-12 ${
                      orderDetails.status === "Shipped" ||
                      orderDetails.status === "Delivered"
                        ? "bg-green-100 border-2 border-green-300"
                        : "bg-gray-100 border-2 border-gray-200"
                    } rounded-full shadow-md`}
                  >
                    {orderDetails.status === "Shipped" ||
                    orderDetails.status === "Delivered" ? (
                      <Check className="w-6 h-6 text-green-700 drop-shadow-sm" />
                    ) : (
                      <Truck className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div className="ml-4">
                    <h4
                      className={`font-semibold ${
                        orderDetails.status === "Shipped" ||
                        orderDetails.status === "Delivered"
                          ? "text-olive-900"
                          : "text-gray-500"
                      }`}
                    >
                      Shipped
                    </h4>
                    <p className="text-sm text-olive-700">
                      {orderDetails.awb
                        ? `Tracking #: ${orderDetails.awb}`
                        : "Your items will be shipped soon"}
                    </p>
                  </div>
                </div>

                {/* Step 5: Delivered */}
                <div className="flex items-center">
                  <div
                    className={`z-10 flex items-center justify-center w-12 h-12 ${
                      orderDetails.status === "Delivered"
                        ? "bg-green-100 border-2 border-green-300"
                        : "bg-gray-100 border-2 border-gray-200"
                    } rounded-full shadow-md`}
                  >
                    {orderDetails.status === "Delivered" ? (
                      <Check className="w-6 h-6 text-green-700 drop-shadow-sm" />
                    ) : (
                      <MapPin className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div className="ml-4">
                    <h4
                      className={`font-semibold ${
                        orderDetails.status === "Delivered"
                          ? "text-olive-900"
                          : "text-gray-500"
                      }`}
                    >
                      Delivered
                    </h4>
                    <p className="text-sm text-olive-700">
                      {orderDetails.status === "Delivered"
                        ? "Your items have been delivered"
                        : `Estimated delivery by ${getEstimatedDeliveryDate()}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Support */}
          <div
            className={`mt-6 text-center
            ${
              showOrderInfo
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-8"
            }
            transition-all duration-700 delay-400`}
          >
            <div className="bg-olive-50 p-4 rounded-lg border border-olive-200 inline-block shadow-sm">
              <p className="text-olive-900">
                Need help with your order?{" "}
                <Link
                  to="#"
                  className="text-olive-800 font-semibold hover:underline"
                >
                  Contact Customer Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles for better animation and visibility */}
      <style jsx="true">{`
        .checkmark__check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke 0.5s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }

        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </>
  );
};

export default OrderConfirmation;
