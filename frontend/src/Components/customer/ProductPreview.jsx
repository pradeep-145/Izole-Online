import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import {
  ShoppingBag,
  Heart,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../../zustand/useProducts.jsx"; // adjust path if needed

// Import the required CSS for react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductCarousel = () => {
  const { products, fetchProductsIfEmpty } = useProduct();
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductsIfEmpty(); // fetch data on mount
  }, [fetchProductsIfEmpty]);

  // Custom arrow components
  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-wineRed p-2 rounded-full text-mustard hover:bg-opacity-80 transition"
        aria-label="Next"
      >
        <ArrowRight className="h-5 w-5" />
      </button>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-wineRed p-2 rounded-full text-mustard hover:bg-opacity-80 transition"
        aria-label="Previous"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
    );
  };

  // Slick settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
        },
      },
    ],
    customPaging: (i) => (
      <div
        className={`w-3 h-3 mx-1 rounded-full transition ${i === currentSlide ? "bg-mustard" : "bg-gray-400"
          }`}
      />
    ),
    dotsClass: "slick-dots custom-dots flex justify-center mt-6 gap-2",
  };

  const handleProductClick = (productId) => {
    navigate(`/customer/product/${productId}`);
  };

  return (
    <div id="products" className="bg-yellow-50 text-wineRed py-16 my-16">
      <div className="container mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-serif mb-4">
            Featured Products
          </h2>
          <p className="text-lg max-w-2xl mx-auto">
            Discover our handpicked selection of premium products designed for
            style and comfort
          </p>
        </div>

        {products && products.length > 0 ? (
          <div className="relative px-10">
            <Slider {...settings}>
              {products.map((product) => {
                // Safely access first variant's first image
                const previewImage =
                  product.variants &&
                    product.variants.length > 0 &&
                    product.variants[0].images &&
                    product.variants[0].images.length > 0
                    ? product.variants[0].images[0]
                    : "https://placehold.co/400x400?text=No+Image";

                // Calculate price display
                const price =
                  product.price ||
                  (product.variants && product.variants[0]?.price) ||
                  "0.00";
                const formattedPrice =
                  typeof price === "number" ? price.toFixed(2) : price;

                const productId = product._id?.$oid || product._id;

                return (
                  <div key={productId} className="px-2 py-2">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg group relative">
                      {/* Badge */}
                      {product.category && (
                        <span className="absolute top-3 left-3 bg-mustard text-wineRed px-3 py-1 rounded-full text-sm font-bold z-10">
                          {product.category}
                        </span>
                      )}

                      {/* Image container */}
                      <div
                        className="relative overflow-hidden h-60 bg-white cursor-pointer flex justify-center items-center"
                        onClick={() => handleProductClick(productId)}
                      >
                        <img
                          src={previewImage}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>


                      {/* Product details */}
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1 truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {product.description || "No description available"}
                        </p>
                        <div className="flex justify-end items-center mt-3">
                          {/* <span className="font-bold text-xl">
                            ${formattedPrice}
                          </span> */}
                          <button
                            onClick={() => handleProductClick(productId)}
                            className="text-sm text-wineRed hover:text-mustard flex items-center gap-1"
                          >
                            View Details
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg">Loading featured products...</p>
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/customer/products")}
            className="btn bg-wineRed text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition font-medium"
          >
            Browse All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
