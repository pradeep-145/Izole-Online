import React from 'react'
import About from '../Components/About'
import Navbar from '../Components/Navbar'
import ProductPreview from '../Components/ProductPreview'
import Contact from '../Components/Contact'
import Footer from '../Components/Footer'
import Home from '../Components/Home'

const LandingPage = () => {
  return (
    <>
    <Navbar/>
    <Home/>
    <ProductPreview/>
    <About/>
    <Contact/>
    <Footer/>
    </>
  )
}

export default LandingPage