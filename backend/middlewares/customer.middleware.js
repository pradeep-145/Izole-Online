const { JwtService } = require("../services/jwt.service.js");
const customerModel = require("../models/customer.model.js");

const authenticateJWT = async (req, res, next) => {
  try {

    if (!req.headers["authorization"]) {
      throw new Error("Authorization header is missing");
    }

    const token = req.headers["authorization"].split(" ")[1];
    console.log(req.headers)
    if (!token) {
      throw new Error("Token is empty");
    }

    // Check if shiprocketToken exists in headers
    let shiprocketToken = null;
    if (req.headers["shiprockettoken"]) {
      shiprocketToken = req.headers["shiprockettoken"].split(" ")[1];
    }

    const decoded = await JwtService.verifyToken(token);
    if (!decoded || !decoded.userId) {
      throw new Error("Invalid or expired token");
    }

    const user = await customerModel.findById(decoded.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Fixed variable name from shiproketToken to shiprocketToken
    req.shiprocketToken = shiprocketToken;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.message || "Unauthorized" });
  }
};

module.exports = authenticateJWT;
