import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, TruckIcon, Clock, PercentIcon, Shield } from 'lucide-react';
import { useCart } from '../../zustand/useCart';
import WishlistButton from './WishlistButton';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Safely access the first variant and its first size option
  const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  const firstSizeOption = firstVariant && firstVariant.sizeOptions && firstVariant.sizeOptions.length > 0 
    ? firstVariant.sizeOptions[0] 
    : null;
  
  // Calculate discount percentage
  const calculateDiscount = () => {
    if (!firstSizeOption) return 0;
    
    const originalPrice = firstSizeOption.originalPrice;
    const currentPrice = firstSizeOption.price;
    if (originalPrice > currentPrice) {
      return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }
    return 0;
  };
  
  const discountPercentage = calculateDiscount();
  
  // Calculate total quantity across all sizes of first variant
  const calculateTotalQuantity = () => {
    if (!firstVariant || !firstVariant.sizeOptions) return 0;
    
    return firstVariant.sizeOptions.reduce((total, option) => total + option.quantity, 0);
  };
  
  const totalQuantity = calculateTotalQuantity();
  
  // Stock status
  const stockStatus = totalQuantity > 0 
    ? totalQuantity < 5 
      ? 'Low Stock' 
      : 'In Stock' 
    : 'Out of Stock';
  
  const handleProductClick = () => {
    navigate(`/customer/product/${product._id.$oid || product._id}`, { state: { product } });
  };
  
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!firstVariant || !firstSizeOption) {
      alert('Product information is incomplete');
      return;
    }
    
    const cartItem = {
      product: product,
      productId: product._id.$oid || product._id,
      quantity: 1,
      color: firstVariant.color,
      size: firstSizeOption.size,
      price: firstSizeOption.price,
      image: firstVariant.images && firstVariant.images.length > 0 ? firstVariant.images[0] : ''
    };
    
    const result = await addToCart(cartItem);
    
    if (result.success) {
      alert(`Added to cart!`);
    } else {
      alert(`Failed to add to cart: ${result.error || 'Unknown error'}`);
    }
  };
  
  // If no variant data is available, render a placeholder
  if (!firstVariant) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 p-4">
        <h3 className="font-medium text-green-900">{product.name}</h3>
        <p className="text-gray-500 text-sm">Product data incomplete</p>
      </div>
    );
  }
  
  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 relative group cursor-pointer hover:shadow-xl transition-all duration-300"
      onClick={handleProductClick}
    >
      {/* Badge for discount */}
      {discountPercentage > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
          <PercentIcon className="h-3 w-3 mr-1" />
          {discountPercentage}% OFF
        </div>
      )}
      
      {/* Wishlist button */}
      <div className="absolute top-2 right-2 z-10">
        <WishlistButton product={product} />
      </div>
      
      {/* Image container with overlay on hover */}
      <div className="h-60 overflow-hidden relative">
        <img
          src={firstVariant.images && firstVariant.images.length > 0 
            ? firstVariant.images[0] 
            : 'https://placehold.co/300x300?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Quick view overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-white text-green-900 px-4 py-2 rounded-md font-medium text-sm">
            Quick View
          </span>
        </div>
      </div>
      
      {/* Product info section */}
      <div className="p-4 border-t border-gray-100">
        {/* Product name and color */}
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-green-900 line-clamp-2 text-base hover:text-green-700">{product.name}</h3>
          <span className="bg-mustard text-green-900 font-bold px-2 py-1 text-xs rounded-full whitespace-nowrap ml-2">
            {firstVariant.color}
          </span>
        </div>
        
        {/* Category tag */}
        <div className="mt-1">
          <span className="text-xs text-gray-500 uppercase">{product.category}</span>
        </div>
        
        {/* Rating */}
        <div className="mt-2 flex items-center">
          <div className="flex items-center text-yellow-500">
            <Star className="h-3 w-3 fill-current" />
            <Star className="h-3 w-3 fill-current" />
            <Star className="h-3 w-3 fill-current" />
            <Star className="h-3 w-3 fill-current" />
            <Star className="h-3 w-3" />
          </div>
          <span className="ml-1 text-xs text-gray-500">(4.0)</span>
        </div>
        
        {/* Price section */}
        <div className="mt-2 flex items-center">
          <span className="font-bold text-green-900 text-lg">₹{firstSizeOption.price}</span>
          {firstSizeOption.originalPrice !== firstSizeOption.price && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              ₹{firstSizeOption.originalPrice}
            </span>
          )}
        </div>
        
        {/* Stock status and delivery info */}
        <div className="mt-2 flex items-center justify-between text-xs">
          <div className={`flex items-center ${stockStatus === 'Out of Stock' ? 'text-red-500' : stockStatus === 'Low Stock' ? 'text-orange-500' : 'text-green-600'}`}>
            <Clock className="h-3 w-3 mr-1" />
            <span>{stockStatus}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <TruckIcon className="h-3 w-3 mr-1" />
            <span>Fast delivery</span>
          </div>
        </div>
        
        {/* Size options preview */}
        <div className="mt-2 flex items-center">
          <span className="text-xs text-gray-500 mr-2">Sizes:</span>
          <div className="flex space-x-1 overflow-x-auto">
            {firstVariant.sizeOptions.slice(0, 3).map((sizeOption, index) => (
              <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {sizeOption.size}
              </span>
            ))}
            {firstVariant.sizeOptions.length > 3 && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                +{firstVariant.sizeOptions.length - 3}
              </span>
            )}
          </div>
        </div>
        
        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={totalQuantity <= 0}
          className="mt-3 w-full flex items-center justify-center px-4 py-2 bg-mustard text-green-900 rounded-md hover:bg-yellow-500 font-bold disabled:bg-gray-300 disabled:text-gray-500 transition-colors duration-300"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {totalQuantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        
        {/* Trust badges */}
        <div className="mt-2 flex justify-center text-xs text-gray-500">
          <div className="flex items-center mx-1">
            <Shield className="h-3 w-3 mr-1" />
            <span>Secure</span>
          </div>
          <span className="mx-1">•</span>
          <div className="flex items-center mx-1">
            <TruckIcon className="h-3 w-3 mr-1" />
            <span>Free shipping</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;