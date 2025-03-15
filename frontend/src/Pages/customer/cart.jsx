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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/customer/Navbar";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Premium Leather Jacket",
      price: 199.99,
      color: "Black",
      size: "L",
      quantity: 1,
      image:
        "https://th.bing.com/th/id/OIP.HOb_8jSrQ1mwzuuE9B7SfAHaLG?rs=1&pid=ImgDetMain",
      available: 20,
    },
    {
      id: 2,
      name: "Casual Denim Shirt",
      price: 49.99,
      color: "Blue",
      size: "M",
      quantity: 2,
      image:
        "https://th.bing.com/th/id/OIP.xU1B1N4yNIitYKdy61_5RgHaIC?w=185&h=200&c=7&r=0&o=5&pid=1.7",
      available: 15,
    },
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Calculate cart summary values
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax - discount;

  // Handle quantity changes
  const updateQuantity = (id, newQuantity) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          // Ensure quantity is within valid range
          const validQuantity = Math.max(
            1,
            Math.min(newQuantity, item.available)
          );
          return { ...item, quantity: validQuantity };
        }
        return item;
      })
    );
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Move item to wishlist
  const moveToWishlist = (id) => {
    removeItem(id);
    alert("Item moved to wishlist!");
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

  // Show empty cart message if no items
  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto pt-16 px-4 lg:px-0">
          <div className="card bg-white shadow-xl p-8 text-center">
            <div className="card-body items-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold">Your cart is empty</h2>
              <p className="text-gray-500 mt-2">
                Looks like you haven't added anything to your cart yet.
              </p>
              <button
                onClick={continueShopping}
                className="btn btn-primary mt-6"
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
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto pt-16 px-4 lg:px-0">
        <h1 className="text-3xl font-bold text-gray-800 mt-8 mb-6">
          Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="lg:w-2/3">
            <div className="card bg-white shadow-md">
              <div className="card-body p-6">
                {/* Table header */}
                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b text-sm font-medium text-gray-600">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Subtotal</div>
                </div>

                {/* Cart items */}
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b last:border-0"
                  >
                    {/* Product info - mobile & desktop */}
                    <div className="col-span-1 md:col-span-6">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex flex-col justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {item.name}
                            </h3>
                            <div className="mt-1 text-sm text-gray-500">
                              <span>Color: {item.color}</span>
                              <span className="mx-2">|</span>
                              <span>Size: {item.size}</span>
                            </div>
                          </div>

                          {/* Mobile price */}
                          <div className="md:hidden flex justify-between mt-2">
                            <span className="font-medium">
                              ${item.price.toFixed(2)}
                            </span>
                            <span className="font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-4 mt-2">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" /> Remove
                            </button>
                            <button
                              onClick={() => moveToWishlist(item.id)}
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
                      <span className="font-medium">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="col-span-1 md:col-span-2 flex items-center justify-center">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            updateQuantity(item.id, val);
                          }}
                          className="w-12 text-center border-0 focus:ring-0"
                        />
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.available}
                          className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal - desktop only */}
                    <div className="hidden md:flex col-span-2 items-center justify-center">
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Continue shopping button */}
                <div className="mt-6">
                  <button
                    onClick={continueShopping}
                    className="btn btn-outline gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div className="card bg-white shadow-md sticky top-24">
              <div className="card-body p-6">
                <h2 className="card-title text-xl mb-4">Order Summary</h2>

                {/* Summary details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subtotal (
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                      items)
                    </span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">
                        -${discount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping info */}
                <div className="mt-4 bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                  <TruckIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800">
                      Free shipping on orders over $100
                    </p>
                    <p className="text-blue-700 mt-1">
                      {subtotal < 100
                        ? `Add $${(100 - subtotal).toFixed(
                            2
                          )} more to qualify for free shipping.`
                        : "You've qualified for free shipping!"}
                    </p>
                  </div>
                </div>

                {/* Promo code section */}
                <div className="mt-6">
                  <div className="text-sm font-medium mb-2">Promo Code</div>
                  <div className="join w-full">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      className="input input-bordered join-item flex-grow"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                    />
                    <button
                      className="btn join-item btn-primary"
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
                    className="btn btn-primary w-full gap-2"
                    onClick={proceedToCheckout}
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
