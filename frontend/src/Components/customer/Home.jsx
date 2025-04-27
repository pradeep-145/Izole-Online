import React from "react";
import { ArrowRight, TrendingUp, Shield, Star } from "lucide-react";
import logo from "../../assets/logo.jpg";
import image from "../../assets/image.png";

const Home = () => {
  return (
    <div id="home">
      {/* Hero Section */}
      <div className="relative min-h-screen md:py-20 overflow-hidden bg-yellow-50 text-wineRed">
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row-reverse lg:gap-16 items-center justify-between">
            {/* Image Section */}
            <div className="relative w-full max-w-sm lg:max-w-md mx-auto lg:mx-0 mb-12 lg:mb-0 ">
              <div className="relative overflow-hidden rounded-2xl">
                <img src={image} className="w-full h-auto object-cover" alt="Izole Fashion" />
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full max-w-md text-center lg:text-left lg:ml-40">
              <h1 className="text-5xl md:text-7xl font-bold font-serif tracking-tight mb-2">IZOLE</h1>
              <div className="w-24 h-1 bg-mustard mb-6 mx-auto lg:mx-0"></div>
              <p className="py-4 md:py-6 text-lg md:text-xl leading-relaxed">
                Authentic Style, Timeless Comfort – Elevate Your Wardrobe with Premium Quality Essentials Crafted for the Modern Individual.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <a href="/customer/products" className="btn bg-mustard text-wineRed hover:bg-mustard/90">
                  Shop Now <ArrowRight className="h-5 w-5 ml-1" />
                </a>
                <a href="/customer/sign-up" className="btn border border-mustard bg-wineRed text-mustard">
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      {/* <div className="py-16 md:py-24 bg-gradient-to-br from-primary to-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-20 -bottom-20 bg-white w-64 h-64 rounded-full"></div>
          <div className="absolute -left-40 -top-40 bg-white w-80 h-80 rounded-full"></div>
        </div>
      {/* <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">Elevate Your Style Today</h2>
            <p className="text-xl md:text-2xl mb-8 text-white/90">Experience the perfect blend of comfort, quality, and contemporary design.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/customer/products" className="btn bg-white text-primary hover:bg-white/90">
                Shop Now <ArrowRight className="h-5 w-5 ml-2" />
              </a>
              <a href="/customer#about" className="btn btn-outline border-white text-white hover:bg-white/20">
                Our Story
              </a>
            </div>
          </div>
          </div> */}
          {/* </div>  */}

      {/* Highlights Section */}
      <div className="bg-wineRed py-12 md:py-16 px-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
            {[
              { icon: <Shield className="h-8 w-8 md:h-12 md:w-12 text-wineRed" />, title: "Secure Payment", desc: "100% secure checkout" },
              { icon: <TrendingUp className="h-8 w-8 md:h-12 md:w-12 text-wineRed" />, title: "Premium Quality", desc: "Ethically sourced materials" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-mustard p-6 md:p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="text-wineRed bg-wineRed/30 p-3 md:p-4 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg text-wineRed md:text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-wineRed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
