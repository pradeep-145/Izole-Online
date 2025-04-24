import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../Components/customer/Footer";
import Navbar from "../../Components/customer/Navbar";
import ProductCard from "../../Components/customer/ProductCard";
import { useProduct } from "../../zustand/useProducts";

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { products } = useProduct();

  const categories = ["All", "Men", "Boys", "Leisure wear"];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-yellow-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-wineRed text-white py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 text-mustard">
          <h1 className="text-4xl font-bold mb-4 mt-4">IZOLE</h1>
          <p className="text-xl mb-2">
            Discover the latest trends in fashion with our new arrivals
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row justify-end items-center mb-8 gap-4">
          <div className="form-control w-full md:w-64">
            <input
              type="text"
              placeholder="Search products..."
              className="input input-bordered w-full bg-white border-2 border-wineRed text-wineRed focus:outline-none focus:ring-2 focus:ring-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 items-center">
            <p className="text-wineRed text-lg font-bold">
              Filter by Category:
            </p>
            {categories.map((category) => (
              <button
                key={category}
                className={`btn ${
                  selectedCategory === category
                    ? "bg-wineRed text-mustard"
                    : "bg-mustard text-wineRed"
                }  hover:bg-wineRed hover:text-mustard transition-colors duration-300`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-gray-500">
              No products found
            </h3>
            <p className="mt-2">Try changing your search or filter options</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductList;
