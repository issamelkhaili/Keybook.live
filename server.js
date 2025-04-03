const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize file database
require('./config/file-db').initDatabase();

// Routes
const productsRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');

app.use('/api/products', productsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'products.html'));
});

app.get('/products/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'product-detail.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cart.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/partials/:partial', (req, res) => {
  const partialName = req.params.partial;
  res.sendFile(path.join(__dirname, 'views', 'partials', partialName));
});

// Categories
app.get('/categories/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'categories.html'));
});

// Support page
app.get('/support', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'support.html'));
});

// 404 handler for any other routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});