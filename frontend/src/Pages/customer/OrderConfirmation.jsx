import axios from "axios";
import {
  Check,
  ChevronRight,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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

  // Animation states
  const [showCheck, setShowCheck] = useState(false);
  const [showOrderInfo, setShowOrderInfo] = useState(false);

  useEffect(() => {
    const loadOrderDetails = async () => {
      setLoading(true);
      try {
        // Then load order details
        const { success, order, error } = await fetchOrderDetails(orderId);

        if (success && order) {
          setOrderDetails(order);
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
        }, 500);
      }, 1000);
    }, 500);

    // Load order data
    loadOrderDetails();

    // Clear any pending order data from localStorage
    localStorage.removeItem("pendingOrderId");
    localStorage.removeItem("pendingOrderDetails");
  }, [orderId, fetchOrderDetails, params]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-wineRed border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "We couldn't find details for your order."}
          </p>
          <button
            onClick={() => navigate("/customer/orders")}
            className="bg-wineRed text-white px-6 py-2 rounded-md hover:bg-wineRed/90 transition-all"
          >
            View Your Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Animation */}
        <div className="text-center mb-10">
          <div className="relative mx-auto mb-6">
            <div
              className={`w-24 h-24 rounded-full border-4 border-green-500 mx-auto flex items-center justify-center 
              ${showCheck ? "scale-100 opacity-100" : "scale-0 opacity-0"} 
              transition-all duration-500 transform`}
            >
              <Check
                className={`text-green-500 w-12 h-12 
                ${
                  animationComplete
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-0"
                } 
                transition-all duration-500 transform`}
              />
            </div>
          </div>
          <h1
            className={`text-2xl md:text-3xl font-bold text-gray-800 mb-2
            ${
              showOrderInfo
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-4"
            }
            transition-all duration-500`}
          >
            Order Confirmed!
          </h1>
          <p
            className={`text-gray-600 
            ${
              showOrderInfo
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-4"
            }
            transition-all duration-500 delay-100`}
          >
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>
        </div>

        {/* Order Information */}
        <div
          className={`bg-white rounded-lg shadow-lg overflow-hidden 
          ${
            showOrderInfo
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-8"
          }
          transition-all duration-500 delay-200`}
        >
          <div className="bg-wineRed text-white p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Order #{orderDetails._id.slice(-8)}
              </h2>
              <p className="text-white/80 text-sm">
                {new Date(orderDetails.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center mb-4">
              <ShoppingBag className="text-wineRed mr-2" size={20} />
              <h3 className="font-semibold text-lg text-gray-800">
                Order Summary
              </h3>
            </div>

            <div className="space-y-4 mb-6">
              {orderDetails.products && (
                <div className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
                  <img
                    src={
                      orderDetails.products.image ||
                      "https://via.placeholder.com/150"
                    }
                    alt={orderDetails.products.name || "Product"}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">
                      {orderDetails.products.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {orderDetails.products.color}, Size:{" "}
                      {orderDetails.products.size} | Qty:{" "}
                      {orderDetails.products.quantity}
                    </p>
                  </div>
                  <div className="font-semibold text-gray-900">
                    ₹{orderDetails.totalAmount.toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ₹{(orderDetails.totalAmount * 0.82).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {orderDetails.totalAmount > 500 ? "Free" : "₹50.00"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Tax (18%)</span>
                <span className="font-medium">
                  ₹{(orderDetails.totalAmount * 0.18).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>₹{orderDetails.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center mb-4">
              <MapPin className="text-wineRed mr-2" size={20} />
              <h3 className="font-semibold text-lg text-gray-800">
                Shipping Details
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm text-gray-500 mb-1">Shipping Address</h4>
                <p className="text-gray-800">{orderDetails.address}</p>
              </div>

              <div>
                <h4 className="text-sm text-gray-500 mb-1">
                  Estimated Delivery
                </h4>
                <p className="text-gray-800 font-medium">
                  {new Date(
                    Date.now() + 5 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <div className="mt-2 bg-amber-50 rounded-md p-3">
                  <div className="flex items-center">
                    <Truck className="text-amber-500 mr-2" size={16} />
                    <span className="text-sm text-amber-700">
                      Your order is being processed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 flex flex-col sm:flex-row justify-between gap-3">
            <button
              onClick={() => navigate("/customer/orders")}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              View Your Orders
            </button>

            <button
              onClick={() => navigate("/customer/products")}
              className="px-4 py-2 bg-wineRed text-white rounded-md hover:bg-wineRed/90 transition-colors flex items-center justify-center"
            >
              Continue Shopping <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>

        {/* Order Tracking Steps */}
        <div
          className={`mt-8 bg-white rounded-lg shadow p-6
          ${
            showOrderInfo
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-8"
          }
          transition-all duration-500 delay-300`}
        >
          <h3 className="font-semibold text-gray-800 mb-6">Order Status</h3>

          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-6 top-0 ml-px border-l-2 border-dashed border-gray-200 h-full"></div>

            {/* Steps */}
            <div className="space-y-8">
              {/* Step 1: Order Confirmed - Always completed */}
              <div className="flex items-center">
                <div className="z-10 flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-gray-800 font-medium">Order Confirmed</h4>
                  <p className="text-sm text-gray-500">
                    Your order has been placed successfully
                  </p>
                </div>
              </div>

              {/* Step 2: Processing */}
              <div className="flex items-center">
                <div
                  className={`z-10 flex items-center justify-center w-12 h-12 ${
                    orderDetails.status === "Processing" ||
                    orderDetails.status === "Shipped" ||
                    orderDetails.status === "Delivered"
                      ? "bg-green-100"
                      : "bg-gray-100"
                  } rounded-full`}
                >
                  {orderDetails.status === "Processing" ||
                  orderDetails.status === "Shipped" ||
                  orderDetails.status === "Delivered" ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <Package className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="ml-4">
                  <h4
                    className={`${
                      orderDetails.status === "Processing" ||
                      orderDetails.status === "Shipped" ||
                      orderDetails.status === "Delivered"
                        ? "text-gray-800"
                        : "text-gray-400"
                    } font-medium`}
                  >
                    Processing
                  </h4>
                  <p className="text-sm text-gray-500">
                    Your order is being processed
                  </p>
                </div>
              </div>

              {/* Step 3: Shipped */}
              <div className="flex items-center">
                <div
                  className={`z-10 flex items-center justify-center w-12 h-12 ${
                    orderDetails.status === "Shipped" ||
                    orderDetails.status === "Delivered"
                      ? "bg-green-100"
                      : "bg-gray-100"
                  } rounded-full`}
                >
                  {orderDetails.status === "Shipped" ||
                  orderDetails.status === "Delivered" ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <Truck className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="ml-4">
                  <h4
                    className={`${
                      orderDetails.status === "Shipped" ||
                      orderDetails.status === "Delivered"
                        ? "text-gray-800"
                        : "text-gray-400"
                    } font-medium`}
                  >
                    Shipped
                  </h4>
                  <p className="text-sm text-gray-500">
                    Your items have been shipped
                  </p>
                </div>
              </div>

              {/* Step 4: Delivered */}
              <div className="flex items-center">
                <div
                  className={`z-10 flex items-center justify-center w-12 h-12 ${
                    orderDetails.status === "Delivered"
                      ? "bg-green-100"
                      : "bg-gray-100"
                  } rounded-full`}
                >
                  {orderDetails.status === "Delivered" ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <MapPin className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="ml-4">
                  <h4
                    className={`${
                      orderDetails.status === "Delivered"
                        ? "text-gray-800"
                        : "text-gray-400"
                    } font-medium`}
                  >
                    Delivered
                  </h4>
                  <p className="text-sm text-gray-500">
                    Your items have been delivered
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
