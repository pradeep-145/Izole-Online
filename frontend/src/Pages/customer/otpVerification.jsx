import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const OtpVerification = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const timerRef = useRef(null);


  const isFromLogin = location.state?.source === 'login';

  useEffect(() => {
    
    if (isFromLogin) {
      setStep(2);
      // Load email from state if available
      if (location.state?.email) {
        setEmail(location.state.email);
      }
      startResendTimer();
    }
    // Otherwise start at email entry (step 1 - forgot password flow)
  }, [isFromLogin, location.state]);

  // Focus on first input when component mounts or when step changes to OTP verification
  useEffect(() => {
    if (step === 2) {
      inputRefs[0].current?.focus();
    }
  }, [step]);

  // Timer for resend OTP functionality
  const startResendTimer = () => {
    setCanResend(false);
    setTimer(60);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input if current one is filled
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
    
    // If last digit is entered, auto-submit after a small delay
    if (index === 3 && value) {
      const allFilled = newOtp.every(digit => digit !== '');
      if (allFilled) {
        setTimeout(() => {
          document.getElementById('verify-btn').click();
        }, 300);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    try {
      // Request password reset and send OTP
      // await axios.post("/api/auth/forgot-password", { email });
      setSuccess(`OTP has been sent to ${email}`);
      setStep(2); // Move to OTP verification
      startResendTimer();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const otpValue = otp.join('');
    if (otpValue.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      setIsLoading(false);
      return;
    }

    try {
      if (isFromLogin) {
        // For login flow - verify OTP and redirect to customer page
        const res = await axios.post("/api/auth/confirm", {
          customerId: JSON.parse(localStorage.getItem("authUser")),
          code: otpValue
        });
        navigate('/customer');
      } else {
        // For forgot password flow - verify OTP and move to password reset
        await axios.post("/api/auth/verify-otp", {
          email,
          code: otpValue
        });
        setSuccess('OTP verified successfully!');
        setStep(3); // Move to password reset
      }
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Reset password
      await axios.post("/api/auth/reset-password", {
        email,
        code: otp.join(''),
        password
      });
      setSuccess('Password has been reset successfully!');
      setTimeout(() => navigate('/customer/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetOTP = () => {
    setOtp(['', '', '', '']);
    inputRefs[0].current?.focus();
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      if (isFromLogin) {
        await axios.post("/api/auth/send-otp", {
          customerId: JSON.parse(localStorage.getItem("authUser"))
        });
      } else {
        await axios.post("/api/auth/send-otp", { email });
      }
      setSuccess('OTP has been resent successfully!');
      startResendTimer();
      resetOTP();
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailForm = () => (
    <>
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Forgot Password</h1>
      <p className="text-center text-gray-600 mb-6">Enter your email to receive a verification code</p>
      
      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-700 font-medium">Email Address</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input input-bordered w-full border-yellow-300 focus:border-yellow-500 focus:ring focus:ring-yellow-200"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className={`btn w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-medium text-lg ${isLoading ? 'btn-disabled' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Sending...
            </> : 
            'Send Verification Code'
          }
        </button>
        
        <div className="text-center">
          <button 
            type="button" 
            onClick={() => navigate('/customer/login')}
            className="btn btn-link text-yellow-600 hover:text-yellow-700"
          >
            Back to Login
          </button>
        </div>
      </form>
    </>
  );

  const renderOtpForm = () => (
    <>
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
        {isFromLogin ? 'Verify Your Account' : 'Enter Verification Code'}
      </h1>
      <p className="text-center text-gray-600 mb-2">
        Enter the 4-digit code sent to {email || 'your device'}
      </p>
      <p className="text-center text-sm text-gray-500 mb-6">
        The code will expire in 10 minutes
      </p>
      
      <form onSubmit={handleOtpSubmit} className="space-y-6">
        <div className="flex justify-center space-x-4 mb-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-16 h-16 text-center text-2xl font-bold rounded-lg border-2 border-yellow-300 focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:outline-none bg-white"
            />
          ))}
        </div>
        
        <div className="flex flex-col space-y-3">
          <button 
            id="verify-btn"
            type="submit" 
            className={`btn w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-medium text-lg ${isLoading ? 'btn-disabled' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Verifying...
              </> : 
              'Verify OTP'
            }
          </button>
          
          <button 
            type="button" 
            onClick={resetOTP}
            className="btn bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 py-3 rounded-lg font-medium"
          >
            Reset
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Didn't receive the code?{' '}
          {timer > 0 ? (
            <span className="text-gray-500">Resend in {timer}s</span>
          ) : (
            <button 
              onClick={handleResendOtp}
              className={`text-yellow-600 hover:text-yellow-700 font-medium ${canResend ? '' : 'opacity-50 cursor-not-allowed'}`}
              disabled={!canResend}
            >
              Resend OTP
            </button>
          )}
        </p>
      </div>
      
      {!isFromLogin && (
        <div className="mt-3 text-center">
          <button 
            type="button" 
            onClick={() => setStep(1)}
            className="btn btn-link text-yellow-600 hover:text-yellow-700"
          >
            Change Email
          </button>
        </div>
      )}
    </>
  );

  const renderPasswordForm = () => (
    <>
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Reset Your Password</h1>
      <p className="text-center text-gray-600 mb-6">Create a new password for your account</p>
      
      <form onSubmit={handlePasswordSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-700 font-medium">New Password</span>
          </label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="input input-bordered w-full border-yellow-300 focus:border-yellow-500 focus:ring focus:ring-yellow-200"
              required
              minLength={8}
            />
          </div>
          <label className="label">
            <span className="label-text-alt text-gray-500">Password must be at least 8 characters long</span>
          </label>
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-700 font-medium">Confirm Password</span>
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="input input-bordered w-full border-yellow-300 focus:border-yellow-500 focus:ring focus:ring-yellow-200"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className={`btn w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-medium text-lg ${isLoading ? 'btn-disabled' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Updating...
            </> : 
            'Reset Password'
          }
        </button>
      </form>
    </>
  );

  return (
    <div className="bg-yellow-50 min-h-screen flex justify-center items-center px-4 py-8">
      <div className="card bg-white w-full max-w-md shadow-xl p-8 rounded-lg border border-yellow-100">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-200 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-yellow-800">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        
        {!isFromLogin && (
          <div className="flex justify-center mb-6">
            <ul className="steps steps-horizontal w-full max-w-xs">
              <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Email</li>
              <li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Verify</li>
              <li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Password</li>
            </ul>
          </div>
        )}
        
        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{success}</span>
          </div>
        )}
        
        {step === 1 && !isFromLogin && renderEmailForm()}
        {step === 2 && renderOtpForm()}
        {step === 3 && !isFromLogin && renderPasswordForm()}
      </div>
    </div>
  );
};

export default OtpVerification;