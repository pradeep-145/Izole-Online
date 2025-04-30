const { JwtService } = require('../services/jwt.service.js');
const customerModel = require('../models/customer.model.js');

const authenticateJWT = async (req, res, next) => {
  try {
    console.log(req.headers);

    // Parse the cookie header
    const cookies = req.headers['cookie'];
    if (!cookies) {
      throw new Error('Cookie header is missing');
    }

    // Extract the jwt token from the cookies
    const jwtCookie = cookies.split('; ').find(cookie => cookie.startsWith('jwt='));
    if (!jwtCookie) {
      throw new Error('JWT token not found in cookies');
    }

    const token = jwtCookie.split('=')[1];
    if (!token) {
      throw new Error('Token is empty');
    }

    const decoded = await JwtService.verifyToken(token);
    if (!decoded || !decoded.userId) {
      throw new Error('Invalid or expired token');
    }

    const user = await customerModel.findById(decoded.userId);
    console.log(user);
    if (!user) {
      throw new Error('User not found');
    }

    req.user = decoded; // optionally you can attach the whole user object if needed
    next();
  } catch (error) {
    res.status(401).json({ message: error.message || 'Unauthorized' });
  }
};

module.exports = authenticateJWT;