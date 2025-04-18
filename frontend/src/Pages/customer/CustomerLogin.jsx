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
    <div className="hero bg-wineRed min-h-screen flex justify-center items-center">
      <div className="card bg-mustard w-full max-w-md shadow-2xl shadow-mustard/45 p-6 border border-mustard">
        <div>
          <a href="/">
        <ArrowLeft className="text-wineRed font-bold hover:bg-wineRed hover:text-mustard hover:rounded-md "/></a>
        <h1 className="text-3xl font-bold text-center text-wineRed mb-4">
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
              className="input input-bordered w-full bg-mustard border border-wineRed text-wineRed placeholder:text-wineRed"
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
              className="input input-bordered w-full bg-mustard border border-wineRed text-wineRed placeholder:text-wineRed"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <a onClick={()=>{
              navigate('/customer/otp-verification',{state:{source:'forgot-password'}})
            }} className="link link-hover text-sm text-wineRed">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="btn w-full mt-2 bg-wineRed text-mustard font-bold hover:bg-opacity-90"
          >
            Login
          </button>
          <p className="text-sm text-center mt-2 text-wineRed">
            Don't have an account?{" "}
            <a href="/customer/sign-up" className="link link-hover text-wineRed underline">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CustomerLogin;
