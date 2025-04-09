import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Share2,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../Components/customer/Navbar";
import ReviewDialog from "../../Components/customer/ReviewDialog";
import { useCart } from "../../zustand/useCart";
import { useAuth } from "../../context/AuthContext";
const Product = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const product = location.state?.product;
  const {authUser}=useAuth();
  const [images, setImages] = useState(product.images[0].image);
  const [image, setImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(product.images[0].quantity);
  const [selectedColor, setSelectedColor] = useState(product.images[0].color);
  const [selectedSize, setSelectedSize] = useState(product.images[0].size[0]);
  const [itemCount, setItemCount] = useState(1);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // Handle color selection
  const handleColorSelect = (colorData, index) => {
    setImages(colorData.image);
    setImage(colorData.image[0]);
    setQuantity(colorData.quantity);
    setSelectedColor(colorData.color);
    setSelectedSize(colorData.size[0]);
    setCurrentColorIndex(index);
    setMainImageIndex(0);
  };

  // Handle size selection
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  // Handle add to cart
  // In your Product component
const { addToCart, isLoading, error } = useCart();

const handleAddToCart = async (product, colorIndex) => {
  // Check if enough stock is available
  if(authUser){

    
    if (quantity < itemCount) {
    alert('Not enough stock available!');
    return;
  }

  const selectedColorData = product.images[colorIndex];
  
  const cartItem = {
    product: product,
    quantity: itemCount,
    color: selectedColor,
    size: selectedSize,
    price: selectedColorData.price,
    image: selectedColorData.image[0] // First image of selected color
  };

  const result = await addToCart(cartItem);
  
  if (result.success) {
    // Show success message
    alert(`Added ${itemCount} ${selectedColor} ${selectedSize} to cart!`);
  } else {
    // Show error message
    alert(`Failed to add to cart: ${result.error || 'Unknown error'}`);
  }
}
else
{
  navigate('/customer/login');
}
};

  // Handle buy now
  const handleBuyNow = () => {
    // Implement buy now functionality
    navigate("/customer/checkout", {
      state: {
        product: product,
        quantity: itemCount,
        color: selectedColor,
        size: selectedSize,
      },
    });
  };

  // Handle item count changes
  const incrementCount = () => {
    if (itemCount < quantity) {
      setItemCount(itemCount + 1);
    }
  };

  const decrementCount = () => {
    if (itemCount > 1) {
      setItemCount(itemCount - 1);
    }
  };

  // Handle image navigation
  const nextImage = () => {
    if (mainImageIndex < images.length - 1) {
      setMainImageIndex(mainImageIndex + 1);
      setImage(images[mainImageIndex + 1]);
    }
  };

  const prevImage = () => {
    if (mainImageIndex > 0) {
      setMainImageIndex(mainImageIndex - 1);
      setImage(images[mainImageIndex - 1]);
    }
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="fill-yellow-400 text-yellow-400"
          size={16}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="fill-mustard text-mustard" size={16} />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="text-gray-300" size={16} />
      );
    }

    return stars;
  };

  return (
    <div className="bg-wineRed min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto pt-16 px-4 lg:px-0">
        {/* Product Overview Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mt-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image Gallery Section */}
            <div className="lg:w-1/2">
              <div className="relative">
                <img
                  src={image}
                  alt={`${product.name} in ${selectedColor}`}
                  className="w-full h-96 object-cover rounded-lg shadow-md"
                />

                {/* Image navigation buttons */}
                <button
                  onClick={prevImage}
                  disabled={mainImageIndex === 0}
                  className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md ${
                    mainImageIndex === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <ArrowLeft size={20} />
                </button>

                <button
                  onClick={nextImage}
                  disabled={mainImageIndex === images.length - 1}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md ${
                    mainImageIndex === images.length - 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <ArrowRight size={20} />
                </button>
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setImage(img);
                      setMainImageIndex(index);
                    }}
                    className={`cursor-pointer rounded-md ${
                      index === mainImageIndex
                        ? "ring-2 ring-blue-500"
                        : "opacity-70"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info Section */}
            <div className="lg:w-1/2 flex flex-col">
              <h1 className="text-2xl font-bold text-wineRed">
                {product.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-sm text-wineRed">
                  {product.rating} ({product.reviewCount} review)
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-center">
                <span className="text-2xl font-bold text-wineRed">
                ₹{product.images[currentColorIndex].price}
                </span>
                {product.images[currentColorIndex].originalPrice!=product.images[currentColorIndex].price && (
                  <span className="ml-3 text-lg text-wineRed line-through">
                    ₹{product.images[currentColorIndex].originalPrice}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="ml-3 text-sm font-medium text-green-600">
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    % OFF
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-wineRed">{product.description}</p>

              {/* Availability */}
              <div className="mt-4 flex items-center">
                <span className="text-sm font-medium text-gray-700">
                  Availability:
                </span>
                <span
                  className={`ml-2 text-sm ${
                    quantity > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {quantity > 0
                    ? `In Stock (${quantity} available)`
                    : "Out of Stock"}
                </span>
              </div>

              {/* Product Details */}
              <div className="mt-4">
                <h3 className="text-lg font-medium text-wineRed">
                  Product Details
                </h3>
                <ul className="mt-2 space-y-1">
                  {product?.details?.map((detail, index) => (
                    <li
                      key={index}
                      className="text-sm text-wineRed flex items-center"
                    >
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Color Selection */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-wineRed">Color</h3>
                <div className="flex items-center space-x-3 mt-2">
                  {product.images.map((colorOption, index) => (
                    <div
                      key={index}
                      onClick={() => handleColorSelect(colorOption, index)}
                      className={`relative p-0.5 rounded-full ${
                        index === currentColorIndex
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                        style={{
                          backgroundColor: colorOption.color
                            .toLowerCase()
                            .replace(" ", ""),
                        }}
                        title={colorOption.color}
                      />
                      {colorOption.quantity < 5 && colorOption.quantity > 0 && (
                        <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
                          {colorOption.quantity}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-wineRed">
                  Selected: {selectedColor}
                </span>
              </div>

              {/* Size Selection */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-wineRed">Size</h3>
                  <a
                    href="#"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Size Guide
                  </a>
                </div>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {product.images[currentColorIndex].size.map((size, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSizeSelect(size)}
                      className={`py-2 px-4 text-sm font-medium rounded-md border ${
                        selectedSize === size
                          ? "bg-wineRed text-mustard border-transparent"
                          : "bg-white text-wineRed border-gray-300 hover:bg-wineRed"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-wineRed">Quantity</h3>
                <div className="flex items-center mt-2 border border-gray-300 rounded-md w-32">
                  <button
                    type="button"
                    className="p-2 text-wineRed hover:text-gray-700"
                    onClick={decrementCount}
                    disabled={itemCount <= 1}
                  >
                    <span className="text-lg font-medium">−</span>
                  </button>
                  <input
                    type="text"
                    className="w-full text-center border-0 focus:ring-0"
                    value={itemCount}
                    readOnly
                  />
                  <button
                    type="button"
                    className="p-2 text-wineRed hover:text-gray-700"
                    onClick={incrementCount}
                    disabled={itemCount >= quantity}
                  >
                    <span className="text-lg font-medium">+</span>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={()=>{
                    handleAddToCart(product,currentColorIndex);
                  }}
                  disabled={quantity === 0}
                  className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-wineRed bg-mustard hover:bg-mustard/50 disabled:bg-gray-300"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={quantity === 0}
                  className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-wineRed bg-mustard hover:bg-mustard/50 disabled:bg-gray-300"
                >
                  Buy Now
                </button>
              </div>

              {/* Shipping Information */}
              <div className="mt-6 p-4 bg-wineRed/20 rounded-md flex items-start">
                <Truck className="h-5 w-5 text-wineRed mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-wineRed">
                    Free Shipping & Returns
                  </h4>
                  <p className="text-sm text-wineRed">
                    Free standard shipping on orders over $50. Estimated
                    delivery: 3-5 business days.
                  </p>
                </div>
              </div>

              {/* Wishlist & Share */}
              <div className="mt-6 flex items-center space-x-4">
                <button className="flex items-center text-sm text-wineRed hover:text-gray-700">
                  <Heart className="h-5 w-5 mr-1" />
                  Add to Wishlist
                </button>
                <button className="flex items-center text-sm text-wineRed hover:text-gray-700">
                  <Share2 className="h-5 w-5 mr-1" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Color Options Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-wineRed mb-4">
            Available Colors
          </h2>
          <div className="flex gap-6 items-center overflow-x-auto pb-4">
            {product.images.map((colorData, index) => (
              <div
                key={index}
                className={`flex flex-col items-center cursor-pointer min-w-[100px] p-2 rounded-lg ${
                  index === currentColorIndex
                    ? "bg-mustard ring-2 ring-mustard text-wineRed"
                    : "hover:bg-mustard/85 text-wineRed"
                }`}
                onClick={() => handleColorSelect(colorData, index)}
              >
                <img
                  src={colorData.image[0]}
                  alt={colorData.color}
                  className="w-20 h-20 object-cover rounded-lg shadow-sm"
                />
                <p className="mt-2 text-sm font-medium">{colorData.color}</p>
                <p className="text-xs text-black">
                  {colorData.quantity > 0
                    ? `${colorData.quantity} in stock`
                    : "Out of stock"}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Review Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mt-6 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-wineRed">
              Customer Reviews
            </h2>
            <button
              onClick={() => setOpen(true)}
              className="px-4 py-2 bg-wineRed text-mustard rounded-md hover:bg-mustard hover:text-wineRed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Write a Review
            </button>
          </div>

          {/* Review Summary */}
          <div className="flex flex-col md:flex-row gap-6 pb-6 border-b">
            <div className="flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-wineRed">
                {product.rating}
              </div>
              <div className="flex mt-2">{renderStars(product.rating)}</div>
              <div className="mt-1 text-sm text-wineRed">
                {product.reviewCount} reviews
              </div>
            </div>

            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const percentage =
                  Math.round(
                    (product?.review.filter(
                      (review) => Math.floor(review.rating) === star
                    ).length /
                      product.review.length) *
                      100
                  ) || 0;

                return (
                  <div key={star} className="flex items-center">
                    <div className="w-12 text-sm text-wineRed">
                      {star} stars
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                      <div
                        className="bg-mustard h-2.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="ml-2 text-sm text-wineRed">
                      {percentage}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="mt-6 space-y-6">
            {product.review.map((review, index) => (
              <div key={index} className="border-b pb-6 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-wineRed">{review.name}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="ml-2 text-sm text-wineRed">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-wineRed">{review.comment}</div>
                <div className="mt-4 flex gap-2">
                  <button className="text-sm text-wineRed hover:text-gray-700">
                    Helpful
                  </button>
                  <span className="text-gray-300">|</span>
                  <button className="text-sm text-wineRed hover:text-gray-700">
                    Report
                  </button>
                </div>
              </div>
            ))}

            {product.review.length === 0 && (
              <div className="text-center py-8">
                <p className="text-wineRed">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}

            {product.review.length > 0 && (
              <div className="mt-6 text-center">
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  Load more reviews
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Review Dialog */}
      <ReviewDialog
        open={open}
        setOpen={setOpen}
        productName={product.name}
        onSubmit={(reviewData) => {
          // Implement review submission
          console.log("Review submitted:", reviewData);
          setOpen(false);
        }}
      />
    </div>
  );
};

export default Product;
