import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  Home,
  SearchIcon,
  UserCircle,
  ShoppingBag,
  Info,
  Mail,
  Bell,
  Package,
  LogOut,
  LogIn,
  ShoppingCartIcon,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { useCart } from "../../zustand/useCart"; // Adjust the path according to your store location
import { useWishlist } from "../../zustand/useWishlist";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [login, setLogin] = useState(localStorage.getItem("authUser") || null);
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [cartCount, setCartCount] = useState(
    cartItems.reduce((sum, item) => sum + item.quantity, 0)
  );
  const [wishlistCount, setWishlistCount] = useState(wishlistItems.length);
  const [totalPrice, setTotalPrice] = useState(0);
  const {authUser}= useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Check if a navigation item is active
  const isActive = (path) => {
    return (
      location.pathname === path ||
      (path !== "/customer" && location.pathname.startsWith(path))
    );
  };

  // Function to get cart data from localStorage
  useEffect(() => {
    setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
  }, [cartItems]);
  useEffect(() => {
    setWishlistCount(wishlistItems.length);
  }, [wishlistItems]);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
    setLogin(null);
    navigate("/customer/login");
  };

  // Categories for dropdown
  const categories = [
    { name: "Men", path: "/customer/products?category=men" },
    { name: "New Arrivals", path: "/customer/products?category=new-arrivals" },
  ];

  return (
    <div
      className={`navbar justify-between fixed top-0 w-full z-30 transition-all duration-300 ${
        scrolled
          ? "py-2 shadow-md bg-mustard text-wineRed"
          : "py-4 bg-mustard backdrop-blur-sm text-wineRed"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="btn btn-ghost btn-circle"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
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
              className={`font-semibold ${
                isActive("/customer") && !isActive("/customer/products")
                  ? " font-bold"
                  : ""
              }`}
            >
              Home
            </Link>

            <a
              href="/customer/products"
              className={`font-semibold ${
                isActive("/customer/products") ? " font-bold" : ""
              }`}
            >
              Products
            </a>

            <a
              href="/customer#about"
              className={` font-semibold ${
                isActive("/customer/about") ? " font-bold" : ""
              }`}
            >
              About
            </a>
            <a
              href="/customer#contact"
              className={`font-semibold ${
                isActive("/customer/contact") ? " font-bold" : ""
              }`}
            >
              Contact
            </a>
          </div>
        </div>

       
  <div className={`lg:hidden fixed inset-0 ${isMobileMenuOpen?'translate-y-[72px]':'-translate-y-[700px]'} z-50 bg-gradient-to-b from-green-50 to-yellow-50 h-96 p-4 overflow-y-auto transition-all duration-200 ease-in-out shadow-lg`}>
    <div className="flex flex-col space-y-2 max-w-md mx-auto">
      <Link
        to="/customer"
        className="btn bg-green-600 hover:bg-green-700 text-white justify-start rounded-lg py-3 transition-all duration-200"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Home className="h-5 w-5 mr-2" /> Home
      </Link>

      {/* Mobile categories dropdown */}
      <div className="collapse z-50 collapse-arrow border-b border-yellow-200">
        <input type="checkbox" />
        <div className="collapse-title px-0 py-3 text-lg font-medium text-green-800 flex items-center">
          <ShoppingBag className="h-5 w-5 mr-2" /> Products
        </div>
        <div className="collapse-content px-0">
          <ul className="menu menu-sm pl-2 space-y-1">
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  to={category.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:bg-yellow-200 hover:text-green-800 rounded-md py-2 pl-4 transition-colors duration-200"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="/customer/products"
                className="font-medium text-green-700 hover:bg-yellow-200 rounded-md py-2 pl-4 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                View All Products
              </a>
            </li>
          </ul>
        </div>
      </div>

      <Link
        to="/customer#about"
        className="btn bg-yellow-400 hover:bg-yellow-500 text-green-800 justify-start rounded-lg py-3 transition-all duration-200"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Info className="h-5 w-5 mr-2" /> About
      </Link>
      <Link
        to="/customer#contact"
        className="btn bg-yellow-400 hover:bg-yellow-500 text-green-800 justify-start rounded-lg py-3 transition-all duration-200"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Mail className="h-5 w-5 mr-2" /> Contact
      </Link>

      {/* Mobile user actions */}
      {login && (
        <>
          <div className="divider my-4 before:bg-green-200 after:bg-green-200"></div>
          <Link
            to="/customer/profile"
            className="btn btn-outline border-green-600 text-green-700 hover:bg-green-100 justify-start rounded-lg py-3 transition-all duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <User className="h-5 w-5 mr-2" /> My Profile
          </Link>
          <Link
            to="/customer/orders"
            className="btn btn-outline border-green-600 text-green-700 hover:bg-green-100 justify-start rounded-lg py-3 transition-all duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Package className="h-5 w-5 mr-2" /> My Orders
          </Link>
          <Link
            to="/customer/wishlist"
            className="btn btn-outline border-green-600 text-green-700 hover:bg-green-100 justify-start rounded-lg py-3 transition-all duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Heart className="h-5 w-5 mr-2" /> Wishlist
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
            className="btn btn-outline border-green-600 text-green-700 hover:bg-green-100 justify-start rounded-lg py-3 transition-all duration-200"
          >
            <LogOut className="h-5 w-5 mr-2" /> Logout
          </button>
        </>
      )}

      {login === null && (
        <>
          <div className="divider my-4 before:bg-green-200 after:bg-green-200"></div>
          <Link
            to="/customer/login"
            className="btn bg-green-600 hover:bg-green-700 text-white btn-block mt-4 rounded-lg py-3 shadow-md hover:shadow-lg transition-all duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LogIn className="h-5 w-5 mr-2" /> Login / Sign Up
          </Link>
        </>
      )}
    </div>
    
  </div>

        {/* Search bar and user actions */}
        <div className="flex items-center gap-2">
          {/* Search button and dropdown */}
          {/* Wishlist */}
          {login && (
            <Link
              to="/customer/wishlist"
              className="btn btn-ghost btn-circle relative"
            >
              <Heart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-wineRed text-white text-xs">
                {wishlistCount}
              </span>
            </Link>
          )}
          {login && (
            <Link
              to="/customer/cart"
              className="btn btn-ghost btn-circle relative"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-wineRed text-white text-xs">
                {cartCount}
              </span>
            </Link>
          )}

          {/* User Account */}
          {login && (
  <div className="dropdown dropdown-end">
    <div
      tabIndex={0}
      role="button"
      className="btn btn-ghost btn-circle avatar transition-all duration-200 hover:scale-105"
    >
      <div className="w-10 rounded-full ring ring-[#1A3B2A] ring-offset-base-100 ring-offset-2 hover:ring-[#D6AF36]">
        <img
          alt="User avatar"
          src={authUser?.avatar}
        />
      </div>
    </div>
    <ul
      tabIndex={0}
      className="menu menu-sm dropdown-content bg-gradient-to-b from-[#1A3B2A] to-[#2a4d3a] text-[#D6AF36] rounded-xl z-30 mt-3 w-64 p-4 shadow-xl overflow-hidden"
    >
      <li className="mb-3">
        <div className="flex flex-col hover:bg-transparent cursor-default px-2">
          <span className="font-bold text-[#D6AF36] text-lg">{authUser.name}</span>
          <span className="text-xs text-[#D6AF36]/80">
            {authUser.email}
          </span>
        </div>
      </li>
      <div className="divider my-1 before:bg-[#D6AF36]/20 after:bg-[#D6AF36]/20"></div>
      
      <li>
        <Link 
          to="/customer/profile" 
          className="flex gap-2 hover:bg-[#D6AF36]/10 rounded-lg transition-colors duration-200 mb-1"
        >
          <User className="h-4 w-4" />
          Profile
          <span className="badge bg-[#D6AF36] text-[#1A3B2A] border-none badge-sm ml-auto font-medium">
            New
          </span>
        </Link>
      </li>
      <li>
        <Link 
          to="/customer/orders" 
          className="flex gap-2 hover:bg-[#D6AF36]/10 rounded-lg transition-colors duration-200 mb-1"
        >
          <Package className="h-4 w-4" />
          My Orders
        </Link>
      </li>
      <li>
        <Link 
          to="/customer/wishlist" 
          className="flex gap-2 hover:bg-[#D6AF36]/10 rounded-lg transition-colors duration-200 mb-1"
        >
          <Heart className="h-4 w-4" />
          Wishlist
        </Link>
      </li>
      <li>
        <Link 
          to="/customer/notifications" 
          className="flex gap-2 hover:bg-[#D6AF36]/10 rounded-lg transition-colors duration-200 mb-1"
        >
          <Bell className="h-4 w-4" />
          Notifications
          <span className="badge bg-[#D6AF36] text-[#1A3B2A] border-none badge-sm ml-auto font-medium">5</span>
        </Link>
      </li>
      
      <div className="divider my-1 before:bg-[#D6AF36]/20 after:bg-[#D6AF36]/20"></div>
      
      <li>
        <button
          onClick={handleLogout}
          className="flex gap-2 text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-lg transition-colors duration-200"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </li>
      
      <div className="mt-3 pt-2 border-t border-[#D6AF36]/20">
        <div className="flex justify-between items-center px-2">
          <span className="text-xs text-[#D6AF36]/60">Last login: Today, 14:30</span>
          <Link to="/customer/settings" className="text-xs text-[#D6AF36] hover:underline">Settings</Link>
        </div>
      </div>
    </ul>
  </div>
)}

          {/* Login Button */}
          {login === null && (
            <Link
              to="/customer/login"
              className="btn btn-wineRed btn-sm md:btn-md rounded-full"
            >
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
