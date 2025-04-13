const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Cache the keys to avoid reading from filesystem on every request
let privateKeyCache = null;
let publicKeyCache = null;

exports.JwtService = {
  generateToken: async (payload) => {
    // Use cached key or load it
    if (!privateKeyCache) {
      // Try environment variable first (Lambda)
      if (process.env.PRIVATE_KEY_CONTENT) {
        privateKeyCache = process.env.PRIVATE_KEY_CONTENT;
      } 
      // Fall back to file reading (local development)
      else if (process.env.PRIVATE_KEY) {
        try {
          privateKeyCache = fs.readFileSync(
            path.join(__dirname, process.env.PRIVATE_KEY), 
            "utf8"
          );
        } catch (error) {
          console.error('Error reading private key file:', error);
          throw new Error('Failed to load private key');
        }
      } else {
        throw new Error('No private key configuration found');
      }
    }

    const token = await jwt.sign(payload, privateKeyCache, {
      expiresIn: '150d',
      algorithm: "RS256",
    });
    
    return token;
  },

  verifyToken: async (token) => {
    // Use cached key or load it
    if (!publicKeyCache) {
      // Try environment variable first (Lambda)
      if (process.env.PUBLIC_KEY_CONTENT) {
        publicKeyCache = process.env.PUBLIC_KEY_CONTENT;
      } 
      // Fall back to file reading (local development)
      else if (process.env.PUBLIC_KEY) {
        try {
          publicKeyCache = fs.readFileSync(
            path.join(__dirname, process.env.PUBLIC_KEY), 
            "utf8"
          );
        } catch (error) {
          console.error('Error reading public key file:', error);
          throw new Error('Failed to load public key');
        }
      } else {
        throw new Error('No public key configuration found');
      }
    }

    const decoded = await jwt.verify(token, publicKeyCache, {
      algorithms: ['RS256']
    });
    
    return decoded;
  }
};