import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import CustomerSignUp from './Pages/CustomerSignUp'
import CustomerLogin from './Pages/CustomerLogin'
import AdminLogin from './Pages/AdminLogin'
import ProductList from './Pages/ProductList';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/customerSignup" element={<CustomerSignUp />} />
        <Route path="/customerLogin" element={<CustomerLogin />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path='/productList' element={<ProductList/>}/>
      </Routes>
    </Router>
  )
}

export default App
