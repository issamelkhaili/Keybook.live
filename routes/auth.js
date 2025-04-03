// routes/auth.js
const express = require('express');
const router = express.Router();
const fileDb = require('../config/file-db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// Initialize database
fileDb.initDatabase();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Basic validation
  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  // Log the login attempt (for debugging)
  console.log(`Login attempt: ${email}`);
  
  // Get all users
  const users = fileDb.getUsers();
  console.log(`Found ${users.length} users in database`);
  
  // Find user with matching email
  const user = users.find(u => u.email === email);
  
  if (user) {
    // Compare passwords
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (isMatch) {
        console.log(`User found: ${user.name}`);
        // Password matches, create JWT token
        const token = jwt.sign(
          { 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role 
          }, 
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        // Set cookie for browser clients
        res.cookie('authToken', token, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          sameSite: 'strict'
        });
        
        return res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    } catch (err) {
      console.error('Password comparison error:', err);
    }
  }
  
  console.log('Invalid credentials');
  return res.status(401).json({ message: 'Invalid email or password' });
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Log the register attempt (for debugging)
    console.log(`Register attempt: ${email}`);
    
    // Basic validation
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    
    // Check if email already exists
    const existingUser = fileDb.findUserByEmail(email);
    if (existingUser) {
      console.log(`User already exists: ${email}`);
      return res.status(409).json({ message: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      role: 'USER'
    };
    
    // Add user to database
    const success = fileDb.addUser(newUser);
    
    if (success) {
      console.log(`New user created: ${email}`);
      // Create JWT token
      const token = jwt.sign(
        { 
          id: newUser.id, 
          name: newUser.name, 
          email: newUser.email, 
          role: newUser.role 
        }, 
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Set cookie for browser clients
      res.cookie('authToken', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'strict'
      });
      
      return res.status(201).json({
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      });
    } else {
      console.log(`Failed to create user: ${email}`);
      return res.status(500).json({ message: 'Failed to create user' });
    }
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  // Clear the auth cookie
  res.clearCookie('authToken');
  return res.json({ success: true, message: 'Logged out successfully' });
});

// Verify token route
router.get('/verify', (req, res) => {
  const token = req.cookies?.authToken || 
                (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ 
      authenticated: true, 
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
      }
    });
  } catch (error) {
    return res.status(401).json({ authenticated: false, error: error.message });
  }
});

// Get all users (for debugging)
router.get('/', (req, res) => {
  const users = fileDb.getUsers();
  // Return user list without passwords
  const safeUsers = users.map(({ password, ...user }) => user);
  res.json(safeUsers);
});

// Add to routes/auth.js
// Admin login route
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  // Log the login attempt
  console.log(`Admin login attempt: ${email}`);
  
  // Get all users
  const users = fileDb.getUsers();
  
  // Find user with matching email and ADMIN role
  const admin = users.find(u => u.email === email && u.role === 'ADMIN');
  
  if (admin) {
    // Compare passwords
    try {
      const isMatch = await bcrypt.compare(password, admin.password);
      
      if (isMatch) {
        console.log(`Admin login successful: ${admin.name}`);
        // Create JWT token
        const token = jwt.sign(
          { 
            id: admin.id, 
            name: admin.name, 
            email: admin.email, 
            role: admin.role 
          }, 
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        // Set cookie for browser clients
        res.cookie('authToken', token, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          sameSite: 'strict'
        });
        
        return res.json({
          token,
          user: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role
          }
        });
      }
    } catch (err) {
      console.error('Password comparison error:', err);
    }
  }
  
  console.log('Invalid admin credentials');
  return res.status(401).json({ message: 'Invalid email or password' });
});

module.exports = router;