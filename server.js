// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fileDb = require('./config/file-db');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

// Import middleware
const { isAuthenticated, isAdmin, redirectIfAuthenticated } = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const adminRoutes = require('./routes/admin');

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Request logging middleware - log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Create default admin user if one doesn't exist
function createDefaultAdmin() {
  const users = fileDb.getUsers();
  const existingAdmin = users.find(user => user.role === 'ADMIN');
  
  if (!existingAdmin) {
    console.log('Creating default admin user...');
    
    // Hash the admin password
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    
    const adminUser = {
      id: "admin_" + Date.now(),
      name: "Administrator",
      email: "admin@keybook.live",
      password: hashedPassword,
      role: "ADMIN"
    };
    
    fileDb.addUser(adminUser);
    console.log('Default admin user created.');
  }
}

// Initialize database and create default admin
fileDb.initDatabase();
createDefaultAdmin();

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);

// HTML routes - serving static HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Authentication routes with redirect if already logged in
app.get('/login', redirectIfAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', redirectIfAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Protected routes that require authentication
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Additional dashboard routes for sub-pages
app.get('/dashboard/profile', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/dashboard/orders', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/dashboard/settings', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'products.html'));
});

app.get('/product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'product-detail.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cart.html'));
});

// Support page route
app.get('/support', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'support.html'));
});

// Game keys routes
app.get('/categories/games', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'game-keys.html'));
});

// Admin routes - require admin authentication
app.get('/admin', isAuthenticated, isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin/index.html'));
});

app.get('/admin/products', isAuthenticated, isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin/index.html'));
});

app.get('/admin/orders', isAuthenticated, isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin/index.html'));
});

app.get('/admin/users', isAuthenticated, isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin/index.html'));
});

app.get('/admin/settings', isAuthenticated, isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin/index.html'));
});

// Send all partials for inclusion in pages
app.get('/partials/:partial', (req, res) => {
  const partialName = req.params.partial;
  res.sendFile(path.join(__dirname, 'views', 'partials', partialName));
});

// 404 handler - log invalid routes
app.use((req, res, next) => {
  console.log(`[ERROR] Not Found: ${req.method} ${req.url}`);
  
  // Check if requesting API
  if (req.url.startsWith('/api/')) {
    return res.status(404).json({ message: 'API Route not found' });
  }
  
  // For non-API routes, send the 404 page
  res.status(404).sendFile(path.join(__dirname, 'views', 'partials', '404.html'));
});

// Error handling middleware - log all errors
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack || err.message || err}`);
  
  // Check if requesting API
  if (req.url.startsWith('/api/')) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
  
  // For non-API routes, send the 500 error page
  res.status(500).sendFile(path.join(__dirname, 'views', 'partials', '500.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Log level: All logs enabled (requests, errors, and warnings)`);
});