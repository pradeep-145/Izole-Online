import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerSignUp = () => {
  const [otpVisible, setOtpVisible] = useState(false);
  const [otpDisabled, setOtpDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:3000/sign-up", {
        username: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        password: formData.password,
      })
      .then((res) => {
        console.log(res);
        navigate("/otpVerification");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="hero bg-wineRed min-h-screen flex justify-center items-center">
      <div className="card bg-wineRed w-full max-w-md shadow-2xl p-6 border border-mustard">
        <h1 className="text-3xl font-bold text-center text-mustard mb-4">
          Sign Up
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="text-lg font-medium text-mustard">Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter name"
              className="input input-bordered w-full bg-wineRed border border-mustard text-mustard placeholder:text-mustard"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="text-lg font-medium text-mustard">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="input input-bordered w-full bg-wineRed border border-mustard text-mustard placeholder:text-mustard"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="text-lg font-medium text-mustard">Phone Number</span>
            </label>
            <input
              type="number"
              placeholder="Enter phone number"
              className="input input-bordered w-full bg-wineRed border border-mustard text-mustard placeholder:text-mustard"
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="text-lg font-medium text-mustard">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="input input-bordered w-full bg-wineRed border border-mustard text-mustard placeholder:text-mustard"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-full mt-2 bg-mustard text-wineRed font-bold hover:bg-opacity-90"
          >
            Sign Up
          </button>
          <p className="text-sm text-center mt-2 text-mustard">
            Already have an account?{" "}
            <a href="/customer/login" className="link link-hover text-mustard underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CustomerSignUp;
