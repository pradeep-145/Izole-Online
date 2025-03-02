import React, { useState } from "react";

const CustomerSignUp = () => {
  const [otpVisible, setOtpVisible] = useState(false);
  const [otpDisabled, setOtpDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

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

  return (
    <div className="hero bg-base-200 min-h-screen flex justify-center items-center">
      <div className="card bg-base-100 w-full max-w-md shadow-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-4">Sign Up</h1>
        <form className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="text-lg font-medium">Name</span>
            </label>
            <input type="text" placeholder="Enter name" className="input input-bordered w-full" />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="text-lg font-medium">Email</span>
            </label>
            <input type="email" placeholder="Enter email" className="input input-bordered w-full" />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="text-lg font-medium">Phone Number</span>
            </label>
            <div className="flex gap-2">
              <input type="number" placeholder="Enter phone number" className="input input-bordered w-full" />
              <button
                type="button"
                className={`btn ${otpDisabled ? "btn-disabled" : "btn-primary"}`}
                onClick={handleSendOTP}
                disabled={otpDisabled}
              >
                {otpDisabled ? `Resend OTP (${countdown}s)` : "Send OTP"}
              </button>
            </div>
          </div>

          {otpVisible && (
            <div className="form-control">
              <label className="label">
                <span className="text-lg font-medium">Enter OTP</span>
              </label>
              <input type="text" placeholder="Enter OTP" className="input input-bordered w-full" />
            </div>
          )}

          <div className="form-control">
            <label className="label">
              <span className="text-lg font-medium">Password</span>
            </label>
            <input type="password" placeholder="Enter password" className="input input-bordered w-full" />
          </div>

          <button type="submit" className="btn btn-neutral w-full mt-2">
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
