import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const otpVerification = () => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    
  return (
    <div className="hero bg-base-200 min-h-screen flex justify-center items-center">
    <div className="card bg-base-100 w-full max-w-md shadow-2xl p-6">
      <h1 className="text-3xl font-bold text-center mb-4">OTP verification</h1>
      <form className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="text-lg font-medium">Enter OTP </span>
          </label>
          <input type="text" placeholder="Enter name" className="input input-bordered w-full"
            onChange={(e)=>{
                setOtp(e.target.value)
            }}
          />
        </div>
        <div className="form-control">
          <button className="btn btn-primary" onClick={(e)=>{
                e.preventDefault()
              axios.post("http://localhost:3000/confirm",{
                username:localStorage.getItem("username"),
                code:otp
              }).then((res)=>{
                navigate('/customerLogin')
                  console.log(res)
              }).catch((err)=>{
                  console.log(err)
              })
          }}>Verify</button>
          </div>
    </form>
    </div>
    </div>
  )
}

export default otpVerification