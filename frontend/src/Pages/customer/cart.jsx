import {
  ArrowLeft,
  CreditCard,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  TruckIcon,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/customer/Navbar";
import { useCart } from "../../zustand/useCart"; // Update path as needed
import axios from "axios";

// IZOLE brand colors
const COLORS = {
  darkGreen: "#1A3B2A", // Main background color
  mustardGold: "#D6AF36", // Accent color
  lightGold: "#E9D185", // Lighter accent
  cream: "#F5F1E0", // Light background
  darkText: "#333333", // Dark text
  white: "#FFFFFF", // White text
};

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    fetchCart, 
    isLoading 
  } = useCart();
  
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Fetch cart data on component mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Calculate cart summary values
  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax - discount;

  // Handle quantity changes
  const handleUpdateQuantity = async (productId, color, size, newQuantity, availableStock) => {
    // Ensure quantity is within valid range
    const validQuantity = Math.max(1, Math.min(newQuantity, availableStock));
    
    // Update quantity in store and backend
    await updateQuantity(productId, color, size, validQuantity);
  };

  // Remove item from cart
  const handleRemoveItem = async (productId, color, size) => {
    await removeFromCart(productId, color, size);
  };

  // Move item to wishlist
  const moveToWishlist = async (productId, color, size) => {
    try {
      // Add to wishlist API call
      await axios.post('https://lcnfyb0s62.execute-api.ap-south-1.amazonaws.com/api/wishlist/add', {
        productId,
        color,
        size
      },{
        withCredentials:true
      });
      
      // Remove from cart
      await removeFromCart(productId, color, size);
      alert("Item moved to wishlist!");
    } catch (error) {
      alert("Failed to move item to wishlist");
    }
  };

  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save20") {
      const discountAmount = subtotal * 0.2; // 20% discount
      setDiscount(discountAmount);
      setPromoApplied(true);
      alert("Promo code applied successfully!");
    } else {
      alert("Invalid promo code.");
      setPromoApplied(false);
      setDiscount(0);
    }
  };

  // Continue shopping
  const continueShopping = () => {
    navigate("/customer/products");
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    navigate("/customer/checkout", {
      state: {
        items: cartItems,
        summary: {
          subtotal,
          shipping,
          tax,
          discount,
          total,
        },
      },
    });
  };

  // Show loading indicator
  if (isLoading) {
    return (
      <div className="bg-cream min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto pt-16 px-4 lg:px-0 flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-lg font-medium text-darkGreen">Loading your cart...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty cart message if no items
  if (!cartItems.length) {
    return (
      <div style={{ backgroundColor: COLORS.cream }} className="min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto pt-16 px-4 lg:px-0">
          <div style={{ backgroundColor: COLORS.white, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} className="rounded-lg p-8 text-center">
            <div className="flex flex-col items-center">
              <ShoppingBag style={{ color: COLORS.mustardGold }} className="w-16 h-16 mb-4" />
              <h2 style={{ color: COLORS.darkGreen }} className="text-2xl font-bold">Your cart is empty</h2>
              <p className="text-gray-600 mt-2">
                Looks like you haven't added anything to your cart yet.
              </p>
              <button
                onClick={continueShopping}
                style={{ 
                  backgroundColor: COLORS.darkGreen, 
                  color: COLORS.mustardGold,
                  border: 'none' 
                }}
                className="px-6 py-3 rounded-md font-medium mt-6 hover:opacity-90 transition-opacity"
              >
                Start Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: COLORS.cream }} className="min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto pt-16 px-4 lg:px-0">
        <h1 style={{ color: COLORS.darkGreen }} className="text-3xl font-bold mt-8 mb-6">
          Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="lg:w-2/3">
            <div style={{ backgroundColor: COLORS.white }} className="rounded-lg shadow-md">
              <div className="p-6">
                {/* Table header */}
                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-sm font-medium text-gray-600">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Subtotal</div>
                </div>

                {/* Cart items */}
                {cartItems.map((item) => {
                  const colorData = item.product.images.find(img => img.color === item.color);
                  const price = item.price || colorData?.price || 0;
                  const available = colorData?.quantity || 0;
                  
                  return (
                    <div
                      key={`${item.product._id}-${item.color}-${item.size}`}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b border-gray-200 last:border-0"
                    >
                      {/* Product info - mobile & desktop */}
                      <div className="col-span-1 md:col-span-6">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.product.name}
                              className="w-full h-full object-contain rounded-md"
                            />
                          </div>
                          <div className="flex flex-col justify-between">
                            <div>
                              <h3 style={{ color: COLORS.darkGreen }} className="font-medium">
                                {item.product.name}
                              </h3>
                              <div className="mt-1 text-sm text-gray-500">
                                <span>Color: {item.color}</span>
                                <span className="mx-2">|</span>
                                <span>Size: {item.size}</span>
                              </div>
                            </div>

                            {/* Mobile price */}
                            <div className="md:hidden flex justify-between mt-2">
                              <span style={{ color: COLORS.darkGreen }} className="font-medium">
                                ₹{price.toFixed(2)}
                              </span>
                              <span style={{ color: COLORS.darkGreen }} className="font-medium">
                                ₹{(price * item.quantity).toFixed(2)}
                              </span>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-4 mt-2">
                              <button
                                onClick={() => handleRemoveItem(item.product._id, item.color, item.size)}
                                className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" /> Remove
                              </button>
                              <button
                                onClick={() => moveToWishlist(item.product._id, item.color, item.size)}
                                className="text-sm text-gray-500 hover:text-blue-500 flex items-center gap-1"
                              >
                                <Heart className="w-4 h-4" /> Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price - desktop only */}
                      <div className="hidden md:flex col-span-2 items-center justify-center">
                        <span style={{ color: COLORS.darkGreen }} className="font-medium">
                          ₹{price.toFixed(2)}
                        </span>
                      </div>

                      {/* Quantity controls */}
                      <div className="col-span-1 md:col-span-2 flex items-center justify-center">
                        <div style={{ borderColor: COLORS.darkGreen }} className="flex items-center border rounded-md">
                          <button
                            onClick={() => handleUpdateQuantity(
                              item.product._id, 
                              item.color, 
                              item.size, 
                              item.quantity - 1,
                              available
                            )}
                            disabled={item.quantity <= 1}
                            style={{ color: COLORS.darkGreen }}
                            className="p-2 hover:text-gray-800 disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="text"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              handleUpdateQuantity(
                                item.product._id, 
                                item.color, 
                                item.size, 
                                val,
                                available
                              );
                            }}
                            style={{ color: COLORS.darkGreen }}
                            className="w-12 text-center bg-white border-0 focus:ring-0"
                          />
                          <button
                            onClick={() => handleUpdateQuantity(
                              item.product._id, 
                              item.color, 
                              item.size, 
                              item.quantity + 1,
                              available
                            )}
                            disabled={item.quantity >= available}
                            style={{ color: COLORS.darkGreen }}
                            className="p-2 hover:text-gray-800 disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal - desktop only */}
                      <div className="hidden md:flex col-span-2 items-center justify-center">
                        <span style={{ color: COLORS.darkGreen }} className="font-medium">
                          ₹{(price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Continue shopping button */}
                <div className="mt-6">
                  <button
                    onClick={continueShopping}
                    style={{ 
                      color: COLORS.darkGreen, 
                      borderColor: COLORS.darkGreen,
                      backgroundColor: 'transparent'
                    }}
                    className="px-4 py-2 rounded-md border font-medium flex items-center gap-2 hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4" /> Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div style={{ backgroundColor: COLORS.white }} className="rounded-lg shadow-md sticky top-24">
              <div className="p-6">
                <h2 style={{ color: COLORS.darkGreen }} className="text-xl font-bold mb-4">Order Summary</h2>

                {/* Summary details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subtotal (
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                      items)
                    </span>
                    <span style={{ color: COLORS.darkGreen }} className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span style={{ color: COLORS.darkGreen }} className="font-medium">
                      {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span style={{ color: COLORS.darkGreen }} className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">
                        -₹{discount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span style={{ color: COLORS.darkGreen }}>Total</span>
                      <span style={{ color: COLORS.darkGreen }}>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping info */}
                <div style={{ backgroundColor: COLORS.lightGold + '30' }} className="mt-4 p-4 rounded-lg flex items-start gap-3">
                  <TruckIcon style={{ color: COLORS.mustardGold }} className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p style={{ color: COLORS.darkGreen }} className="font-medium">
                      Free shipping on orders over ₹100
                    </p>
                    <p style={{ color: COLORS.darkGreen + 'CC' }} className="mt-1">
                      {subtotal < 100
                        ? `Add ₹${(100 - subtotal).toFixed(
                            2
                          )} more to qualify for free shipping.`
                        : "You've qualified for free shipping!"}
                    </p>
                  </div>
                </div>

                {/* Promo code section */}
                <div className="mt-6">
                  <div style={{ color: COLORS.darkGreen }} className="text-sm font-medium mb-2">Promo Code</div>
                  <div className="flex w-full">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      style={{ 
                        borderColor: COLORS.darkGreen,
                        color: COLORS.darkGreen,
                        borderRight: 'none',
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                      className="flex-grow px-3 py-2 border rounded-l-md bg-white focus:outline-none"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                    />
                    <button
                      style={{ 
                        backgroundColor: COLORS.darkGreen, 
                        color: COLORS.mustardGold,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      }}
                      className="px-4 py-2 rounded-r-md font-medium hover:opacity-90 transition-opacity"
                      onClick={applyPromoCode}
                      disabled={promoApplied || !promoCode}
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <div className="text-green-600 text-sm mt-2">
                      Promo code applied successfully!
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    Try "SAVE20" for 20% off your order!
                  </div>
                </div>

                {/* Checkout button */}
                <div className="mt-6">
                  <button
                    style={{ 
                      backgroundColor: COLORS.mustardGold, 
                      color: COLORS.darkGreen,
                    }}
                    className="w-full px-6 py-3 rounded-md font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    onClick={proceedToCheckout}
                    disabled={cartItems.length === 0}
                  >
                    <CreditCard className="w-4 h-4" />
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;