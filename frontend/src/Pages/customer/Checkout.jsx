import { load } from "@cashfreepayments/cashfree-js";
import axios from "axios";
import { ArrowLeft, Clock, Lock, MapPin, Package, Truck, RefreshCw } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../zustand/useCart";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();

  const singleProduct = location.state?.product;
  const isBuyNow = !!singleProduct;

  // Timer state
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);

  const [products, setProducts] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);

  // Format time function
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handle timer expiration
  const handleTimerExpired = useCallback(() => {
    if (isBuyNow && singleProduct) {
      // Get the product ID to navigate back to
      const productId = singleProduct._id || singleProduct.id;

      // Show alert
      alert("Your checkout session has expired. Returning to product page.");

      // Navigate back to product page
      navigate(`/customer/product/${productId}`, { replace: true });
    } else {
      // For cart checkout, just go back to cart
      navigate("/customer/cart", { replace: true });
    }
  }, [isBuyNow, singleProduct, navigate]);

  // Timer effect
  useEffect(() => {
    if (isBuyNow) {
      // Start timer when page loads for Buy Now checkout
      setTimerActive(true);
    }

    // Timer countdown logic
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timerActive && timeLeft === 0) {
      // Timer expired
      clearInterval(interval);
      handleTimerExpired();
    }

    // Cleanup
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft, isBuyNow, handleTimerExpired]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "", // Added state field for Shiprocket
    zipCode: "",
    country: "India", // Default to India
    phone: "", // Added phone for Shiprocket
  });

  // New states for Shiprocket serviceability
  const [serviceability, setServiceability] = useState([]);
  const [checkingServiceability, setCheckingServiceability] = useState(false);
  const [serviceabilityError, setServiceabilityError] = useState("");
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [showServiceOptions, setShowServiceOptions] = useState(false);

  const [paymentSessionId, setPaymentSessionId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [paymentError, setPaymentError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cashfreeInstance, setCashfreeInstance] = useState(null);

  // Calculate totals with dynamic shipping based on selection
  const subtotal = orderTotal;
  const shipping = selectedCourier ? selectedCourier.rate : (orderTotal > 500 ? 0 : 50);
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
          image: location.state?.images[0],
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
            getCartTotal
              ? getCartTotal()
              : calculateTotalManually(mappedCartItems)
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
      // Go back to product page - get ID from singleProduct
      const productId = singleProduct._id || singleProduct.id;
      navigate(-1);
    } else {
      navigate("/customer/cart");
    }
  };

  const checkServiceability = async () => {
    if (!formData.zipCode || !formData.state) {
      setServiceabilityError("Please enter both PIN code and state to check serviceability");
      return;
    }

    setCheckingServiceability(true);
    setServiceabilityError("");
    setShowServiceOptions(false);
    try {
      const response = await axios.post("/api/shiprocket/check-serviceability", {
        pickup_postcode: "641604", // Your business pincode (should be from env or config)
        delivery_postcode: formData.zipCode,
        weight: calculateTotalWeight(),
        cod: 0, // Assuming all orders are prepaid based on your implementation
      });

      if (response.data.success && response.data.couriers && response.data.couriers.length > 0) {
        setServiceability(response.data.couriers);
        setShowServiceOptions(true);
        // Auto-select cheapest option
        const cheapestOption = [...response.data.couriers].sort((a, b) => a.rate - b.rate)[0];
        setSelectedCourier(cheapestOption);
      } else {
        setServiceabilityError("No delivery options available for your location");
      }
    } catch (error) {
      console.error("Error checking serviceability:", error);
      setServiceabilityError(
        error.response?.data?.message || "Failed to check delivery options"
      );
    } finally {
      setCheckingServiceability(false);
    }
  };

  const calculateTotalWeight = () => {
    // Each item is assumed to be 0.5kg, adjust as needed
    const totalItems = products.reduce((sum, item) => sum + item.quantity, 0);
    return Math.max(0.5, totalItems * 0.5); // Minimum 0.5kg
  };

  const selectCourier = (courier) => {
    setSelectedCourier(courier);
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
      !formData.state ||
      !formData.zipCode ||
      !formData.phone
    ) {
      setPaymentError("Please fill in all required fields");
      setIsProcessing(false);
      return;
    }

    // Validate if serviceability was checked and courier selected
    if (!selectedCourier) {
      setPaymentError("Please check and select a shipping method");
      setIsProcessing(false);
      return;
    }

    try {
      // Create order on backend with Shiprocket data
      const response = await axios.post("/api/orders/create-order", {
        products,
        totalAmount: total,
        address: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.zipCode,
          country: formData.country || "India"
        },
        billingAddress: formData,
        shippingInfo: {
          courier_company_id: selectedCourier.courier_company_id,
          courier_name: selectedCourier.courier_name,
          rate: selectedCourier.rate,
          estimated_delivery_days: selectedCourier.estimated_delivery_days,
          weight: calculateTotalWeight()
        }
      });

      // Stop the timer when proceeding to payment
      setTimerActive(false);

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
        };

        const result = await cashfreeInstance.checkout(checkoutOptions);
        console.log(result);

        if (result.error) {
          setPaymentError(result.error.message);
        } else if (result.success) {
          const payment = await axios.post("/api/orders/confirm-order", {
            orderId: response.data.order._id,
          });
          console.log(payment.data);

          setPaymentStatus("completed");

          // Clear cart if it's not a Buy Now purchase
          if (!isBuyNow) {
            clearCart();
          }

          // Redirect to order confirmation page with all necessary details
          navigate(`/customer/order-confirmation/${orderId}`, {
            state: {
              orderDetails: {
                orderId,
                amount: total,
                products,
                address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
                customerName: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
              },
            },
            replace: true,
          });
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
              <span>Back</span>
            </button>

            <h1 className="text-2xl font-bold text-gray-800">
              {isBuyNow ? "Buy Now" : "Checkout"}
            </h1>

            {/* Timer display - only show for Buy Now */}
            {isBuyNow && (
              <div className="flex items-center bg-wineRed text-white px-3 py-1 rounded-lg">
                <Clock size={16} className="mr-1" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            )}
            <div className="w-8" />
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-6">
        {/* Timer warning - only show for Buy Now when less than 2 minutes remaining */}
        {isBuyNow && timeLeft < 120 && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-center">
            <Clock className="mr-2 text-red-500" />
            <p>
              <span className="font-bold">Hurry!</span> Your checkout session
              will expire in {formatTime(timeLeft)}. Complete your purchase now.
            </p>
          </div>
        )}

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

                  <form
                    id="shipping-form"
                    onSubmit={proceedToPayment}
                    className="space-y-4"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name*
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
                          Last Name*
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

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address*
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
                          Phone Number*
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 bg-transparent text-wineRed rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address*
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
                          City*
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
                          State*
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 bg-transparent text-wineRed rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code*
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border bg-transparent text-wineRed border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          disabled
                        />
                      </div>
                    </div>

                    {/* Shipping Methods Section */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-800">
                        <Truck className="mr-2 text-amber-500" /> Shipping Methods
                      </h3>
                      
                      <div className="flex items-center space-x-2 mb-4">
                        <button
                          type="button"
                          onClick={checkServiceability}
                          disabled={checkingServiceability || !formData.zipCode || !formData.state}
                          className={`px-4 py-2 rounded-md flex items-center ${
                            checkingServiceability || !formData.zipCode || !formData.state
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-amber-500 hover:bg-amber-600 text-white"
                          }`}
                        >
                          {checkingServiceability ? (
                            <>
                              <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                              Checking...
                            </>
                          ) : (
                            <>
                              <Truck className="mr-2 h-4 w-4" />
                              Check Delivery Options
                            </>
                          )}
                        </button>
                        
                        {!formData.zipCode || !formData.state && (
                          <span className="text-sm text-amber-600">
                            Enter PIN code and state to check shipping options
                          </span>
                        )}
                      </div>

                      {serviceabilityError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4">
                          {serviceabilityError}
                        </div>
                      )}

                      {showServiceOptions && serviceability.length > 0 && (
                        <div className="border rounded-md overflow-hidden">
                          <div className="bg-gray-50 px-4 py-2 border-b">
                            <h4 className="font-medium text-wineRed">Select a shipping partner</h4>
                          </div>
                          <div className="max-h-60 overflow-y-auto">
                            {serviceability.map((courier) => (
                              <div
                                key={courier.courier_company_id}
                                onClick={() => selectCourier(courier)}
                                className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${
                                  selectedCourier?.courier_company_id === courier.courier_company_id
                                    ? "bg-amber-50 border-l-4 border-l-amber-500"
                                    : ""
                                }`}
                              >
                                <div className="flex items-center">
                                  <div className={`w-4 h-4 rounded-full border ${
                                    selectedCourier?.courier_company_id === courier.courier_company_id
                                      ? "border-4 border-amber-500"
                                      : "border-gray-300"
                                  }`}></div>
                                  <div className="ml-3">
                                    <p className="font-medium">{courier.courier_name}</p>
                                    <p className="text-sm text-gray-600">
                                      Estimated delivery: {courier.estimated_delivery_days} days
                                    </p>
                                  </div>
                                </div>
                                <div className="font-semibold text-wineRed">₹{courier.rate.toFixed(2)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>

                    {paymentError && (
                      <p className="text-red-600 font-semibold">
                        {paymentError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isProcessing || !selectedCourier}
                      className={`${
                        isProcessing || !selectedCourier
                          ? "bg-gray-400"
                          : "bg-wineRed hover:bg-wineRed/90"
                      } text-white px-6 py-2 rounded-md font-semibold transition-colors w-full mt-4`}
                    >
                      {isProcessing
                        ? "Processing..."
                        : !selectedCourier
                        ? "Please Select Shipping Method"
                        : `Pay ₹${total.toFixed(2)}`}
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
                              <h4 className="font-medium text-wineRed">
                                {item.name}
                              </h4>
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
                          {selectedCourier ? (
                            <div className="text-right">
                              <span className="font-medium">₹{shipping.toFixed(2)}</span>
                              <p className="text-xs text-gray-500">{selectedCourier.courier_name}</p>
                            </div>
                          ) : (
                            <span>Select shipping method</span>
                          )}
                        </div>

                        <div className="flex justify-between">
                          <span>Tax (18%)</span>
                          <span>₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t border-gray-200">
                          <span>Total</span>
                          <span>₹{total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          type="submit"
                          form="shipping-form"
                          className="w-full py-3 bg-mustard text-gray-800 font-bold rounded-md hover:bg-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 shadow-md flex items-center justify-center"
                        >
                          <Lock className="mr-2 h-5 w-5" />
                          Proceed to Payment
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500 flex items-center justify-center">
                          <Lock className="w-3 h-3 mr-1" /> Secure Payment
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {isBuyNow && (
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <Clock className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-medium text-wineRed">
                    Limited Time Checkout
                  </h3>
                  <p className="text-sm text-gray-600">
                    You have {formatTime(timeLeft)} to complete your purchase
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                <Lock className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <h3 className="font-medium text-wineRed">Secure checkout</h3>
                <p className="text-sm text-gray-600">
                  Your payment information is protected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
