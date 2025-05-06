const { JwtService } = require("../services/jwt.service.js");
const customerModel = require("../models/customer.model.js");

const authenticateJWT = async (req, res, next) => {
  try {
    const cookies = req.headers["cookie"];
    if (!cookies) {
      throw new Error("Cookie header is missing");
    }

    // Extract the jwt token from the cookies
    const jwtCookie = cookies
      .split("; ")
      .find((cookie) => cookie.startsWith("jwt="));
    const shiprocketCookie = cookies
      .split("; ")
      .find((cookie) => cookie.startsWith("shiprocket="));
    if (!jwtCookie) {
      throw new Error("JWT token not found in cookies");
    }

    const token = jwtCookie.split("=")[1];
    console.log(token);
    if (!token) {
      throw new Error("Token is empty");
    }

    const decoded = await JwtService.verifyToken(token);
    if (!decoded || !decoded.userId) {
      throw new Error("Invalid or expired token");
    }

    const user = await customerModel.findById(decoded.userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (shiprocketCookie) {
      req.shiproketToken = shiprocketCookie.split("=")[1];
    } else {
      req.shiproketToken = null;
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.message || "Unauthorized" });
  }
};

module.exports = authenticateJWT;
