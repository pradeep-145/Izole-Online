import React from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminLogin from "./Pages/Admin/AdminLogin";
import CustomerLogin from "./Pages/customer/CustomerLogin";
import CustomerSignUp from "./Pages/customer/CustomerSignUp";
import LandingPage from "./Pages/customer/LandingPage";
import OtpVerification from "./Pages/customer/OtpVerification";
import ProductList from "./Pages/customer/ProductList";
import CustomerLayout from "./Pages/customer/CustomerLayout";
import AdminLayout from "./Pages/Admin/AdminLayout";
import Product from "./Pages/customer/Product";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminProductForm from "./Pages/Admin/ProductForm";
import CartPage from "./Pages/customer/CartPage";
import Checkout from "./Pages/customer/Checkout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to={'/customer'}/>} />

        {/* Customer Routes */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<LandingPage />} /> 
          <Route path="sign-up" element={<CustomerSignUp />} />
          <Route path="login" element={<CustomerLogin />} />
          <Route path="otp-verification" element={<OtpVerification />} />
          <Route path="products" element={<ProductList />} />
          <Route path="product" element={<Product />} />
          <Route path='cart' element={<CartPage/>}/>
          <Route path='checkout' element={<Checkout/>}/>
          
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} /> 
          <Route path="login" element={<AdminLogin />} />
          <Route path="product-input" element={<AdminProductForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
