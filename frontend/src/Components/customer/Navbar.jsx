import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, User, Search, Menu, X, ChevronDown, Bell, Package, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.jpg';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [login, setLogin] = useState(localStorage.getItem("token") || null);
  const [cartCount, setCartCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Check if a navigation item is active
  const isActive = (path) => {
    return location.pathname === path || (path !== '/customer' && location.pathname.startsWith(path));
  };

  // Function to get cart data from localStorage
  useEffect(() => {
    const getCartData = () => {
      try {
        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
        setTotalPrice(cartItems.reduce((total, item) => total + (item.price * item.quantity), 0));
      } catch (error) {
        console.error("Error loading cart data:", error);
        setCartCount(0);
        setTotalPrice(0);
      }
    };

    // Initial load
    getCartData();

    // Set up event listener for cart updates
    window.addEventListener('cartUpdated', getCartData);

    // Scroll effect handler
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('cartUpdated', getCartData);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogin(null);
    navigate('/customer/login');
  };

  // Categories for dropdown
  const categories = [
    { name: "Men", path: "/customer/products?category=men" },
    { name: "New Arrivals", path: "/customer/products?category=new-arrivals" }
  ];

  return (
    <div className={`navbar justify-between fixed top-0 w-full z-30 transition-all duration-300 ${scrolled ? 'py-2 shadow-md bg-mustard text-wineRed' : 'py-4 bg-mustard backdrop-blur-sm text-wineRed'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="btn btn-ghost btn-circle"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Logo and Nav Links */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="IZOLE" className="h-8 w-8 rounded-full mr-2" />
            <span className="text-2xl font-extrabold font-serif">IZOLE</span>
          </Link>
          
          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center ml-12 space-x-10">
            <Link 
              to="/customer" 
              className={`font-semibold ${isActive('/customer') && !isActive('/customer/products') ? ' font-bold' : ''}`}
            >
              Home
            </Link>
            
            <a href  
              ="/customer/products" 
              className={`font-semibold ${isActive('/customer/products') ? ' font-bold' : ''}`}
            >
              Products
            </a>

            <a href  
              ="/customer#about" 
              className={` font-semibold ${isActive('/customer/about') ? ' font-bold' : ''}`}
            >
              About
            </a>
            <a href  
              ="/customer#contact" 
              className={`font-semibold ${isActive('/customer/contact') ? ' font-bold' : ''}`}
            >
              Contact
            </a>
            </div>
          </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 z-20 bg-base-100 p-4 overflow-y-auto">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/customer" 
                className="btn btn-ghost justify-start" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              {/* Mobile categories dropdown */}
              <div className="collapse collapse-arrow border-b border-base-300">
                <input type="checkbox" /> 
                <div className="collapse-title px-0 py-2 text-lg font-medium">
                  Products
                </div>
                <div className="collapse-content px-0">
                  <ul className="menu menu-sm">
                    {categories.map((category) => (
                      <li key={category.name}>
                        <Link 
                          to={category.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <a href 
                        ="/customer/products" 
                        className="font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        View All Products
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              
              <a href  
                to="/customer#about" 
                className="btn btn-ghost justify-start" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </a>
              <a href  
                to="/customer#contact" 
                className="btn btn-ghost justify-start" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
              
              {/* Mobile user actions */}
              {login && (
                <>
                  <div className="divider my-2"></div>
                  <Link 
                    to="/customer/profile" 
                    className="btn btn-ghost justify-start" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-2" /> My Profile
                  </Link>
                  <Link 
                    to="/customer/orders" 
                    className="btn btn-ghost justify-start" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Package className="h-5 w-5 mr-2" /> My Orders
                  </Link>
                  <Link 
                    to="/customer/wishlist" 
                    className="btn btn-ghost justify-start" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Heart className="h-5 w-5 mr-2" /> Wishlist
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }} 
                    className="btn btn-ghost justify-start"
                  >
                    <LogOut className="h-5 w-5 mr-2" /> Logout
                  </button>
                </>
              )}
              
              {login === null && (
                <>
                  <div className="divider my-2"></div>
                  <Link 
                    to="/customer/login" 
                    className="btn btn-primary btn-block mt-4" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login / Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {/* Search bar and user actions */}
        <div className="flex items-center gap-2">
          {/* Search button and dropdown */}
          <div className="dropdown dropdown-end">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              className="btn btn-ghost btn-circle"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {isSearchOpen && (
              <div className="dropdown-content bg-base-100 rounded-box mt-3 p-2 shadow w-72 md:w-96 absolute right-0">
                <div className="join w-full">
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="input input-bordered join-item flex-grow"
                    autoFocus
                  />
                  <button className="btn join-item btn-primary">
                    <Search className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 text-xs text-base-content/60">
                  Popular: T-Shirts, Dresses, Jeans
                </div>
              </div>
            )}
          </div>

          {/* Wishlist */}
          {login === "customer" && (
            <Link to="/customer/wishlist" className="btn btn-ghost btn-circle relative">
              <Heart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-wineRed text-white text-xs">3</span>
            </Link>
          )}
          
          {/* Shopping Cart */}
          <div className="dropdown dropdown-end">
            <div 
              tabIndex={0} 
              role="button" 
              className="btn btn-ghost btn-circle relative"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-wineRed text-white text-xs">
                  {cartCount}
                </span>
              )}
            </div>
            
            <div tabIndex={0} className="card dropdown-content bg-base-100 z-30 mt-3 w-80 shadow-lg rounded-box">
              <div className="card-body p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Your Cart</h3>
                  <span className="badge badge-primary">{cartCount} items</span>
                </div>
                
                {cartCount > 0 ? (
                  <>
                    <div className="max-h-60 overflow-y-auto space-y-3">
                      {/* This would be populated with actual cart items */}
                      <div className="flex gap-3 border-b pb-3">
                        <div className="w-16 h-16 bg-base-200 rounded-md overflow-hidden">
                          <img src="/api/placeholder/100/100" alt="Product" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">Premium Cotton Tee</h4>
                          <p className="text-xs text-base-content/70">Size: M | Color: Blue</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-primary font-bold">$29.99</span>
                            <span className="text-sm">Qty: 1</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Sample repeated item - in production this would be mapped from real cart data */}
                      <div className="flex gap-3 border-b pb-3">
                        <div className="w-16 h-16 bg-base-200 rounded-md overflow-hidden">
                          <img src="/api/placeholder/100/100" alt="Product" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">Classic Hoodie</h4>
                          <p className="text-xs text-base-content/70">Size: L | Color: Black</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-primary font-bold">$45.99</span>
                            <span className="text-sm">Qty: 1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-3 mt-2">
                      <div className="flex justify-between mb-3">
                        <span className="font-medium">Subtotal:</span>
                        <span className="font-bold">${totalPrice.toFixed(2)}</span>
                      </div>
                      <Link to="/customer/cart" className="btn btn-primary btn-block">
                        View Cart
                      </Link>
                      <Link to="/customer/checkout" className="btn btn-outline btn-block mt-2">
                        Checkout
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-base-content/30 mx-auto mb-3" />
                    <p className="text-base-content/70">Your cart is empty</p>
                    <button className="btn btn-primary mt-4" onClick={() => navigate('/customer/products')}>
                      Shop Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* User Account */}
          {login && (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    alt="User avatar"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-30 mt-3 w-60 p-3 shadow-lg">
                <li className="mb-2">
                  <div className="flex flex-col hover:bg-transparent cursor-default">
                    <span className="font-bold">Sarah Johnson</span>
                    <span className="text-xs text-base-content/70">sarah.j@example.com</span>
                  </div>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <Link to="/customer/profile" className="flex gap-2">
                    <User className="h-4 w-4" />
                    Profile
                    <span className="badge badge-primary badge-sm ml-auto">New</span>
                  </Link>
                </li>
                <li>
                  <Link to="/customer/orders" className="flex gap-2">
                    <Package className="h-4 w-4" />
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link to="/customer/wishlist" className="flex gap-2">
                    <Heart className="h-4 w-4" />
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link to="/customer/notifications" className="flex gap-2">
                    <Bell className="h-4 w-4" />
                    Notifications
                    <span className="badge badge-sm ml-auto">5</span>
                  </Link>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button onClick={handleLogout} className="flex gap-2 text-error">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
          
          {/* Login Button */}
          {login === null && (
            <Link to="/customer/login" className="btn btn-wineRed btn-sm md:btn-md rounded-full">
              Login/SignUp
            </Link>
          )}
        </div>
      </div>
      
      {/* Sale announcement banner - can be conditionally shown
      {scrolled && (
        <div className="bg-wineRed text-white py-1 text-center text-xs">
          <div className="container mx-auto">
            Spring Sale! Use code <span className="font-bold">SPRING25</span> for 25% off storewide
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Navbar;