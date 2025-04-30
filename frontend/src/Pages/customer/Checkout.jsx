import React, { useEffect, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Package } from "lucide-react";
import { useCart } from "../../zustand/useCart";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();

  const singleProduct = location.state?.product;
  const isBuyNow = !!singleProduct;

  const [products, setProducts] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const [paymentSessionId, setPaymentSessionId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [paymentError, setPaymentError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cashfreeInstance, setCashfreeInstance] = useState(null);

  // Calculate totals
  const subtotal = orderTotal;
  const shipping = orderTotal > 500 ? 0 : 50;
  const tax = orderTotal * 0.18;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    // Load Cashfree SDK
    load({ mode: "sandbox" }) // change to 'production' in prod
      .then((cf) => setCashfreeInstance(cf))
      .catch((err) => {
        console.error("Cashfree SDK load error:", err);
        setPaymentError("Failed to load payment SDK");
      });
  }, []);

  useEffect(() => {
    if (isBuyNow && singleProduct) {
      try {
        if (!singleProduct.variants || !singleProduct.variants.length) {
          throw new Error("Product has no variants");
        }

        const variantIndex = location.state?.variantIndex || 0;
        const variant = singleProduct.variants[variantIndex];

        const sizeIndex = location.state?.sizeIndex || 0;
        const sizeOption = variant.sizeOptions[sizeIndex];

        const buyNowItem = {
          id: singleProduct._id || Date.now(),
          name: singleProduct.name || "Unnamed Product",
          price: sizeOption?.price || variant.sizeOptions[0]?.price || 0,
          quantity: location.state?.quantity || 1,
          image:
            location.state?.image ||
            variant.images?.[0] ||
            "https://placeholder.com/400",
          color: location.state?.color || variant.color || "N/A",
          size: location.state?.size || sizeOption?.size || "N/A",
        };

        setProducts([buyNowItem]);
        setOrderTotal(buyNowItem.price * buyNowItem.quantity);
      } catch (error) {
        console.error("Error setting up Buy Now product:", error);
        navigate("/customer/cart", { replace: true });
      }
    } else {
      if (cartItems && cartItems.length > 0) {
        try {
          const mappedCartItems = cartItems.map((item) => {
            if (!item.product) {
              throw new Error("Invalid cart item");
            }

            return {
              id: item.product._id || item.product.id || Date.now(),
              name: item.product.name || "Unnamed Product",
              price:
                item.price ||
                item.product.variants?.[0]?.sizeOptions?.[0]?.price ||
                0,
              quantity: item.quantity || 1,
              image:
                item.image ||
                item.product.variants?.[0]?.images?.[0] ||
                "https://placeholder.com/400",
              color: item.color || item.product.variants?.[0]?.color || "N/A",
              size:
                item.size ||
                item.product.variants?.[0]?.sizeOptions?.[0]?.size ||
                "N/A",
            };
          });

          setProducts(mappedCartItems);
          setOrderTotal(
            getCartTotal ? getCartTotal() : calculateTotalManually(mappedCartItems)
          );
        } catch (error) {
          console.error("Error processing cart items:", error);
          setProducts([]);
          setOrderTotal(0);
        }
      } else {
        navigate("/customer/cart");
      }
    }
  }, [location, cartItems, navigate, isBuyNow, singleProduct, getCartTotal]);

  const calculateTotalManually = (items) =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoBack = () => {
    if (isBuyNow) {
      navigate(-1);
    } else {
      navigate("/customer/cart");
    }
  };

  const proceedToPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentError("");

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.zipCode
    ) {
      setPaymentError("Please fill in all required fields");
      setIsProcessing(false);
      return;
    }

    const fullAddress = `${formData.address}, ${formData.city}, ${formData.zipCode}`;

    try {
      // Create order on backend
      const response = await axios.post("/api/orders/create-order", {
        products,
        totalAmount: total,
        address: fullAddress,
      });
      console.log(response);

      if (response.data.success) {
        setOrderId(response.data.order._id);
        setPaymentSessionId(response.data.paymentSessionId);

        if (!cashfreeInstance) {
          setPaymentError("Payment SDK not loaded. Please try again.");
          setIsProcessing(false);
          return;
        }

        const checkoutOptions = {
          paymentSessionId: response.data.paymentSessionId,
          redirectTarget: "_self",
        };

        const result = await cashfreeInstance.checkout(checkoutOptions);

        if (result.error) {
          setPaymentError(result.error.message);
        } else if (result.success) {
          handlePaymentSuccess(result);
        } else if (result.redirect) {
          // You can handle redirect here if needed
          console.log("Redirecting to payment gateway...");
        }
      } else {
        setPaymentError(response.data.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Error proceeding to payment:", error);
      setPaymentError(
        error.response?.data?.message ||
          "Failed to proceed to payment. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    setPaymentStatus("completed");
    clearCart();

    // Redirect to order confirmation page
    setTimeout(() => {
      navigate(`/customer/order-confirmation/${orderId}`, {
        state: {
          orderDetails: {
            orderId,
            amount: total,
            products,
            address: formData.address,
          },
        },
      });
    }, 1500);
  };

  return (
    <div className="mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-mustard py-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <button
              onClick={handleGoBack}
              className="flex items-center border-2 border-wineRed font-semibold p-1 rounded-lg text-wineRed hover:text-gray-600 transition-colors"
            >
              <ArrowLeft size={20} className="mr-1" />
              <span>Back to Cart</span>
            </button>

            <h1 className="text-2xl font-bold text-gray-800">
              {isBuyNow ? "Buy Now" : "Checkout"}
            </h1>

            <div className="w-8" />
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
              Checkout Details
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Shipping Details */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                    <MapPin className="mr-2 text-amber-500" /> Shipping Details
                  </h3>

                  <form id="shipping-form" onSubmit={proceedToPayment} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 bg-transparent text-wineRed rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 bg-transparent text-wineRed rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 bg-transparent text-wineRed rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 bg-transparent text-wineRed rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 bg-transparent text-wineRed rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border bg-transparent text-wineRed border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    {paymentError && (
                      <p className="text-red-600 font-semibold">{paymentError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="bg-wineRed text-white px-6 py-2 rounded-md font-semibold hover:bg-wineRed/90 transition-colors"
                    >
                      {isProcessing ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
                    </button>
                  </form>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                    <Package className="mr-2 text-amber-500" /> Order Summary
                  </h3>

                  {products.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No items in your order.
                    </p>
                  ) : (
                    <>
                      <div className="max-h-64 overflow-y-auto mb-4">
                        {products.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center mb-4 pb-4 border-b border-gray-200 last:border-0"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="ml-4 flex-1">
                              <h4 className="font-medium text-wineRed">{item.name}</h4>
                              <p className="text-sm text-gray-600">
                                Color: {item.color}, Size: {item.size}
                              </p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="font-semibold text-gray-800">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-gray-200 pt-4 space-y-2 text-gray-700">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax (18%)</span>
                          <span>₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-900 text-lg">
                          <span>Total</span>
                          <span>₹{total.toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
