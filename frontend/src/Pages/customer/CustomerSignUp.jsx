import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
const CustomerSignUp = () => {
  const [otpVisible, setOtpVisible] = useState(false);
  const [otpDisabled, setOtpDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const [formData,setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleSendOTP = () => {
    setOtpVisible(true);
    setOtpDisabled(true);
    setCountdown(30);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setOtpDisabled(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
  };
  const handleSubmit=async(e)=>{
    e.preventDefault()
    await
    axios.post('http://localhost:3000/sign-up',{
      username:formData.name,
      email:formData.email,
      phoneNumber:formData.phone,
      password:formData.password
    }).then((res)=>{
      console.log(res)
      navigate("/otpVerification")
    }).catch((err)=>{
      console.log(err)
    })


  }
  return (
    <div className="hero bg-base-200 min-h-screen flex justify-center items-center">
      <div className="card bg-base-100 w-full max-w-md shadow-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-4">Sign Up</h1>
        <form className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="text-lg font-medium">Name</span>
            </label>
            <input type="text" placeholder="Enter name" className="input input-bordered w-full" onChange={(e)=>{
              setFormData({...formData,name:e.target.value})

            }} />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="text-lg font-medium">Email</span>
            </label>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter email" className="input input-bordered w-full"
              onChange={(e)=>{
                setFormData({...formData,email:e.target.value})
              }}
              />
              
            </div>
          </div>


          <div className="form-control">
            <label className="label">
              <span className="text-lg font-medium">Phone Number</span>
            </label>
            <input type="number" placeholder="Enter phone number" className="input input-bordered w-full"
            onChange={(e)=>{
              setFormData({...formData,phone:e.target.value})
            }}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="text-lg font-medium">Password</span>
            </label>
            <input type="password" placeholder="Enter password" className="input input-bordered w-full"
            onChange={(e)=>{
              setFormData({...formData,password:e.target.value})
            }}
            />
          </div>

          <button type="submit" className="btn btn-neutral w-full mt-2" onClick={handleSubmit}>
            Sign Up
          </button>
          <p className="text-sm text-center mt-2">
            Already have an account?{" "}
            <a href="/customerLogin" className="link link-hover text-primary">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CustomerSignUp;
