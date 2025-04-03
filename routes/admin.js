// routes/admin.js
const express = require('express');
const router = express.Router();
const fileDb = require('../config/file-db');
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/images/products');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    // Accept only images
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  // In a real app, you would verify JWT token
  // For this demo version, we'll use a simple token check
  try {
    // Get user from token (simplified)
    const users = fileDb.getUsers();
    const user = users.find(u => u.role === 'ADMIN');
    
    if (!user) {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin dashboard data
router.get('/dashboard', isAdmin, (req, res) => {
  try {
    const users = fileDb.getUsers();
    
    // Mock data for orders
    const recentOrders = [
      {
        id: 'order_1',
        userId: 'user_1',
        total: 129.99,
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: 'order_2',
        userId: 'user_2',
        total: 249.98,
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      }
    ];
    
    // Mock data for dashboard stats
    const dashboardData = {
      totalUsers: users.length,
      totalProducts: db.products.length,
      totalOrders: 24, // Mock data
      recentUsers: users.slice(-5), // Last 5 users
      lowStockProducts: db.products.filter(p => p.stock < 20),
      totalRevenue: 4567.99, // Mock data
      recentOrders: recentOrders
    };
    
    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products
router.get('/products', isAdmin, (req, res) => {
  try {
    res.json(db.products);
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by ID
router.get('/products/:id', isAdmin, (req, res) => {
  try {
    const product = db.findProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new product
router.post('/products', isAdmin, upload.single('productImage'), (req, res) => {
  try {
    console.log("Received product data:", req.body);
    
    const { name, description, fullDescription, price, category, stock } = req.body;
    const features = req.body.productFeatures ? req.body.productFeatures.split('\n').filter(f => f.trim()) : [];
    
    // Basic validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Handle image upload
    const imagePath = req.file ? `/images/products/${req.file.filename}` : "/images/placeholder.jpg";
    
    const newProduct = {
      id: `product_${Date.now()}`,
      name,
      description,
      fullDescription: fullDescription || description,
      price: parseFloat(price),
      category,
      image: imagePath,
      features: features,
      stock: parseInt(stock) || 0
    };
    
    // In a real app, you would save to database
    db.products.push(newProduct);
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product
router.put('/products/:id', isAdmin, upload.single('productImage'), (req, res) => {
  try {
    const productId = req.params.id;
    const productIndex = db.products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const { name, description, fullDescription, price, category, stock } = req.body;
    const features = req.body.productFeatures ? req.body.productFeatures.split('\n').filter(f => f.trim()) : db.products[productIndex].features;
    
    // Handle image upload (keep existing image if no new one is uploaded)
    const imagePath = req.file ? `/images/products/${req.file.filename}` : db.products[productIndex].image;
    
    // Update product
    db.products[productIndex] = {
      ...db.products[productIndex],
      name: name || db.products[productIndex].name,
      description: description || db.products[productIndex].description,
      fullDescription: fullDescription || db.products[productIndex].fullDescription,
      price: parseFloat(price) || db.products[productIndex].price,
      category: category || db.products[productIndex].category,
      image: imagePath,
      features: features,
      stock: parseInt(stock) || db.products[productIndex].stock
    };
    
    res.json(db.products[productIndex]);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/products/:id', isAdmin, (req, res) => {
  try {
    const productId = req.params.id;
    const productIndex = db.products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get the product to delete its image
    const product = db.products[productIndex];
    
    // Delete product image if it's not the placeholder
    if (product.image && product.image !== "/images/placeholder.jpg") {
      const imagePath = path.join(__dirname, '../public', product.image);
      
      // Check if file exists before trying to delete
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Remove product
    db.products.splice(productIndex, 1);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', isAdmin, (req, res) => {
  try {
    const users = fileDb.getUsers();
    
    // Don't send password hashes
    const safeUsers = users.map(({ password, ...user }) => user);
    
    res.json(safeUsers);
  } catch (error) {
    console.error('Users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/users/:id', isAdmin, (req, res) => {
  try {
    const users = fileDb.getUsers();
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't send password hash
    const { password, ...safeUser } = user;
    
    res.json(safeUser);
  } catch (error) {
    console.error('User error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/users/:id', isAdmin, (req, res) => {
  try {
    const userId = req.params.id;
    const users = fileDb.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { name, email, role, password } = req.body;
    
    // Update user
    const updatedUser = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      email: email || users[userIndex].email,
      role: role || users[userIndex].role
    };
    
    // Update password if provided
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      updatedUser.password = bcrypt.hashSync(password, salt);
    }
    
    users[userIndex] = updatedUser;
    
    // Save updated users
    fileDb.saveUsers(users);
    
    // Don't send password hash
    const { password: pwd, ...safeUser } = users[userIndex];
    
    res.json(safeUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', isAdmin, (req, res) => {
  try {
    const userId = req.params.id;
    const users = fileDb.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove user
    users.splice(userIndex, 1);
    
    // Save updated users
    fileDb.saveUsers(users);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders
router.get('/orders', isAdmin, (req, res) => {
  try {
    // Mock data for orders
    const orders = [
      {
        id: 'order_1',
        userId: 'user_1',
        items: [
          { id: 'product_1', name: 'Windows 11 Pro', price: 129.99, quantity: 1 }
        ],
        total: 129.99,
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: 'order_2',
        userId: 'user_2',
        items: [
          { id: 'product_2', name: 'Microsoft Office 2021', price: 199.99, quantity: 1 },
          { id: 'product_3', name: 'Avast Antivirus', price: 49.99, quantity: 1 }
        ],
        total: 249.98,
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      }
    ];
    
    res.json(orders);
  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
router.get('/orders/:id', isAdmin, (req, res) => {
  try {
    const orderId = req.params.id;
    
    // Mock data for single order
    const order = {
      id: orderId,
      userId: 'user_1',
      items: [
        { id: 'product_1', name: 'Windows 11 Pro', price: 129.99, quantity: 1 },
        { id: 'product_2', name: 'Microsoft Office 2021', price: 199.99, quantity: 1 }
      ],
      total: 329.98,
      status: 'pending',
      createdAt: new Date().toISOString(),
      licenses: []
    };
    
    res.json(order);
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/orders/:id/status', isAdmin, (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    
    // Basic validation
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    // Validate status value
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    // In a real app, you would update the order in the database
    // For now, just return a success response
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      orderId,
      status
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate license keys for an order
router.post('/orders/:id/generate-keys', isAdmin, (req, res) => {
  try {
    const orderId = req.params.id;
    
    // Mock license key generation
    // In a real app, you would generate secure license keys and save them
    const licenses = [
      {
        productId: 'product_1',
        productName: 'Windows 11 Pro',
        key: 'WINW-XXXX-XXXX-XXXX-XXXX-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        activationUrl: 'https://example.com/activate'
      },
      {
        productId: 'product_2',
        productName: 'Microsoft Office 2021',
        key: 'MSOW-XXXX-XXXX-XXXX-XXXX-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        activationUrl: 'https://example.com/activate'
      }
    ];
    
    res.json({
      success: true,
      message: 'License keys generated successfully',
      orderId,
      licenses
    });
  } catch (error) {
    console.error('Generate license keys error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Restock product
router.post('/products/:id/restock', isAdmin, (req, res) => {
  try {
    const productId = req.params.id;
    const { quantity } = req.body;
    
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: 'Valid quantity required' });
    }
    
    const productIndex = db.products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update stock
    db.products[productIndex].stock += parseInt(quantity);
    
    res.json({
      success: true,
      product: db.products[productIndex]
    });
  } catch (error) {
    console.error('Restock error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;