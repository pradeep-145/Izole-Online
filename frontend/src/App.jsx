import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminLayout from "./Pages/Admin/AdminLayout";
import AdminLogin from "./Pages/Admin/AdminLogin";
import ProductEdit from "./Pages/Admin/ProductEdit";
import ProductView from "./Pages/Admin/ProductView";
import Cart from "./Pages/customer/cart";
import Checkout from "./Pages/customer/Checkout";
import CustomerLayout from "./Pages/customer/CustomerLayout";
import CustomerLogin from "./Pages/customer/CustomerLogin";
import CustomerSignUp from "./Pages/customer/CustomerSignUp";
import LandingPage from "./Pages/customer/LandingPage";
import OrderConfirmation from "./Pages/customer/OrderConfirmation";
import OrderHistoryPage from "./Pages/customer/OrderHistoryPage";
import OtpVerification from "./Pages/customer/otpVerification";
import Product from "./Pages/customer/Product";
import ProductList from "./Pages/customer/ProductList";
import ShippingStatus from "./Pages/customer/ShippingStatus";
import Wishlist from "./Pages/customer/Wishlist";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to={"/customer"} />} />

        {/* Customer Routes */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="sign-up" element={<CustomerSignUp />} />
          <Route path="login" element={<CustomerLogin />} />
          <Route path="otp-verification" element={<OtpVerification />} />
          <Route path="products" element={<ProductList />} />
          <Route path="product/:id" element={<Product />} />

          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="shipping-status" element={<ShippingStatus />} />
          <Route path="orders" element={<OrderHistoryPage />} />
          <Route
            path="order-confirmation/:orderId"
            element={<OrderConfirmation />}
          />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="login" element={<AdminLogin />} />
          <Route
            path="products/view/:productId/:variantIndex"
            element={<ProductView />}
          />
          <Route
            path="products/edit/:productId/:variantIndex"
            element={<ProductEdit />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
