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
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  const user = fileDb.findUserByEmail(email);
  
  if (user && await bcrypt.compare(password, user.password)) {
    // Create token
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
    
    // Set cookie ONLY - no localStorage
    res.cookie('authToken', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
      sameSite: 'strict'
    });
    
    // Return user info for the UI - but NOT the token
    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } else {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    
    // Check if email already exists
    const existingUser = fileDb.findUserByEmail(email);
    if (existingUser) {
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
      
      // Set cookie ONLY - no localStorage
      res.cookie('authToken', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
        sameSite: 'strict'
      });
      
      // Return user info for the UI - but NOT the token
      return res.status(201).json({
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      });
    } else {
      return res.status(500).json({ message: 'Failed to create user' });
    }
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  // Clear the cookie properly
  res.clearCookie('authToken', { 
    path: '/',
    httpOnly: true,
    sameSite: 'strict'
  });
  
  return res.json({ success: true });
});

// Verify token route
router.get('/verify', (req, res) => {
  const token = req.cookies?.authToken;
  
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
    // Clear invalid token
    res.clearCookie('authToken', { path: '/' });
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

// Special complete logout endpoint
router.get('/force-logout', (req, res) => {
  // Clear server-side cookie
  res.clearCookie('authToken');
  
  // Return HTML that clears client-side storage and redirects
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Logging out...</title>
      <script>
        // Clear all storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear all cookies
        document.cookie.split(";").forEach(function(c) {
          document.cookie = c.trim().split("=")[0] + 
            "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
        });
        
        // Redirect to login with cache-busting parameter
        window.location.href = '/login?t=' + new Date().getTime();
      </script>
    </head>
    <body>
      <p>Logging out...</p>
    </body>
    </html>
  `);
});

module.exports = router;