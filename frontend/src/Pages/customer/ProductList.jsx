import React, { useState } from "react";
import Navbar from "../../Components/customer/Navbar";
import Footer from "../../Components/customer/Footer";
import { useProduct } from "../../zustand/useProducts";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate=useNavigate()
  
  const {products}= useProduct();

  const categories = ["All", "Men", "Boys", "Leisure wear"];

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(
        cartItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

 

  
  
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

 
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-wineRed text-white py-28">
        <div className="container mx-auto px-4 text-mustard">
          <h1 className="text-4xl font-bold mb-4">IZOLE</h1>
          <p className="text-xl mb-6">Discover the latest trends in fashion with our new arrivals</p>
          <button className="btn bg-mustard text-wineRed">Shop Now</button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="form-control w-full md:w-64">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="input input-bordered w-full" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2">
            {categories.map((category) => (
              <button 
                key={category}
                className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline'}`}
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
            <div key={product._id} className="card  bg-wineRed shadow-xl hover:shadow-2xl transition-shadow duration-300"
              onClick={()=>{
                console.log("Hello")
                navigate(`/customer/product/${product._id}`, { state: { product } });
              }}
            >
              <figure className="relative h-64 bg-gray-100">
                <img src={product.images[0].image[0]} alt={product.name} className="object-contain w-full h-full" />
                {!product.images[0].quantity>0 && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 m-2 rounded-md">
                    Out of Stock
                  </div>
                )}
                <div className="badge badge-secondary absolute bottom-2 right-2">
                  {product.category}
                </div>
              </figure>
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title text-lg">{product.name}</h2>
                  <div className="badge badge-outline">₹{product.images[0].price.toFixed(2)}</div>
                </div>
                <div className="flex items-center mb-4">
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input 
                        key={i}
                        type="radio" 
                        name={`rating-${product._id}`} 
                        className="mask mask-star-2 bg-orange-400" 
                        checked={Math.round(product?.review?.rating) === i + 1}
                        readOnly
                      />
                    ))}
                  </div>
                  <span className="text-sm text-mustard ml-2">{product.rating}</span>
                </div>
                <div className="card-actions">
                  <button 
                    className="btn bg-mustard text-wineRed btn-block" 
                    disabled={!product.images[0].quantity>0}
                    onClick={() => handleAddToCart(product)}
                  >
                    {product.images[0].quantity>0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-gray-500">No products found</h3>
            <p className="mt-2">Try changing your search or filter options</p>
          </div>
        )}
      </div>
      
      {/* Newsletter Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="mb-6">Subscribe to receive updates on new arrivals and special promotions</p>
          <div className="form-control max-w-md mx-auto">
            <div className="input-group">
              <input type="email" placeholder="Your email address" className="input input-bordered w-full" />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
      
        <Footer/>
    </div>
  );
};

export default ProductList;