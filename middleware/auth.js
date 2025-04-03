// middleware/auth.js
const jwt = require('jsonwebtoken');
const fileDb = require('../config/file-db');

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = 'keybook-secret-key';

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  // Get token from cookies or Authorization header
  const token = req.cookies?.authToken || 
                (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  
  if (!token) {
    return res.redirect('/login');
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.redirect('/login');
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  const token = req.cookies?.authToken || 
                (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user is admin
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Middleware to check if user is already logged in (for login/register pages)
const redirectIfAuthenticated = (req, res, next) => {
  const token = req.cookies?.authToken || 
                (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  
  if (!token) {
    return next();
  }
  
  try {
    jwt.verify(token, JWT_SECRET);
    // If token is valid, redirect to dashboard
    return res.redirect('/dashboard');
  } catch (error) {
    // If token is invalid, proceed to login/register
    next();
  }
};

module.exports = {
  isAuthenticated,
  isAdmin,
  redirectIfAuthenticated,
  JWT_SECRET
};