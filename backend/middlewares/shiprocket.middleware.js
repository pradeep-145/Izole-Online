const { getAuthToken } = require("../services/shiprocket.service");

const extractShiprocketToken = async (req, res, next) => {
  try {
    // Try to get token from different header formats
    let token =
      req.headers["shiprocket-token"] ||
      req.headers["shiprockettoken"] ||
      req.headers["shiprocket"];

    // If token exists in the cookie, use that
    if (req.cookies && req.cookies.shiprocket) {
      token = req.cookies.shiprocket.split(" ")[1];
    }

    // If still no token, generate a new one
    if (!token) {
      console.log("No shiprocket token found in request, generating new token");
      token = await getAuthToken();

      // Store the new token in a cookie for future requests
      const maxAge = 10 * 24 * 60 * 60; // 10 days
      res.cookie("shiprocket", token, {
        httpOnly: true,
        path: "/",
        sameSite: "None",
        secure: true,
        maxAge: maxAge * 1000,
      });
    }

    // Make the token available to route handlers
    req.shiprocketToken = token;

    next();
  } catch (error) {
    console.error("Error in Shiprocket middleware:", error);
    next(); // Continue even if token fetching fails
  }
};

module.exports = extractShiprocketToken;
