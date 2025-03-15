import React, { useState } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const products = [
    {
      id: 1,
      img: "/api/placeholder/300/250",
      title: "Casual T-Shirt",
      desc: "Premium quality cotton t-shirt for a stylish and comfortable look.",
      price: 24.99,
      category: "Men",
      rating: 4.5,
      inStock: true,
    },
    {
      id: 2,
      img: "/api/placeholder/300/250",
      title: "Classic Black Shirt",
      desc: "Elegant black shirt designed for all occasions.",
      price: 34.99,
      category: "Men",
      rating: 4.8,
      inStock: true,
    },
    {
      id: 3,
      img: "/api/placeholder/300/250",
      title: "Olive Green Jacket",
      desc: "A perfect blend of warmth and style with this olive green jacket.",
      price: 59.99,
      category: "Men",
      rating: 4.2,
      inStock: false,
    },
    {
      id: 4,
      img: "/api/placeholder/300/250",
      title: "Trendy Joggers",
      desc: "Comfortable and stylish joggers for your active lifestyle.",
      price: 29.99,
      category: "Leisure wear",
      rating: 4.0,
      inStock: true,
    },
    {
      id: 5,
      img: "/api/placeholder/300/250",
      title: "Athleisure Pants",
      desc: "Soft and flexible athleisure pants for everyday wear.",
      price: 32.99,
      category: "Leisure wear",
      rating: 4.3,
      inStock: true,
    },
    {
      id: 6,
      img: "/api/placeholder/300/250",
      title: "Slim Fit Jeans",
      desc: "Classic slim-fit jeans with a modern touch.",
      price: 39.99,
      category: "Men",
      rating: 4.7,
      inStock: true,
    },
    {
      id: 7,
      img: "/api/placeholder/300/250",
      title: "Blue Denim Jacket",
      desc: "Iconic blue denim jacket for a timeless look.",
      price: 49.99,
      category: "Boys",
      rating: 4.4,
      inStock: true,
    },
  ];

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

  const handleRemoveFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const handleQuantityChange = (productId, change) => {
    setCartItems(
      cartItems.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };
  
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Spring Collection 2025</h1>
          <p className="text-xl mb-6">Discover the latest trends in fashion with our new arrivals</p>
          <button className="btn btn-outline btn-accent">Shop Now</button>
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
          
          <button 
            className="btn btn-secondary gap-2 relative"
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Cart
            {cartItems.length > 0 && (
              <div className="badge badge-accent absolute -top-2 -right-2">
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </div>
            )}
          </button>
        </div>
        
        {/* Shopping Cart Dropdown */}
        {isCartOpen && (
          <div className="card shadow-xl bg-base-100 mb-8">
            <div className="card-body">
              <h2 className="card-title">Your Cart</h2>
              {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={item.id}>
                            <td className="flex items-center gap-2">
                              <div className="avatar">
                                <div className="w-12 h-12 rounded">
                                  <img src={item.img} alt={item.title} />
                                </div>
                              </div>
                              <span>{item.title}</span>
                            </td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>
                              <div className="flex items-center gap-2">
                                <button 
                                  className="btn btn-xs btn-circle"
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </button>
                                {item.quantity}
                                <button 
                                  className="btn btn-xs btn-circle"
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                            <td>
                              <button 
                                className="btn btn-error btn-xs"
                                onClick={() => handleRemoveFromCart(item.id)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold">Total: ${getTotalPrice()}</span>
                    <button className="btn btn-primary">Checkout</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="relative h-64 bg-gray-100">
                <img src={product.img} alt={product.title} className="object-cover w-full h-full" />
                {!product.inStock && (
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
                  <h2 className="card-title text-lg">{product.title}</h2>
                  <div className="badge badge-outline">${product.price.toFixed(2)}</div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{product.desc}</p>
                <div className="flex items-center mb-4">
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input 
                        key={i}
                        type="radio" 
                        name={`rating-${product.id}`} 
                        className="mask mask-star-2 bg-orange-400" 
                        checked={Math.round(product.rating) === i + 1}
                        readOnly
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">{product.rating}</span>
                </div>
                <div className="card-actions">
                  <button 
                    className="btn btn-primary btn-block" 
                    disabled={!product.inStock}
                    onClick={() => handleAddToCart(product)}
                  >
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
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