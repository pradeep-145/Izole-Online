const crypto = require("crypto");
const customerModel = require("../models/customer.model.js");
const { JwtService } = require("../services/jwt.service.js");
const otpModel = require("../models/otp.model.js");
const nodemailer = require("nodemailer");

const AuthController = {
  signUp: async (req, res) => {
    const { username, password, email, gender, phoneNumber, name } = req.body;
    console.log("Sign-up request received:", { username, email, phoneNumber });

    try {
      const avatar = `https://avatar.iran.liara.run/public/${
        gender == "Male" ? "boy" : "girl"
      }?username=${username}`;
      const response = await customerModel.create({
        username,
        password,
        email,
        phoneNumber,
        gender,
        name,
        avatar,
      });
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
      const response = await customerModel.findOne({ username });
      if (response) {
        if (response.password == password) {
          const payload = {
            userId: response._id,
            name: response.username,
            email: response.email,
          };
          const token = await JwtService.generateToken(payload);
          var { password: _, ...userWithoutPassword } = response.toObject();

          // Calculate 150 days in seconds: 150 days × 24 hours × 60 minutes × 60 seconds
          const maxAge = 150 * 24 * 60 * 60;

          // Create current date in IST format
          const currentDate = new Date();
          
          userWithoutPassword = {
            ...userWithoutPassword,
            lastLogin: currentDate,
          };

          console.log("User without password:", userWithoutPassword);
          
          res.setHeader("Set-Cookie", [
            `jwt=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge};`,
          ]);

          res.json({
            message: "Login successful",
            authUser: userWithoutPassword,
            token: token,
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
    const { customerId, email } = req.body;
    const otp = crypto.randomInt(10 ** 5, 10 ** 6);

    await otpModel.storeOTP(customerId, otp);

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
          console.error("Error sending email:", error);
          return res.status(500).json({ error: "Failed to send email" });
        } else {
          console.log("Email sent:", info.response);
          return res.status(200).json({ message: `Email sent to ${email}` });
        }
      }
    );
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
  verifyOTP: async (req, res) => {
    const { customerId, code } = req.body;
    try {
      const verified = await otpModel.passwordResetVerification(
        customerId,
        code
      );
      if (verified) {
        res.status(200).json("user verified");
      } else {
        res.status(400).json("Re-Enter OTP");
      }
    } catch (error) {
      console.log("verifyOtp error", error);
      res.status(500).json("Internal server Error");
    }
  },
  resetPassword: async (req, res) => {
    const { email, password } = req.body;
    try {
      await customerModel.findOneAndUpdate({ email }, { password });
      res.status(200).json("Password updated successfully");
    } catch (error) {
      console.log("Error at reset Password", error);
      res.status(500).json("Internal server error");
    }
  },
};

module.exports = AuthController;
