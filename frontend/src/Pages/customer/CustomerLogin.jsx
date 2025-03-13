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
    e.preventDefault()
    await axios.post("http://localhost:3000/login", {
      username: formData.username,
      password: formData.password,
    }).then((res) => {
      console.log(res);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    }).catch((err) => {
      console.log(err);
    });
  };

  return (
    <div className="hero bg-base-200 min-h-screen flex justify-center items-center">
      <div className="card bg-base-100 w-full max-w-md shadow-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-4">Login</h1>
        <form className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="text-lg font-medium">Username</span>
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="input input-bordered w-full"
              onChange={(e) => {
                setFormData({ ...formData
                  , username: e.target.value });
              }
              }
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="text-lg font-medium">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="input input-bordered w-full"
              onChange={(e) => {
                setFormData({ ...formData
                  , password: e.target.value });
              }
              }
            />
          </div>
          <div className="flex justify-between items-center">
            <a className="link link-hover text-sm">Forgot password?</a>
          </div>
          <button type="submit" className="btn btn-neutral w-full mt-2"
            onClick={handleSubmit}
          >
            Login
          </button>
          <p className="text-sm text-center mt-2">
            Don't have an account?{" "}
            <a href="/customer/sign-up" className="link link-hover text-primary">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CustomerLogin;
