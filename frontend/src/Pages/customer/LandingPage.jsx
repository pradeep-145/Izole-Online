import React, { useEffect } from "react";
import ProductPreview from "../../Components/customer/ProductPreview";
import About from "../../Components/customer/About";
import Contact from "../../Components/customer/Contact";
import Footer from "../../Components/customer/Footer";
import Home from "../../Components/customer/Home";
import Navbar from "../../Components/customer/Navbar";
import { useLocation } from "react-router-dom";


const LandingPage = () => {
  const location = useLocation()

  useEffect(()=>{
    if(location.hash){
      const element= document.querySelector(location.hash);
      if(element){
        element.scrollIntoView()
      }
    }
  })
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
