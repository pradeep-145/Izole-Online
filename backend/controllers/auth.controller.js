const crypto = require("crypto");
const customerModel = require("../models/customer.model.js");
const { JwtService } = require("../services/jwt.service.js");

const AuthController = {
  signUp: async (req, res) => {
    const { username, password, email, phoneNumber, name } = req.body;
    console.log("Sign-up request received:", { username, email, phoneNumber });

    try {
      const response = await customerModel.create(
        username,
        password,
        email,
        phoneNumber,
        name
      );
      console.log("Sign-up successful:", response);
      res.json(response);
    } catch (err) {
      console.error("Sign-up error:", err);
      res.status(500).json(err);
    }
  },

  signIn: async (req, res) => {
    const { username, password } = req.body;
    console.log("Login request received:", { username });

    try {
      const response = await customerModel.findOne(username);
      if (response) {
        if (response.password == password) {
          const payload = {
            userId: response._id,
            name: response.username,
            email: response.email,
          };
          const token = await JwtService.generateToken(payload);
          const { password: _, ...userWithoutPassword } = response.toObject();

          res.cookie("jwt", token, {
            maxAge: 150 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
          });

          res.json({
            message: "Login successful",
            authUser: userWithoutPassword,
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
    const { email } = req.body;
    const otp = crypto.randomInt(10 ** 5, 10 ** 6);
    await customerModel.storeOTP(otp);
    //nodemailer code

    res.status(200).json(`Email Sent to ${email}`);
  },

  confirmUser: async (req, res) => {
    console.log("Confirm User");
    const { username, code } = req.body;
    console.log("Confirm request received:", { username, code });

    try {
      const user = await customerModel.verifyOTP(username, code);
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
};

module.exports = AuthController;
