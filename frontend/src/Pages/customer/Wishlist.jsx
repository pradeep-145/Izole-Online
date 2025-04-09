import { Heart, ShoppingCart, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/customer/Navbar";
import { useWishlist } from "../../zustand/useWishlist";
import { useCart } from "../../zustand/useCart";

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, fetchWishlist, isLoading, error } = useWishlist();
  const { addToCart } = useCart();
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemoveFromWishlist = async (productId) => {
    const result = await removeFromWishlist(productId);
    if (result.success) {
      showNotification("Item removed from wishlist", "success");
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
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto pt-20 px-4 lg:px-0 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900 mx-auto"></div>
            <p className="mt-4 text-green-900">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-md shadow-md flex items-center justify-between ${
          notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification({ show: false, message: "", type: "" })} className="ml-4">
            <X size={16} />
          </button>
        </div>
      )}

      <main className="max-w-6xl mx-auto pt-20 px-4 lg:px-0">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-green-900">My Wishlist</h1>
          <div className="flex items-center">
            <Heart className="mr-2 text-green-900" />
            <span className="text-green-900">{wishlistItems.length} items</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {wishlistItems.length === 0 ? (
          <div className="bg-yellow-50 rounded-lg shadow-md p-8 text-center">
            <Heart className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-xl font-semibold text-green-900 mb-2">Your wishlist is empty</h2>
            <p className="text-green-800 mb-6">Add items to your wishlist to keep track of products you love.</p>
            <button
              onClick={() => navigate("/customer/products")}
              className="px-6 py-3 bg-yellow-500 text-green-900 rounded-md hover:bg-yellow-400 font-medium"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 relative group"
              >
                <button
                  onClick={() => handleRemoveFromWishlist(item.product._id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md text-red-500 hover:text-red-600 z-10"
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
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => navigateToProduct(item.product)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-green-900 text-lg">{item.product.name}</h3>
                    <span className="bg-yellow-100 text-green-900 px-2 py-1 text-xs rounded-full">
                      {item.product.images[0].color}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center">
                    <span className="text-lg font-bold text-green-900">₹{item.product.images[0].price}</span>
                    {item.product.images[0].originalPrice !== item.product.images[0].price && (
                      <span className="ml-2 text-sm text-green-900 line-through">
                        ₹{item.product.images[0].originalPrice}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2 flex items-center text-sm text-green-800">
                    <span>
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
                    className="w-full flex items-center justify-center px-4 py-2 bg-yellow-500 text-green-900 rounded-md hover:bg-yellow-400 disabled:bg-gray-300 disabled:text-gray-500"
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