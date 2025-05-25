const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();

// Debug logging
console.log('🚀 Starting server...');
console.log('Environment:', process.env.NODE_ENV);

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Replace with your frontend URL in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const userRoutes = require('./routes/userRoutes');
const questionRoutes = require('./routes/questionRoutes');

console.log('✅ Routes loaded');

app.use('/auth', userRoutes);
app.use('/api', questionRoutes);

console.log('✅ Routes mounted');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET /health');
  console.log('- POST /auth/register');
  console.log('- POST /auth/login');
  console.log('- GET /api/test');
  console.log('- POST /api/question-set');
});
