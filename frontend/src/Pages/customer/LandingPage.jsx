import React from "react";
import ProductPreview from "../../Components/admin/ProductPreview";
import About from "../../Components/customer/About";
import Contact from "../../Components/customer/Contact";
import Footer from "../../Components/customer/Footer";
import Home from "../../Components/customer/Home";
import Navbar from "../../Components/customer/Navbar";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <Home />
      <ProductPreview />
      <About />
      <Contact />
      <Footer />
    </>
  );
};

export default LandingPage;
