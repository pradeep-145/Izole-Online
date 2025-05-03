import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';

const CustomerSignUp = () => {
  const [otpVisible, setOtpVisible] = useState(false);
  const [otpDisabled, setOtpDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("/api/auth/sign-up", {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        password: formData.password,
      })
      .then(async(res) => {
        console.log(res);
        await axios.post("/api/auth/send-otp", {
          customerId:res.data._id,
          email: formData.email,
        });
        navigate("/customer/otp-verification",{ state:{source:'login',customerId:res.data._id}});
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="hero bg-yellow-50 min-h-screen flex justify-center items-center">
      <div className="card bg-white w-full max-w-md shadow-xl p-6 border border-yellow-50">
      <div>
          <a href="/">
        <ArrowLeft className="text-wineRed font-bold hover:bg-wineRed hover:text-mustard hover:rounded-md "/></a>
        <h1 className="text-3xl font-bold text-center text-wineRed mb-4">
          Sign Up
        </h1>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="text-lg font-medium text-wineRed">Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter name"
              className="input input-bordered w-full border-yellow-300 focus:border-yellow-500 focus:ring focus:ring-yellow-200"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
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
              <span className="text-lg font-medium text-wineRed">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="input input-bordered w-full border-yellow-300 focus:border-yellow-500 focus:ring focus:ring-yellow-200"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="text-lg font-medium text-wineRed">
                Phone Number
              </span>
            </label>
            <input
              type="number"
              placeholder="Enter phone number"
              className="input input-bordered w-full border-yellow-300 focus:border-yellow-500 focus:ring focus:ring-yellow-200"
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
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
              <br/>
          <button
            type="submit"
            className="btn w-full mt-2 rounded-lg bg-yellow-500 text-xl hover:bg-yellow-600 text-white font-bold hover:bg-opacity-90"
          >
            Sign Up
          </button>
          <p className="text-sm text-center mt-2 text-wineRed">
            Already have an account?{" "}
            <a
              href="/customer/login"
              className="link link-hover font-bold text-wineRed underline"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CustomerSignUp;
