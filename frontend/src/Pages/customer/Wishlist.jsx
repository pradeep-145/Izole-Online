import { Heart, ShoppingCart, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/customer/Navbar";
import { useWishlist } from "../../zustand/useWishlist";
import { useCart } from "../../zustand/useCart";

// IZOLE brand colors
const COLORS = {
  darkGreen: "#1A3B2A", // Main background color
  mustardGold: "#D6AF36", // Accent color
  lightGold: "#E9D185", // Lighter accent
  cream: "#F5F1E0", // Light background
  darkText: "#333333", // Dark text
  white: "#FFFFFF", // White text
};

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, fetchWishlist, isLoading, error } = useWishlist();
  const { addToCart } = useCart();
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });



  const handleRemoveFromWishlist = async (productId) => {
    const result = await removeFromWishlist(productId);
    if (result.success) {
      showNotification(<span style={{ color: COLORS.darkGreen }}>"Item removed from wishlist"</span>, "success");
    } else {
      showNotification(result.error || "Failed to remove item", "error");
    }
  };

  const handleAddToCart = async (item) => {
    const cartItem = {
      product: item.product,
      productId: item.product._id,
      quantity: 1,
      color: item.product.images[0].color,
      size: item.product.images[0].size[0],
      price: item.product.images[0].price,
      image: item.product.images[0].image[0]
    };

    const result = await addToCart(cartItem);
    if (result.success) {
      showNotification("Item added to cart", "success");
    } else {
      showNotification(result.error || "Failed to add item to cart", "error");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const navigateToProduct = (product) => {
    navigate(`/customer/product/${product._id}`, { state: { product } });
  };

  if (isLoading) {
    return (
      <div style={{ backgroundColor: COLORS.cream }} className="min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto pt-20 px-4 lg:px-0 flex justify-center items-center">
          <div className="text-center">
            <div style={{ borderColor: COLORS.darkGreen }} className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"></div>
            <p style={{ color: COLORS.darkGreen }} className="mt-4 font-medium">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: COLORS.cream }} className="min-h-screen">
      <Navbar />

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-md shadow-md flex items-center justify-between ${
          notification.type === "success" 
            ? `bg-opacity-90 bg-green-100 text-${COLORS.darkGreen}` 
            : "bg-red-100 text-red-800"
        }`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification({ show: false, message: "", type: "" })} className="ml-4">
            <X size={16} />
          </button>
        </div>
      )}

      <main className="max-w-6xl mx-auto pt-20 px-4 lg:px-0 scroll-p-0">
        <div className="flex justify-between items-center mb-8">
          <h1 style={{ color: COLORS.darkGreen }} className="text-2xl font-bold">My Wishlist</h1>
          <div className="flex items-center">
            <Heart style={{ color: COLORS.mustardGold }} className="mr-2" />
            <span style={{ color: COLORS.darkGreen }} className="font-medium">{wishlistItems.length} items</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {wishlistItems.length === 0 ? (
          <div style={{ backgroundColor: COLORS.white }} className="rounded-lg shadow-md p-8 text-center">
            <Heart style={{ color: COLORS.mustardGold }} className="w-16 h-16 mx-auto mb-4" />
            <h2 style={{ color: COLORS.darkGreen }} className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p style={{ color: COLORS.darkGreen + "CC" }} className="mb-6">Add items to your wishlist to keep track of products you love.</p>
            <button
              onClick={() => navigate("/customer/products")}
              style={{ 
                backgroundColor: COLORS.mustardGold, 
                color: COLORS.darkGreen 
              }}
              className="px-6 py-3 rounded-md hover:opacity-90 font-medium transition-opacity"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.product._id}
                style={{ backgroundColor: COLORS.white, borderColor: "rgba(26, 59, 42, 0.1)" }}
                className="rounded-lg shadow-md overflow-hidden border relative group"
              >
                <button
                  onClick={() => handleRemoveFromWishlist(item.product._id)}
                  style={{ color: "#D32F2F" }}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 z-10 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                
                <div 
                  className="h-64 overflow-hidden cursor-pointer"
                  onClick={() => navigateToProduct(item.product)}
                >
                  <img
                    src={item.product.images[0].image[0]}
                    alt={item.product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => navigateToProduct(item.product)}
                >
                  <div className="flex justify-between items-start">
                    <h3 style={{ color: COLORS.darkGreen }} className="font-medium text-lg">{item.product.name}</h3>
                    <span style={{ backgroundColor: COLORS.lightGold + "50", color: COLORS.darkGreen }} className="px-2 py-1 text-xs rounded-full">
                      {item.product.images[0].color}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center">
                    <span style={{ color: COLORS.darkGreen }} className="text-lg font-bold">₹{item.product.images[0].price}</span>
                    {item.product.images[0].originalPrice !== item.product.images[0].price && (
                      <span style={{ color: COLORS.darkGreen + "99" }} className="ml-2 text-sm line-through">
                        ₹{item.product.images[0].originalPrice}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2 flex items-center text-sm">
                    <span style={{ color: COLORS.darkGreen + "CC" }}>
                      {item.product.images[0].quantity > 0
                        ? `${item.product.images[0].quantity} in stock`
                        : "Out of stock"}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={item.product.images[0].quantity <= 0}
                    style={{ 
                      backgroundColor: item.product.images[0].quantity > 0 ? COLORS.darkGreen : "#9E9E9E",
                      color: item.product.images[0].quantity > 0 ? COLORS.mustardGold : "#E0E0E0"
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;