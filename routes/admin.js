// routes/admin.js
const express = require('express');
const router = express.Router();
const fileDb = require('../config/file-db');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

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
    
    // Mock data for dashboard stats
    const dashboardData = {
      totalUsers: users.length,
      totalProducts: db.products.length,
      totalOrders: 24, // Mock data
      recentUsers: users.slice(-5), // Last 5 users
      lowStockProducts: db.products.filter(p => p.stock < 20),
      totalRevenue: 4567.99 // Mock data
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
router.post('/products', isAdmin, (req, res) => {
  try {
    const { name, description, fullDescription, price, category, features, stock } = req.body;
    
    // Basic validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const newProduct = {
      id: `product_${Date.now()}`,
      name,
      description,
      fullDescription: fullDescription || description,
      price: parseFloat(price),
      category,
      image: req.body.image || "/images/placeholder.jpg",
      features: features || [],
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
router.put('/products/:id', isAdmin, (req, res) => {
  try {
    const productId = req.params.id;
    const productIndex = db.products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const { name, description, fullDescription, price, category, features, stock } = req.body;
    
    // Update product
    db.products[productIndex] = {
      ...db.products[productIndex],
      name: name || db.products[productIndex].name,
      description: description || db.products[productIndex].description,
      fullDescription: fullDescription || db.products[productIndex].fullDescription,
      price: parseFloat(price) || db.products[productIndex].price,
      category: category || db.products[productIndex].category,
      image: req.body.image || db.products[productIndex].image,
      features: features || db.products[productIndex].features,
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
    
    const { name, email, role } = req.body;
    
    // Update user
    users[userIndex] = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      email: email || users[userIndex].email,
      role: role || users[userIndex].role
    };
    
    // Save updated users
    fileDb.saveUsers(users);
    
    // Don't send password hash
    const { password, ...safeUser } = users[userIndex];
    
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

// Mock orders data
const orders = [
  {
    id: "order_1",
    userId: "user_1743678663738",
    status: "completed",
    total: 129.99,
    items: [
      {
        productId: "1",
        name: "Windows 11 Pro",
        price: 129.99,
        quantity: 1
      }
    ],
    createdAt: Date.now() - 86400000, // 1 day ago
    updatedAt: Date.now() - 85000000
  },
  {
    id: "order_2",
    userId: "user_1743678663738",
    status: "pending",
    total: 299.98,
    items: [
      {
        productId: "2",
        name: "Microsoft Office 2021",
        price: 199.99,
        quantity: 1
      },
      {
        productId: "5",
        name: "Avast Antivirus Premium",
        price: 49.99,
        quantity: 2
      }
    ],
    createdAt: Date.now() - 3600000, // 1 hour ago
    updatedAt: Date.now() - 3600000
  }
];

// Get all orders
router.get('/orders', isAdmin, (req, res) => {
  try {
    res.json(orders);
  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
router.get('/orders/:id', isAdmin, (req, res) => {
  try {
    const order = orders.find(o => o.id === req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
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
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update order status
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = Date.now();
    
    res.json(orders[orderIndex]);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate license key for order
router.post('/orders/:id/generate-key', isAdmin, (req, res) => {
  try {
    const orderId = req.params.id;
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Generate mock license key
    const licenseKey = `KEYBOOK-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    res.json({ 
      orderId, 
      productId, 
      licenseKey,
      generatedAt: Date.now()
    });
  } catch (error) {
    console.error('Generate key error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;