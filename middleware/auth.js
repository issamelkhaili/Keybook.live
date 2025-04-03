// middleware/auth.js
const jwt = require('jsonwebtoken');
const fileDb = require('../config/file-db');

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = 'keybook-secret-key';

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  // Only check cookies, never check Authorization header
  const token = req.cookies?.authToken;
  
  if (!token) {
    return res.redirect('/login');
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Clear invalid token
    res.clearCookie('authToken', { path: '/' });
    return res.redirect('/login');
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  const token = req.cookies?.authToken;
  
  if (!token) {
    return res.redirect('/login');
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.role !== 'ADMIN') {
      return res.redirect('/dashboard');
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('authToken', { path: '/' });
    return res.redirect('/login');
  }
};

// Middleware to check if user is already logged in (for login/register pages)
const redirectIfAuthenticated = (req, res, next) => {
  const token = req.cookies?.authToken; // ONLY check cookies
  
  if (!token) {
    return next();
  }
  
  try {
    jwt.verify(token, JWT_SECRET);
    // Valid token - redirect to dashboard
    return res.redirect('/dashboard');
  } catch (error) {
    // Invalid token - clear it and continue
    res.clearCookie('authToken', { path: '/' });
    next();
  }
};

module.exports = {
  isAuthenticated,
  isAdmin,
  redirectIfAuthenticated,
  JWT_SECRET
};