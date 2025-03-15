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

const Product = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  // const product = location.state?.product;
  const product = {
    name: "Premium Leather Jacket",
    price: 199.99,
    originalPrice: 249.99,
    description:
      "High-quality leather jacket with a modern design. Perfect for casual outings and formal events alike. Made from genuine leather that is both durable and comfortable.",
    details: [
      "100% Genuine Leather",
      "Soft cotton lining",
      "Multiple pockets",
      "Water-resistant",
      "Available in 5 colors",
    ],
    rating: 4.5,
    reviewCount: 127,
    images: [
      {
        image: [
          "https://th.bing.com/th/id/OIP.HOb_8jSrQ1mwzuuE9B7SfAHaLG?rs=1&pid=ImgDetMain",
          "https://th.bing.com/th/id/OIP.xU1B1N4yNIitYKdy61_5RgHaIC?w=185&h=200&c=7&r=0&o=5&pid=1.7",
          "https://th.bing.com/th/id/OIP.f4kxBVKD8iYdwIG3ZtjpsgHaHa?w=200&h=200&c=7&r=0&o=5&pid=1.7",
          "https://th.bing.com/th/id/OIP.s_SjZaWQOOPk1VUs_nKbawHaHa?w=195&h=195&c=7&r=0&o=5&pid=1.7",
          "https://th.bing.com/th/id/OIP.HOb_8jSrQ1mwzuuE9B7SfAHaLG?rs=1&pid=ImgDetMain",
        ],
        quantity: 20,
        color: "Black",
        size: ["S", "M", "L", "XL", "XXL"],
      },
      {
        image: [
          "https://th.bing.com/th/id/OIP.xU1B1N4yNIitYKdy61_5RgHaIC?w=185&h=200&c=7&r=0&o=5&pid=1.7",
          "https://th.bing.com/th/id/OIP.f4kxBVKD8iYdwIG3ZtjpsgHaHa?w=200&h=200&c=7&r=0&o=5&pid=1.7",
          "https://th.bing.com/th/id/OIP.s_SjZaWQOOPk1VUs_nKbawHaHa?w=195&h=195&c=7&r=0&o=5&pid=1.7",
          "https://th.bing.com/th/id/OIP.HOb_8jSrQ1mwzuuE9B7SfAHaLG?rs=1&pid=ImgDetMain",
        ],
        quantity: 2,
        color: "Blue",
        size: ["M", "L", "XL"],
      },
      {
        image: [
          "https://th.bing.com/th/id/OIP.f4kxBVKD8iYdwIG3ZtjpsgHaHa?w=200&h=200&c=7&r=0&o=5&pid=1.7",
          "https://th.bing.com/th/id/OIP.s_SjZaWQOOPk1VUs_nKbawHaHa?w=195&h=195&c=7&r=0&o=5&pid=1.7",
          "https://th.bing.com/th/id/OIP.HOb_8jSrQ1mwzuuE9B7SfAHaLG?rs=1&pid=ImgDetMain",
          "https://th.bing.com/th/id/OIP.xU1B1N4yNIitYKdy61_5RgHaIC?w=185&h=200&c=7&r=0&o=5&pid=1.7",
        ],
        quantity: 40,
        color: "Brown",
        size: ["S", "M", "L", "XL", "XXL"],
      },
      {
        image: [
          "https://th.bing.com/th/id/OIP.s_SjZaWQOOPk1VUs_nKbawHaHa?w=195&h=195&c=7&r=0&o=5&pid=1.7",
          "https://th.bing.com/th/id/OIP.HOb_8jSrQ1mwzuuE9B7SfAHaLG?rs=1&pid=ImgDetMain",
          "https://th.bing.com/th/id/OIP.xU1B1N4yNIitYKdy61_5RgHaIC?w=185&h=200&c=7&r=0&o=5&pid=1.7",
          "https://th.bing.com/th/id/OIP.f4kxBVKD8iYdwIG3ZtjpsgHaHa?w=200&h=200&c=7&r=0&o=5&pid=1.7",
        ],
        quantity: 50,
        color: "Green",
        size: ["S", "M", "L", "XL"],
      },
      {
        image: [
          "https://th.bing.com/th/id/OIP.HOb_8jSrQ1mwzuuE9B7SfAHaLG?rs=1&pid=ImgDetMain",
          "https://th.bing.com/th/id/OIP.xU1B1N4yNIitYKdy61_5RgHaIC?w=185&h=200&c=7&r=0&o=5&pid=1.7",
          "https://th.bing.com/th/id/OIP.f4kxBVKD8iYdwIG3ZtjpsgHaHa?w=200&h=200&c=7&r=0&o=5&pid=1.7",
          "https://th.bing.com/th/id/OIP.s_SjZaWQOOPk1VUs_nKbawHaHa?w=195&h=195&c=7&r=0&o=5&pid=1.7",
        ],
        quantity: 60,
        color: "Olive Green",
        size: ["M", "L", "XL", "XXL"],
      },
    ],
    reviews: [
      {
        name: "John Doe",
        rating: 5,
        date: "March 10, 2025",
        comment:
          "This jacket exceeded my expectations. The quality is excellent, and it fits perfectly. I've received many compliments while wearing it.",
      },
      {
        name: "Sarah Smith",
        rating: 4,
        date: "February 28, 2025",
        comment:
          "I love the design and the material. It's slightly heavier than I expected, but the quality is worth it. Fast shipping too!",
      },
      {
        name: "Mike Johnson",
        rating: 4.5,
        date: "February 15, 2025",
        comment:
          "Great jacket for the price. The leather is soft and the stitching is well done. My only complaint is that it runs a bit small.",
      },
    ],
  };

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
  const handleAddToCart = () => {
    // Implement add to cart functionality
    alert(`Added ${itemCount} ${selectedColor} ${selectedSize} to cart!`);
  };

  // Handle buy now
  const handleBuyNow = () => {
    // Implement buy now functionality
    navigate("/checkout", {
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
        <Star
          key="half"
          className="fill-yellow-400 text-yellow-400"
          size={16}
        />
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
    <div className="bg-gray-50 min-h-screen">
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
              <h1 className="text-2xl font-bold text-gray-800">
                {product.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-center">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="ml-3 text-lg text-gray-500 line-through">
                    ${product.originalPrice}
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
              <p className="mt-4 text-gray-600">{product.description}</p>

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
                <h3 className="text-lg font-medium text-gray-900">
                  Product Details
                </h3>
                <ul className="mt-2 space-y-1">
                  {product.details.map((detail, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-600 flex items-center"
                    >
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Color Selection */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Color</h3>
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
                <span className="text-sm text-gray-500">
                  Selected: {selectedColor}
                </span>
              </div>

              {/* Size Selection */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
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
                          ? "bg-blue-600 text-white border-transparent"
                          : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                <div className="flex items-center mt-2 border border-gray-300 rounded-md w-32">
                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-gray-700"
                    onClick={decrementCount}
                    disabled={itemCount <= 1}
                  >
                    <span className="text-lg font-medium">−</span>
                  </button>
                  <input
                    type="text"
                    className="w-full text-center  border-0 focus:ring-0"
                    value={itemCount}
                    readOnly
                  />
                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-gray-700"
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
                  onClick={handleAddToCart}
                  disabled={quantity === 0}
                  className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={quantity === 0}
                  className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
                >
                  Buy Now
                </button>
              </div>

              {/* Shipping Information */}
              <div className="mt-6 p-4 bg-gray-50 rounded-md flex items-start">
                <Truck className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Free Shipping & Returns
                  </h4>
                  <p className="text-sm text-gray-500">
                    Free standard shipping on orders over $50. Estimated
                    delivery: 3-5 business days.
                  </p>
                </div>
              </div>

              {/* Wishlist & Share */}
              <div className="mt-6 flex items-center space-x-4">
                <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                  <Heart className="h-5 w-5 mr-1" />
                  Add to Wishlist
                </button>
                <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                  <Share2 className="h-5 w-5 mr-1" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Color Options Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Available Colors
          </h2>
          <div className="flex gap-6 items-center overflow-x-auto pb-4">
            {product.images.map((colorData, index) => (
              <div
                key={index}
                className={`flex flex-col items-center cursor-pointer min-w-[100px] p-2 rounded-lg ${
                  index === currentColorIndex
                    ? "bg-blue-50 ring-2 ring-blue-300"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleColorSelect(colorData, index)}
              >
                <img
                  src={colorData.image[0]}
                  alt={colorData.color}
                  className="w-20 h-20 object-cover rounded-lg shadow-sm"
                />
                <p className="mt-2 text-sm font-medium">{colorData.color}</p>
                <p className="text-xs text-gray-500">
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
            <h2 className="text-xl font-semibold text-gray-800">
              Customer Reviews
            </h2>
            <button
              onClick={() => setOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Write a Review
            </button>
          </div>

          {/* Review Summary */}
          <div className="flex flex-col md:flex-row gap-6 pb-6 border-b">
            <div className="flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-gray-900">
                {product.rating}
              </div>
              <div className="flex mt-2">{renderStars(product.rating)}</div>
              <div className="mt-1 text-sm text-gray-500">
                {product.reviewCount} reviews
              </div>
            </div>

            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const percentage =
                  Math.round(
                    (product.reviews.filter(
                      (review) => Math.floor(review.rating) === star
                    ).length /
                      product.reviews.length) *
                      100
                  ) || 0;

                return (
                  <div key={star} className="flex items-center">
                    <div className="w-12 text-sm text-gray-600">
                      {star} stars
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                      <div
                        className="bg-yellow-400 h-2.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="ml-2 text-sm text-gray-500">
                      {percentage}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="mt-6 space-y-6">
            {product.reviews.map((review, index) => (
              <div key={index} className="border-b pb-6 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{review.name}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="ml-2 text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-gray-600">{review.comment}</div>
                <div className="mt-4 flex gap-2">
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    Helpful
                  </button>
                  <span className="text-gray-300">|</span>
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    Report
                  </button>
                </div>
              </div>
            ))}

            {product.reviews.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}

            {product.reviews.length > 0 && (
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
