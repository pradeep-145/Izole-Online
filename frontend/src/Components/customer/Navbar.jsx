import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, User, Search, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState(localStorage.getItem("token") || null);
  const [cartCount, setCartCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

    return () => {
      window.removeEventListener('cartUpdated', getCartData);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogin(null);
    navigate('/customer/login');
  };

  return (
    <div className="navbar shadow-md justify-between bg-base-100 p-4 fixed top-0 w-full z-30">
      {/* Mobile menu button */}
      <div className="lg:hidden flex items-center">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="btn btn-ghost btn-circle"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Logo and Nav Links */}
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-extrabold font-serif mr-4">IZOLE</Link>
        
        {/* Desktop navigation */}
        <div className="hidden lg:flex space-x-1">
          <Link to="/customer" className="btn btn-ghost">Home</Link>
          <Link to="/customer/products" className="btn btn-ghost">Products</Link>
          <Link to="/customer#about" className="btn btn-ghost">About</Link>
          <Link to="/customer#contact" className="btn btn-ghost">Contact</Link>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-20 bg-base-100 p-4">
          <div className="flex flex-col space-y-2">
            <Link to="/customer" className="btn btn-ghost justify-start" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/customer/products" className="btn btn-ghost justify-start" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
            <Link to="/customer#about" className="btn btn-ghost justify-start" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/customer#contact" className="btn btn-ghost justify-start" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          </div>
        </div>
      )}

      {/* Search bar and user actions */}
      <div className="flex items-center gap-2">
        {/* Search button and dropdown */}
        <div className="dropdown dropdown-end">
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="btn btn-ghost btn-circle">
            <Search className="h-5 w-5" />
          </button>
          
          {isSearchOpen && (
            <div className="dropdown-content bg-base-100 rounded-box mt-3 p-2 shadow w-72 absolute right-0">
              <div className="join w-full">
                <input type="text" placeholder="Search products..." className="input input-bordered join-item flex-grow" />
                <button className="btn join-item btn-primary">Search</button>
              </div>
            </div>
          )}
        </div>

        {/* Wishlist */}
        {login === "customer" && (
          <Link to="/customer/wishlist" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <Heart className="h-5 w-5" />
              <span className="badge badge-sm badge-primary indicator-item">3</span>
            </div>
          </Link>
        )}
        
        {/* Shopping Cart */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="badge badge-sm badge-primary indicator-item">{cartCount}</span>
              )}
            </div>
          </div>
          
          <div tabIndex={0} className="card card-compact dropdown-content bg-base-100 z-10 mt-3 w-72 shadow">
            <div className="card-body">
              <span className="text-lg font-bold">{cartCount} Items</span>
              <span className="text-info">Subtotal: ${totalPrice.toFixed(2)}</span>
              <div className="card-actions">
                <Link to="/customer/cart" className="btn btn-primary btn-block">View cart</Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* User Account */}
        {login && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
              <li>
                <Link to="/customer/profile" className="justify-between">
                  Profile
                  <span className="badge badge-primary badge-sm">New</span>
                </Link>
              </li>
              <li><Link to="/customer/orders">My Orders</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        )}
        
        {/* Login Button */}
        {login === null && (
          <Link to="/customer/login" className="btn btn-primary rounded-full">
            Login/SignUp
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;