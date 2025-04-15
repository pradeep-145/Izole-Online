const crypto = require("crypto");
const customerModel = require("../models/customer.model.js");
const { JwtService } = require("../services/jwt.service.js");
const otpModel=require('../models/otp.model.js')
const nodemailer = require('nodemailer')

const AuthController = {
  signUp: async (req, res) => {
    const { username, password, email, phoneNumber, name } = req.body;
    console.log("Sign-up request received:", { username, email, phoneNumber });

    try {
      const response = await customerModel.create({
        username,
        password,
        email,
        phoneNumber,
        name
      }
      );
      const { password: _, ...userWithoutPassword } = response.toObject();
      console.log("Sign-up successful:", userWithoutPassword);
      res.json(userWithoutPassword);
    } catch (err) {
      console.error("Sign-up error:", err);
      res.status(500).json(err);
    }
  },

  signIn: async (req, res) => {
    const { username, password } = req.body;
    console.log("Login request received:", req.body);

    try {
      const response = await customerModel.findOne({username});
      if (response) {
        if (response.password == password) {
          const payload = {
            userId: response._id,
            name: response.username,
            email: response.email,
          };
          const token = await JwtService.generateToken(payload);
          const { password: _, ...userWithoutPassword } = response.toObject();

          
          res.json({
            message: "Login successful",
            authUser: userWithoutPassword, 
            token:token
          });
        } else {
          res.status(400).json("Invalid Password");
        }
      } else {
        res.status(404).json("User Not Found");
      }
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json(err);
    }
  },
  sendMail: async (req, res) => {
    const { customerId,email } = req.body;
    const otp = crypto.randomInt(10 ** 5, 10 ** 6);
    await otpModel.storeOTP(customerId,otp);
    //nodemailer code
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    transporter.sendMail(
      {
        from: process.env.EMAIL,
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is ${otp}`,
      },
      (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
          res.status(500).json("Error sending email");
        } else {
          console.log("Email sent:", info.response);
        }
      }
    );
    

    res.status(200).json(`Email Sent to ${email}`);
  },

  confirmUser: async (req, res) => {
    console.log("Confirm User");
    const { customerId, code } = req.body;
    console.log("Confirm request received:", { customerId, code });

    try {
      const user = await otpModel.verifyOTP(customerId, code);
      if (user) {
        res.status(200).json("User verified");
      } else {
        res.status(400).json("Re-Enter OTP");
      }
    } catch (err) {
      console.error("Confirm error:", err);
      res.status(500).json("Internal server Error");
    }
  },
  verifyOTP:async(req,res)=>{
    const {customerId, code }= req.body;
    try{
      const verified=await otpModel.passwordResetVerification(customerId, code);
      if(verified){
        res.status(200).json("user verified");

      }
      else{
        res.status(400).json("Re-Enter OTP");
      }
    }catch(error){
      console.log("verifyOtp error",error);
      res.status(500).json("Internal server Error");
    }
  },
  resetPassword:async(req,res)=>{
    const {email, password}=req.body;
    try {
      await customerModel.findOneAndUpdate({email},{password});
      res.status(200).json("Password updated successfully");
    } catch (error) {
      console.log("Error at reset Password", error);
      res.status(500).json("Internal server error");
    }
  }
};

module.exports = AuthController;
