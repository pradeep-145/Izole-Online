import React from "react";

const CustomerLogin = () => {
  return (
    <div className="hero bg-base-200 min-h-screen flex justify-center items-center">
      <div className="card bg-base-100 w-full max-w-md shadow-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-4">Login</h1>
        <form className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="text-lg font-medium">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="input input-bordered w-full"
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
            />
          </div>
          <div className="flex justify-between items-center">
            <a className="link link-hover text-sm">Forgot password?</a>
          </div>
          <button type="submit" className="btn btn-neutral w-full mt-2">
            Login
          </button>
          <p className="text-sm text-center mt-2">
            Don't have an account?{" "}
            <a href="/customerSignup" className="link link-hover text-primary">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CustomerLogin;
