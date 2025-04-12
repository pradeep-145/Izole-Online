import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../zustand/useCart';
import WishlistButton from './WishlistButton';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const handleProductClick = () => {
    navigate(`/customer/product/${product._id}`, { state: { product } });
  };
  
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    const cartItem = {
      product: product,
      productId: product._id,
      quantity: 1,
      color: product.images[0].color,
      size: product.images[0].size[0],
      price: product.images[0].price,
      image: product.images[0].image[0]
    };
    
    const result = await addToCart(cartItem);
    
    if (result.success) {
      alert(`Added to cart!`);
    } else {
      alert(`Failed to add to cart: ${result.error || 'Unknown error'}`);
    }
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 relative group cursor-pointer"
      onClick={handleProductClick}
    >
      <div className="absolute top-2 right-2 z-10">
        <WishlistButton product={product} />
      </div>
      
      <div className="h-64 overflow-hidden">
        <img
          src={product.images[0].image[0]}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between">
          <h3 className="font-medium text-green-900">{product.name}</h3>
          <span className="bg-mustard text-green-900 font-bold px-2 py-1 text-xs rounded-full">
            {product.images[0].color}
          </span>
        </div>
        
        <div className="mt-2 flex items-center">
          <span className="font-bold text-green-900">₹{product.images[0].price}</span>
          {product.images[0].originalPrice !== product.images[0].price && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              ₹{product.images[0].originalPrice}
            </span>
          )}
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={product.images[0].quantity <= 0}
          className="mt-3 w-full flex items-center justify-center px-4 py-2 bg-mustard text-green-900 rounded-md hover:bg-mustard font-bold disabled:bg-gray-300 disabled:text-gray-500"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;