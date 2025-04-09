import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../zustand/useWishlist';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const WishlistButton = ({ product, size = 20, className = "" }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const inWishlist = isInWishlist(product._id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!authUser) {
      navigate('/customer/login');
      return;
    }
    
    setIsLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      console.error('Wishlist operation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleWishlistToggle}
      disabled={isLoading}
      className={`p-2 rounded-full ${
        inWishlist 
          ? "bg-red-50 text-red-500 hover:bg-red-100" 
          : "bg-white text-gray-500 hover:text-red-500 hover:bg-red-50"
      } transition-colors ${className}`}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        size={size} 
        className={inWishlist ? "fill-red-500" : ""} 
      />
    </button>
  );
};

export default WishlistButton;