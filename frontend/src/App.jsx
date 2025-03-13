import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminDashboard from "./Pages/Admin/Admin.dashboard";
import AdminLogin from "./Pages/Admin/AdminLogin";
import CustomerLogin from "./Pages/customer/CustomerLogin";
import CustomerSignUp from "./Pages/customer/CustomerSignUp";
import LandingPage from "./Pages/customer/LandingPage";
import OtpVerification from "./Pages/customer/otpVerification";
import ProductList from "./Pages/customer/ProductList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/customerSignup" element={<CustomerSignUp />} />
        <Route path="/customerLogin" element={<CustomerLogin />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/otpVerification" element={<OtpVerification />} />
        <Route path="/admin" element={<AdminDashboard />}></Route>
        <Route path="/productList" element={<ProductList />} />
      </Routes>
    </Router>
  );
}

export default App;
