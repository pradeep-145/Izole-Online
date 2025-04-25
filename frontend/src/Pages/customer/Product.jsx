import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../Components/customer/Navbar";
import ReviewDialog from "../../Components/customer/ReviewDialog";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../zustand/useCart";
import { useWishlist } from "../../zustand/useWishlist";

const Product = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const product = location.state?.product;
  const { authUser } = useAuth();

  // Initialize states with proper null checks and adapt to new schema
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
  const [currentVariant, setCurrentVariant] = useState(
    product?.variants?.[0] || {}
  );
  const [currentSizeIndex, setCurrentSizeIndex] = useState(0);
  const [currentSizeOption, setCurrentSizeOption] = useState(
    currentVariant?.sizeOptions?.[0] || {}
  );
  const [images, setImages] = useState(currentVariant?.images || []);
  const [mainImage, setMainImage] = useState(images[0] || "");
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [itemCount, setItemCount] = useState(1);

  // Wishlist related states and functions
  const { addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist } =
    useWishlist();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const inWishlist = product ? isInWishlist(product._id) : false;

  // Fetch wishlist on component mount
  useEffect(() => {
    if (authUser) {
      fetchWishlist().catch((error) => {
        console.error("Failed to fetch wishlist:", error);
      });
    }
  }, [authUser, fetchWishlist]);

  // Update currentSizeOption when currentSizeIndex changes
  useEffect(() => {
    if (currentVariant?.sizeOptions && currentVariant.sizeOptions.length > 0) {
      setCurrentSizeOption(currentVariant.sizeOptions[currentSizeIndex]);
    }
  }, [currentSizeIndex, currentVariant]);

  // Handle wishlist toggle
  const handleWishlistToggle = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!authUser) {
      navigate("/customer/login");
      return;
    }

    if (!product) return;

    setIsWishlistLoading(true);
    try {
      if (inWishlist) {
        const result = await removeFromWishlist(product._id);
        if (result.success) {
          // Optional: show success message
          console.log("Removed from wishlist successfully");
        }
      } else {
        const result = await addToWishlist(product);
        if (result.success) {
          // Optional: show success message
          console.log("Added to wishlist successfully");
        }
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // Handle color/variant selection
  const handleVariantSelect = (variant, index) => {
    if (!variant) return;

    setCurrentVariant(variant);
    setImages(variant.images);
    setMainImage(variant.images[0]);
    setCurrentVariantIndex(index);
    setMainImageIndex(0);
    setCurrentSizeIndex(0);
    setCurrentSizeOption(variant.sizeOptions[0]);
    setItemCount(1);
  };

  // Handle size selection
  const handleSizeSelect = (sizeOption, index) => {
    setCurrentSizeOption(sizeOption);
    setCurrentSizeIndex(index);
    setItemCount(1);
  };

  // Handle add to cart
  const { addToCart, isLoading } = useCart();

  const handleAddToCart = async () => {
    // Check if enough stock is available
    if (!product || !authUser) {
      navigate("/customer/login");
      return;
    }

    if (currentSizeOption.quantity < itemCount) {
      alert("Not enough stock available!");
      return;
    }

    const cartItem = {
      product: product,
      quantity: itemCount,
      color: currentVariant.color,
      size: currentSizeOption.size,
      price: currentSizeOption.price,
      image: currentVariant.images[0], // First image of selected color
    };

    const result = await addToCart(cartItem);

    if (result.success) {
      // Show success message using DaisyUI toast
      document.getElementById("cart-toast").classList.remove("hidden");
      setTimeout(() => {
        document.getElementById("cart-toast").classList.add("hidden");
      }, 3000);
    } else {
      // Show error message
      alert(`Failed to add to cart: ${result.error || "Unknown error"}`);
    }
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (!authUser) {
      navigate("/customer/login");
      return;
    }

    navigate("/customer/checkout", {
      state: {
        product: product,
        quantity: itemCount,
        color: currentVariant.color,
        size: currentSizeOption.size,
        price: currentSizeOption.price,
        images: currentVariant.images,
      },
    });
  };

  // Handle item count changes
  const incrementCount = () => {
    if (itemCount < currentSizeOption.quantity) {
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
      setMainImage(images[mainImageIndex + 1]);
    }
  };

  const prevImage = () => {
    if (mainImageIndex > 0) {
      setMainImageIndex(mainImageIndex - 1);
      setMainImage(images[mainImageIndex - 1]);
    }
  };

  // Function to render stars based on rating - completely revised
  const renderStars = (rating) => {
    if (!rating) return [];

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={`full-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#B88E2F"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <svg
          key="half"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <defs>
            <linearGradient id="half-fill" x1="0" y1="0" x2="1" y2="0">
              <stop offset="50%" stopColor="#B88E2F" />
              <stop offset="50%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
            fill="url(#half-fill)"
          />
        </svg>
      );
    }

    // Add empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#B88E2F"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      );
    }

    return stars;
  };

  // Simple star renderer for small stars in distribution and color selection
  const renderSmallStar = (filled = false) => {
    return filled ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="#B88E2F"
        className="w-3 h-3"
      >
        <path
          fillRule="evenodd"
          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="#B88E2F"
        className="w-3 h-3"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </svg>
    );
  };

  // Calculate discount percentage
  const calculateDiscount = (original, current) => {
    if (original > current) {
      return Math.round(((original - current) / original) * 100);
    }
    return 0;
  };

  // If product is not available, show loading or error state
  if (!product) {
    return (
      <div className="bg-wineRed min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg text-mustard"></span>
          <p className="text-white text-xl ml-4">
            Loading product information...
          </p>
        </div>
      </div>
    );
  }

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="bg-[#F5F1E0] min-h-screen">
      <Navbar />

      {/* Toast Notification for Cart */}
      <div id="cart-toast" className="toast toast-top toast-end hidden z-50">
        <div className="alert alert-success">
          <div>
            <span>
              Added {itemCount} {currentVariant.color} {currentSizeOption.size}{" "}
              to cart!
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto pt-16 px-4 lg:px-0">
        {/* Product Overview Section */}
        <div className="breadcrumbs text-wineRed mb-4">
          <ul>
            <li>
              <a href="/customer/home">Home</a>
            </li>
            <li>
              <a href={`/customer/category/${product.category}`}>
                {product.category}
              </a>
            </li>
            <li>{product.name}</li>
          </ul>
        </div>

        <section className="card bg-white shadow-xl">
          <div className="card-body p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Image Gallery Section */}
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="carousel w-full rounded-box">
                    <div className="carousel-item w-full">
                      <img
                        src={mainImage}
                        alt={`${product.name} in ${currentVariant.color}`}
                        className="w-full h-96 object-contain rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Image navigation buttons */}
                  <button
                    onClick={prevImage}
                    disabled={mainImageIndex === 0}
                    className={`btn btn-circle btn-sm absolute left-2 top-1/2 transform -translate-y-1/2 bg-white ${
                      mainImageIndex === 0
                        ? "btn-disabled"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <ArrowLeft size={20} />
                  </button>

                  <button
                    onClick={nextImage}
                    disabled={mainImageIndex === images.length - 1}
                    className={`btn btn-circle btn-sm absolute right-2 top-1/2 transform -translate-y-1/2 bg-white ${
                      mainImageIndex === images.length - 1
                        ? "btn-disabled"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <ArrowRight size={20} />
                  </button>

                  {/* Add Wishlist Button in top-right corner */}
                  <button
                    onClick={handleWishlistToggle}
                    disabled={isWishlistLoading}
                    className={`btn btn-circle absolute top-2 right-2 shadow-md ${
                      inWishlist
                        ? "bg-red-50 text-red-500 hover:bg-red-100 border-red-200"
                        : "bg-white text-gray-500 hover:text-red-500 hover:bg-red-50"
                    } transition-all duration-300`}
                    aria-label={
                      inWishlist ? "Remove from wishlist" : "Add to wishlist"
                    }
                  >
                    <Heart
                      size={20}
                      className={inWishlist ? "fill-red-500" : ""}
                    />
                  </button>
                </div>

                {/* Thumbnail Gallery */}
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setMainImage(img);
                        setMainImageIndex(index);
                      }}
                      className={`cursor-pointer rounded-md ${
                        index === mainImageIndex
                          ? "ring-2 ring-wineRed"
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
                <h1 className="text-3xl font-bold text-wineRed">
                  {product.name}
                </h1>

                {/* Ratings */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    {renderStars(calculateAverageRating(product.review))}
                  </div>
                  <span className="badge badge-outline text-wineRed">
                    {calculateAverageRating(product.review)} (
                    {product.review.length} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mt-4 flex items-center">
                  <span className="text-3xl font-bold text-wineRed">
                    ₹{currentSizeOption.price}
                  </span>
                  {currentSizeOption.originalPrice !==
                    currentSizeOption.price && (
                    <span className="ml-3 text-lg text-wineRed line-through">
                      ₹{currentSizeOption.originalPrice}
                    </span>
                  )}
                  {currentSizeOption.originalPrice !==
                    currentSizeOption.price && (
                    <span className="ml-3 badge badge-success text-sm font-medium">
                      {calculateDiscount(
                        currentSizeOption.originalPrice,
                        currentSizeOption.price
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
                    className={`ml-2 badge ${
                      currentSizeOption.quantity > 0
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {currentSizeOption.quantity > 0
                      ? `In Stock (${currentSizeOption.quantity} available)`
                      : "Out of Stock"}
                  </span>
                </div>

                {/* Product Details */}
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-wineRed">
                    Product Details
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {currentVariant?.details?.map((detail, index) => (
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
                  <h3 className="text-base font-medium text-wineRed mb-2">
                    Color
                  </h3>
                  <div className="flex items-center space-x-4 mt-2">
                    {product.variants.map((variant, index) => (
                      <div
                        key={index}
                        onClick={() => handleVariantSelect(variant, index)}
                        className={`relative cursor-pointer transition-all duration-200 ${
                          index === currentVariantIndex
                            ? "transform scale-110"
                            : ""
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full cursor-pointer tooltip border-2 ${
                            index === currentVariantIndex
                              ? "border-wineRed shadow-lg"
                              : "border-gray-300"
                          }`}
                          style={{
                            backgroundColor: variant.color
                              .toLowerCase()
                              .replace(" ", ""),
                          }}
                          data-tip={variant.color}
                        />
                        {variant.sizeOptions.some(
                          (size) => size.quantity < 5 && size.quantity > 0
                        ) && (
                          <span className="badge badge-xs badge-warning absolute -top-1 -right-1 animate-pulse">
                            Low
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-wineRed mt-2 block">
                    Selected: {currentVariant.color}
                  </span>
                </div>

                {/* Size Selection */}
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-wineRed">Size</h3>
                    <button className="btn btn-link btn-xs text-blue-600 no-underline p-0">
                      Size Guide
                    </button>
                  </div>
                  <div className="join mt-2">
                    {currentVariant.sizeOptions.map((sizeOption, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSizeSelect(sizeOption, index)}
                        className={`join-item btn ${
                          index === currentSizeIndex
                            ? "btn-primary text-mustard bg-wineRed"
                            : "btn-outline text-wineRed"
                        } ${sizeOption.quantity === 0 ? "btn-disabled" : ""}`}
                        disabled={sizeOption.quantity === 0}
                      >
                        {sizeOption.size}
                        {sizeOption.quantity === 0 && (
                          <span className="text-xs">(Out)</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-wineRed">Quantity</h3>
                  <div className="join mt-2">
                    <button
                      type="button"
                      className="join-item btn btn-outline"
                      onClick={decrementCount}
                      disabled={itemCount <= 1}
                    >
                      -
                    </button>
                    <div className="join-item btn btn-outline pointer-events-none">
                      {itemCount}
                    </div>
                    <button
                      type="button"
                      className="join-item btn btn-outline"
                      onClick={incrementCount}
                      disabled={itemCount >= currentSizeOption.quantity}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex gap-4">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={currentSizeOption.quantity === 0 || isLoading}
                    className="btn btn-primary flex-1 bg-mustard text-wineRed border-mustard hover:bg-mustard/80"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isLoading ? "Adding..." : "Add to Cart"}
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={currentSizeOption.quantity === 0}
                    className="btn btn-primary flex-1 bg-mustard text-wineRed border-mustard hover:bg-mustard/80"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Shipping Information */}
                <div className="mt-6 alert bg-wineRed/20 text-wineRed">
                  <Truck className="h-5 w-5" />
                  <div>
                    <h4 className="font-bold">Free Shipping & Returns</h4>
                    <p className="text-xs">
                      Free standard shipping on orders over $50. Estimated
                      delivery: 3-5 business days.
                    </p>
                  </div>
                </div>

                {/* Wishlist & Share */}
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={handleWishlistToggle}
                    disabled={isWishlistLoading}
                    className={`btn btn-sm btn-outline flex-1 ${
                      inWishlist
                        ? "text-red-500 border-red-500"
                        : "text-wineRed"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${inWishlist ? "fill-red-500" : ""}`}
                    />
                    {isWishlistLoading
                      ? "Processing..."
                      : inWishlist
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"}
                  </button>
                  <button className="btn btn-sm btn-outline text-wineRed flex-1">
                    <Share2 className="h-5 w-5" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Color Options Section */}
        <section className="card bg-white shadow-xl mt-6">
          <div className="card-body p-6">
            <h2 className="card-title text-2xl text-wineRed mb-4">
              Available Colors
            </h2>
            <div className="flex gap-6 items-center overflow-x-auto pb-4">
              {product.variants.map((variant, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center cursor-pointer min-w-[120px] p-3 rounded-lg transition-all duration-300 ${
                    index === currentVariantIndex
                      ? "bg-mustard/25 ring-2 ring-mustard text-wineRed transform scale-105"
                      : "hover:bg-mustard/15 text-wineRed"
                  }`}
                  onClick={() => handleVariantSelect(variant, index)}
                >
                  <div className="relative">
                    <img
                      src={variant.images[0]}
                      alt={variant.color}
                      className="w-24 h-24 object-cover rounded-lg shadow-md"
                    />
                    <div
                      className="absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white"
                      style={{
                        backgroundColor: variant.color
                          .toLowerCase()
                          .replace(" ", ""),
                      }}
                    ></div>
                  </div>
                  <p className="mt-3 text-sm font-medium">{variant.color}</p>
                  <p
                    className={`text-xs mt-1 ${
                      variant.sizeOptions.reduce(
                        (total, size) => total + size.quantity,
                        0
                      ) > 0
                        ? "text-green-600 font-medium"
                        : "text-red-500 font-medium"
                    }`}
                  >
                    {variant.sizeOptions.reduce(
                      (total, size) => total + size.quantity,
                      0
                    ) > 0
                      ? `${variant.sizeOptions.reduce(
                          (total, size) => total + size.quantity,
                          0
                        )} in stock`
                      : "Out of stock"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Review Section */}
        <section className="card bg-white shadow-xl mt-6 mb-12">
          <div className="card-body p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="card-title text-2xl text-wineRed">
                Customer Reviews
              </h2>
              <button
                onClick={() => setOpen(true)}
                className="btn btn-primary bg-wineRed text-mustard border-wineRed hover:bg-mustard hover:text-wineRed transition-colors duration-300"
              >
                Write a Review
              </button>
            </div>

            {/* Review Summary */}
            <div className="flex flex-col md:flex-row gap-6 pb-6 border-b border-gray-200">
              <div className="stats shadow bg-gray-50">
                <div className="stat">
                  <div className="stat-title text-wineRed text-sm font-medium">
                    Overall Rating
                  </div>
                  <div className="stat-value text-3xl text-wineRed flex items-end gap-2">
                    {calculateAverageRating(product.review)}
                    <span className="text-lg text-wineRed/70">/ 5</span>
                  </div>
                  <div className="stat-desc flex mt-2">
                    <div className="flex items-center">
                      {renderStars(calculateAverageRating(product.review))}
                    </div>
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-title text-wineRed text-sm font-medium">
                    Reviews
                  </div>
                  <div className="stat-value text-3xl text-wineRed">
                    {product.review.length}
                  </div>
                  <div className="stat-desc text-wineRed/80 text-sm">
                    From verified buyers
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-2 p-3 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-wineRed mb-3">
                  Rating Distribution
                </h3>
                {[5, 4, 3, 2, 1].map((star) => {
                  const percentage =
                    product.review && product.review.length > 0
                      ? Math.round(
                          (product.review.filter(
                            (review) => Math.floor(review.rating) === star
                          ).length /
                            product.review.length) *
                            100
                        )
                      : 0;

                  return (
                    <div key={star} className="flex items-center">
                      <div className="w-16 text-sm font-medium text-wineRed flex items-center gap-1">
                        {star} {renderSmallStar(true)}
                      </div>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-[#B88E2F] h-2.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-wineRed w-12">
                        {percentage}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="mt-8 space-y-8">
              {product.review && product.review.length > 0 ? (
                product.review.map((review, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-6 last:border-0 hover:bg-gray-50/50 p-4 rounded-lg transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-wineRed">
                          {review.customerName}
                        </h3>
                        <div className="flex items-center mt-2">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="ml-3 text-sm text-wineRed/70">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-wineRed leading-relaxed">
                      {review.review}
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button className="btn btn-xs btn-outline text-wineRed hover:bg-wineRed hover:text-white transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          />
                        </svg>
                        Helpful
                      </button>
                      <button className="btn btn-xs btn-outline text-wineRed hover:bg-red-50 hover:text-red-500 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        Report
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto h-12 w-12 text-wineRed/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <p className="text-wineRed mt-4 font-medium">
                    No reviews yet. Be the first to review this product!
                  </p>
                  <button
                    onClick={() => setOpen(true)}
                    className="btn btn-sm btn-primary bg-wineRed text-mustard border-wineRed hover:bg-mustard hover:text-wineRed mt-4"
                  >
                    Write a Review
                  </button>
                </div>
              )}

              {product.review && product.review.length > 3 && (
                <div className="mt-8 text-center">
                  <button className="btn btn-outline border-wineRed text-wineRed hover:bg-wineRed hover:text-white">
                    Load more reviews
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Review Dialog */}
      <ReviewDialog
        open={open}
        setOpen={setOpen}
        productName={product.name}
        onSubmit={async (reviewData) => {
          try {
            // Add loading state or spinner here
            const response = await axios.post("/api/products/add-review", {
              productId: product._id,
              review: reviewData.review,
              rating: reviewData.rating,
              customerName: authUser ? authUser.username : "Anonymous",
            });

            // Show success message
            setOpen(false);
            // Optionally refresh the page or update the reviews list
            // You might want to add a toast notification for success
          } catch (error) {
            console.error("Error submitting review:", error);
            // Show error message to user
          }
        }}
      />
    </div>
  );
};

export default Product;
