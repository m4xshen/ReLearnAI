const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Token = require('../models/tokens');

const auth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    console.log('🔍 Raw Authorization header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log('🔍 Extracted token length:', token.length);
    console.log('🔍 Token starts with:', token.substring(0, 50) + '...');
    console.log('🔍 Token ends with:', '...' + token.substring(token.length - 20));
    
    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.log('❌ JWT_SECRET not found in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    console.log('🔍 JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ JWT decoded successfully:', { userId: decoded.userId, iat: decoded.iat, exp: decoded.exp });
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log('❌ User not found:', decoded.userId);
      return res.status(401).json({ error: 'User not found' });
    }
    
    console.log('✅ User found:', { id: user.id, email: user.email });
    
    // Optional: Check if token exists in database (for enhanced security)
    try {
      const tokenRecord = await Token.findByToken(token);
      if (tokenRecord) {
        console.log('✅ Token found in database');
        req.tokenRecord = tokenRecord;
      } else {
        console.log('⚠️ Token not found in database, but JWT is valid');
      }
    } catch (tokenError) {
      console.log('⚠️ Error checking token in database:', tokenError.message);
      // Continue anyway since JWT is valid
    }
    
    // Add user info to request object
    req.user = user;
    req.userId = user.id;
    
    next();
  } catch (error) {
    console.log('❌ Auth error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Authentication failed: ' + error.message });
  }
};

module.exports = auth;
