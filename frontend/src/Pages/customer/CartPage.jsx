import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart items from localStorage
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
    calculateTotalPrice(storedCartItems);
  }, []);

  // Calculate total price
  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(total);
  };

  // Update quantity of an item
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      // Remove item if quantity becomes 0
      removeItem(itemId);
      return;
    }

    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCart);
    calculateTotalPrice(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    
    // Dispatch cart update event
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Remove item from cart
  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    
    setCartItems(updatedCart);
    calculateTotalPrice(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    
    // Dispatch cart update event
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    setTotalPrice(0);
    localStorage.removeItem("cartItems");
    
    // Dispatch cart update event
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("token") === "customer";

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    navigate('/customer/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Your Cart</h1>
            {cartItems.length > 0 && (
              <button 
                onClick={clearCart} 
                className="btn btn-ghost text-error"
              >
                <Trash2 className="mr-2 h-5 w-5" /> Clear Cart
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16 bg-base-200 rounded-lg">
              <ShoppingCart className="h-16 w-16 text-base-content/30 mx-auto mb-4" />
              <p className="text-xl text-base-content/70 mb-4">Your cart is empty</p>
              <Link 
                to="/customer/products" 
                className="btn btn-primary"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center bg-base-100 p-4 rounded-lg shadow-sm border"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 mr-4 rounded-md overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-base-content/70 text-sm">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="text-primary font-semibold mt-1">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center mr-4">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="btn btn-ghost btn-sm"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="mx-2 font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="btn btn-ghost btn-sm"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Remove Item Button */}
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="btn btn-ghost btn-circle text-error"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary Section */}
        {cartItems.length > 0 && (
          <div className="lg:col-span-1 bg-base-200 p-6 rounded-lg h-fit">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="divider"></div>

            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <Link 
              to="/customer/checkout" 
              className="btn btn-primary btn-block"
            >
              Proceed to Checkout
            </Link>

            <Link 
              to="/customer/products" 
              className="btn btn-ghost btn-block mt-2"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;