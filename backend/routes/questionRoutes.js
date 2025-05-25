const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// Test route without auth
router.get('/test', (req, res) => {
  res.json({ message: 'Question routes are working!' });
});

// Debug JWT endpoint
router.post('/debug-jwt', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token required in request body' });
    }
    
    console.log('🔍 Debug JWT - Token received:', token.substring(0, 50) + '...');
    console.log('🔍 Debug JWT - JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    res.json({
      message: 'JWT is valid',
      decoded: decoded,
      jwtSecretExists: !!process.env.JWT_SECRET
    });
  } catch (error) {
    res.status(400).json({
      error: 'JWT verification failed',
      details: {
        name: error.name,
        message: error.message
      }
    });
  }
});

// Create a question set (folder + questions)
router.post('/question-set', auth, questionController.createQuestionSet);

module.exports = router; 