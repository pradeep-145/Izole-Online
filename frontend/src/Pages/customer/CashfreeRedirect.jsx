import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../../zustand/useCart";

const CashfreeRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
const {clearCart}= useCart()
  // Extract payment information from URL parameters
  const orderId = searchParams.get("order_id");
  const status = searchParams.get("txStatus") || searchParams.get("status");

  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        if (!orderId) {
          throw new Error("Missing order ID in redirect URL");
        }

        // For successful payments
        if (status === "SUCCESS" || status === "success") {
          // Extract actual order ID from the Cashfree order ID (remove order_ prefix)
          const actualOrderId = orderId.startsWith("order_")
            ? orderId.substring(6)
            : orderId;

          // Confirm payment with the backend
          await axios.post(
            "/api/orders/confirm-payment",
            { orderId: actualOrderId },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          clearCart();
          
          // Navigate to order confirmation page
          navigate(
            `/customer/order-confirmation?orderDetails=${orderId}&status=success`
          );
        } else {
          // Handle failed, cancelled, or other payment statuses
          console.error("Payment was not successful:", status);
          navigate("/customer/payment-failed", {
            state: { error: "Payment was not successful", status, orderId },
          });
        }
      } catch (error) {
        console.error("Error processing payment result:", error);
        navigate("/customer/payment-failed", {
          state: { error: error.message },
        });
      }
    };

    processPaymentResult();
  }, [orderId, status, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-6">
        <Loader2 className="animate-spin h-12 w-12 text-wineRed mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Processing Your Payment
        </h1>
        <p className="text-gray-600">
          Please wait while we confirm your payment...
        </p>
      </div>
    </div>
  );
};

export default CashfreeRedirect;
