// routes/auth.js
const express = require('express');
const router = express.Router();
const fileDb = require('../config/file-db');
const bcrypt = require('bcryptjs');

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
        // Password matches, create token and send response
        const token = `token_${Date.now()}`;
        
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
      return res.status(201).json({
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

// Get all users (for debugging)
router.get('/', (req, res) => {
  const users = fileDb.getUsers();
  // Return user list without passwords
  const safeUsers = users.map(({ password, ...user }) => user);
  res.json(safeUsers);
});

module.exports = router;