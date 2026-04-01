// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  console.log('🔐 Auth middleware - Headers received:', JSON.stringify(req.headers, null, 2));

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('📝 Token received:', token);
      console.log('📝 Token length:', token?.length);
      console.log('🔑 JWT_SECRET exists:', !!process.env.JWT_SECRET);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Decoded token:', decoded);

      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        console.log('❌ User not found for ID:', decoded.id);
        return res.status(401).json({ message: 'User not found' });
      }
      
      console.log('✅ User authenticated:', req.user.email);
      next();
    } catch (error) {
      console.error('❌ Token verification error:', error.message);
      console.error('Error type:', error.name);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('❌ No authorization header or invalid format');
    console.log('Authorization header:', req.headers.authorization);
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };