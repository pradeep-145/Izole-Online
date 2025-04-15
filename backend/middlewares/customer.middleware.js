const { JwtService } = require('../services/jwt.service.js');
const customerModel = require('../models/customer.model.js');

const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization header missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error('Token not found');
    }

    const decoded = await JwtService.verifyToken(token);
    if (!decoded || !decoded.userId) {
      throw new Error('Invalid or expired token');
    }

    const user = await customerModel.findById(decoded.userId);
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
