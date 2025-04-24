import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../zustand/useCart";
import { useWishlist } from "../../zustand/useWishlist";

const CustomerLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const {fetchCart}=useCart()
  const {fetchWishlist}=useWishlist()
  const {setAuthUser} = useAuth()
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("/api/auth/sign-in", {
        username: formData.username,
        password: formData.password,
      })
      .then(async (res) => {
        console.log(res.data.authUser);
        if(res.data.authUser.isVerified){
          await localStorage.setItem("authUser", JSON.stringify(res.data.authUser));
          setAuthUser(res.data.authUser);
          await localStorage.setItem('token',res.data.token)
          fetchCart();
          fetchWishlist();
          navigate("/");
        }
        else{
          console.log("Hello")
          // await axios.post('/api/auth/send-otp', {
          //   customerId: res.data.authUser._id,
          //   email: res.data.authUser.email,
          // })
          navigate('/customer/otp-verification',{state:{source:'login'}});
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="hero bg-yellow-50 min-h-screen flex justify-center items-center">
      <div className="card bg-white border border-yellow-50 w-full max-w-md shadow-xl p-6">
        <div>
          <a href="/">
        <ArrowLeft className="text-wineRed font-bold hover:bg-wineRed hover:text-mustard hover:rounded-md "/></a>
        <h1 className="text-4xl font-bold text-center text-black mb-4">
          Login
        </h1>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="text-lg font-medium text-wineRed">Username</span>
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="input input-bordered w-full border-yellow-300 focus:border-yellow-500 focus:ring focus:ring-yellow-200"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="text-lg font-medium text-wineRed">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="input input-bordered w-full border-yellow-300 focus:border-yellow-500 focus:ring focus:ring-yellow-200"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <div className="flex justify-end items-center">
            <a onClick={()=>{
              navigate('/customer/otp-verification',{state:{source:'forgot-password'}})
            }} className="link link-hover text-sm font-semibold text-wineRed">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="btn w-full mt-2 rounded-lg bg-yellow-500 text-xl hover:bg-yellow-600 text-white font-bold hover:bg-opacity-90"
          >
            Login
          </button>
          <p className="text-sm text-center mt-2 text-wineRed">
            Don't have an account?{" "}
            <a href="/customer/sign-up" className="link link-hover text-wineRed font-bold underline">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CustomerLogin;
