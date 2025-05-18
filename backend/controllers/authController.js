const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/users');

console.log('✅ authController loaded');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log('🛠 req.body is:', req.body);
  
  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  
  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  // Password strength validation
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  
  try {
    const user = await User.create(name, email, password);
    
    // Remove password_hash from response
    const { password_hash, ...userWithoutPassword } = user;
    
    // Create token for immediate login after registration
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      message: 'User created successfully', 
      user: userWithoutPassword,
      token 
    });
  } catch (err) {
    // Handle duplicate email error
    if (err.message.includes('duplicate key') && err.message.includes('email')) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    // Create token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Remove password_hash from response
    const { password_hash, ...userWithoutPassword } = user;
    
    res.json({ 
      message: 'Login successful',
      user: userWithoutPassword,
      token 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
