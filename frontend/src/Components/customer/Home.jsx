import React from 'react';
import logo from '../../assets/logo.jpg';

const Home = () => {
  return (
    <div id="home">
        <div className="hero py-32 mt-16">
  <div className="hero-content flex-col lg:flex-row-reverse gap-40 items-center justify-center">
    <img
      src={logo}
      className="max-w-sm rounded-lg shadow-2xl" />
    <div>
      <h1 className="text-5xl font-bold">IZOLE</h1>
      <p className="py-6 text-xl">
      Authentic Style, Timeless Comfort – Elevate Your Wardrobe with Izole.
      </p>
      <a href='/customerSignup' className="btn btn-primary">Get Started</a>
    </div>
  </div>
</div>
    </div>
  )
}

export default Home