import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import CustomerSignUp from './Pages/CustomerSignUp'
import CustomerLogin from './Pages/CustomerLogin'
import AdminLogin from './Pages/AdminLogin'
import OtpVerification from './Pages/otpVerification'
import AdminDashboard from './Pages/Admin.dashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/customerSignup" element={<CustomerSignUp />} />
        <Route path="/customerLogin" element={<CustomerLogin />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/otpVerification" element={<OtpVerification/>} />
        <Route path='/admin' element={<AdminDashboard/>} ></Route>
      </Routes>
    </Router>
  )
}

export default App
