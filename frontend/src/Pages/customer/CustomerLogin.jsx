import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from 'lucide-react';

const CustomerLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("/api/auth/sign-in", {
        username: formData.username,
        password: formData.password,
      })
      .then(async (res) => {
        console.log(res.data.authUser);
        localStorage.setItem("authUser", JSON.stringify(res.data.authUser));
        localStorage.setItem('token',res.data.token)
        if(res.data.authUser.isVerified){
          navigate("/");
        }
        else{

          await axios.post('/api/auth/otp-verification', {
            customerId: req.data.authUser._id,
            email: req.data.authUser.email,
          })
          navigate('/customer/otp-verification')
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="hero bg-wineRed min-h-screen flex justify-center items-center">
      <div className="card bg-mustard w-full max-w-md shadow-2xl shadow-mustard/45 p-6 border border-mustard">
        <div className="flex items-center gap-32">
          <a href="/">
        <ChevronLeft className="text-wineRed font-bold hover:bg-wineRed hover:text-mustard hover:rounded-md "/></a>
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
            <a className="link link-hover text-sm text-wineRed">
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
