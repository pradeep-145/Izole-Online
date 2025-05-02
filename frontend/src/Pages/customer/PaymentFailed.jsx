import { AlertTriangle, ArrowLeft, ShoppingBag } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get error details from navigation state
  const error = location.state?.error || "Your payment could not be processed";
  const orderId = location.state?.orderId;
  const status = location.state?.status;

  const handleRetry = () => {
    // Go to cart or previous page
    navigate("/customer/cart");
  };

  const goToOrders = () => {
    navigate("/customer/orders");
  };

  const goHome = () => {
    navigate("/customer");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-600 p-6 text-white">
          <div className="flex items-center justify-center">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <h1 className="text-2xl font-bold text-center mt-4">
            Payment Failed
          </h1>
        </div>

        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-700">{error}</p>

            {status && (
              <p className="text-sm text-gray-600 mt-2">Status: {status}</p>
            )}

            {orderId && (
              <p className="text-sm text-gray-600 mt-1">
                Order Reference: {orderId}
              </p>
            )}
          </div>

          <p className="text-gray-600 mb-6">
            Don't worry, no payment has been processed. You can try again or
            contact our customer support for assistance.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-wineRed text-white py-2 px-4 rounded-md hover:bg-wineRed/90 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Return to Cart
            </button>

            <button
              onClick={goToOrders}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              View Your Orders
            </button>

            <button
              onClick={goHome}
              className="w-full bg-transparent text-gray-600 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors border border-gray-300"
            >
              Return to Homepage
            </button>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-3 text-center text-sm text-gray-500 border-t">
          If you need assistance, please contact our support team.
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
