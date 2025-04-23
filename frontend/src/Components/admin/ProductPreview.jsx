import React, { useEffect, useState } from "react";
import { ShoppingBag, Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { useProduct } from "../../zustand/useProducts"; // adjust path if needed

const ProductPreview = () => {
  const { products, fetchProductsIfEmpty } = useProduct();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    fetchProductsIfEmpty(); // fetch data on mount
  }, [fetchProductsIfEmpty]);

  useEffect(() => {
    let interval;
    if (autoplay && products.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [autoplay, products.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  };

  return (
    <div id="products" className="bg-yellow-50 text-wineRed py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold font-serif mb-4">Featured Products</h2>
        </div>

        {products.length > 0 ? (
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Image Slider */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative max-w-md mx-auto rounded-xl shadow-lg overflow-hidden">
                <div className="relative aspect-square">
                  {products.map((product, index) => {
                    const previewImage = product.images[0]?.image[0]; // first image from first color variant
                    return (
                      <div
                        key={product._id}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          currentIndex === index ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                      >
                        <img
                          src={previewImage}
                          alt={product.name}
                          className="w-full h-auto object-contain rounded-md"
                        />
                        {/* Optional badge */}
                        <span className="absolute top-4 left-4 bg-mustard text-wineRed px-3 py-1 rounded-full text-sm font-bold">
                          {product.category}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-center mt-6 gap-6 items-center">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full text-mustard bg-wineRed hover:bg-opacity-80 transition"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="flex gap-2">
                  {products.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition ${
                        currentIndex === index ? "bg-mustard" : "bg-gray-500"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full text-mustard bg-wineRed hover:bg-opacity-80 transition"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Info Section */}
            <div className="w-full lg:w-1/2 space-y-6">
              <h3 className="text-3xl font-bold">Why Choose Us?</h3>
              <ul className="space-y-4">
                {[
                  "Premium quality materials",
                  "Designed for everyday wear",
                  "Timeless styles",
                  "Attention to detail",
                ].map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-lg">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <a href="/customer/products" className="btn bg-mustard text-wineRed px-6 py-2 rounded-lg">
                  Browse All Products
                </a>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-lg mt-10">Loading featured products...</p>
        )}
      </div>
    </div>
  );
};

export default ProductPreview;
