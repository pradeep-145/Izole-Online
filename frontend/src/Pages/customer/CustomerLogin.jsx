import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CustomerLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("https://lcnfyb0s62.execute-api.ap-south-1.amazonaws.com/api/auth/sign-in", {
        username: formData.username,
        password: formData.password,
      })
      .then((res) => {
        console.log(res.data.authUser);
        localStorage.setItem("authUser", JSON.stringify(res.data.authUser));
        console.log(res.data);
        localStorage.setItem('token',res.data.token);
        if(res.data.authUser.isVerified){

          navigate("/");
        }
        else
        navigate('/customer/otp-verification')
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="hero bg-wineRed min-h-screen flex justify-center items-center">
      <div className="card bg-mustard w-full max-w-md shadow-2xl shadow-mustard/45 p-6 border border-mustard">
        <h1 className="text-3xl font-bold text-center text-wineRed mb-4">
          Login
        </h1>
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
