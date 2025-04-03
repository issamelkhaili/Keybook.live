// routes/orders.js
const express = require('express');
const router = express.Router();
const fileDb = require('../config/file-db');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { generateUUID } = require('../utils/helpers');
const { generateLicenseKey } = require('../utils/licenseUtils');

/**
 * Generate a license key for a product
 * @param {string} productId - The product ID
 * @param {string} customerEmail - The customer's email
 * @returns {string} Generated license key
 */
function createLicenseKey(productId, customerEmail) {
  return generateLicenseKey(productId, customerEmail);
}

/**
 * Create a new order
 * POST /api/orders
 * Public route - no authentication required
 */
router.post('/', async (req, res) => {
  try {
    const { items, payment } = req.body;
    
    // Validate request
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }
    
    if (!payment || !payment.email) {
      return res.status(400).json({ message: 'Payment information required' });
    }
    
    // Fetch product details for each item in the cart
    const products = fileDb.getProducts();
    const orderItems = [];
    
    for (const item of items) {
      const product = products.find(p => p.id === item.id);
      
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.id}` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Not enough stock for ${product.name}. Available: ${product.stock}`
        });
      }
      
      // Generate license key for the product
      const licenseKey = createLicenseKey(product.id, payment.email);
      
      // Add item to order with license key
      orderItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        licenseKey
      });
      
      // Reduce stock
      product.stock -= item.quantity;
    }
    
    // Update product stock in database
    fileDb.updateProducts(products);
    
    // Create order
    const order = {
      id: generateUUID(),
      items: orderItems,
      payment: {
        email: payment.email,
        cardLast4: payment.cardLast4 || '0000'
      },
      total: orderItems.reduce((total, item) => total + (item.price * item.quantity), 0),
      status: 'COMPLETED',
      createdAt: new Date().toISOString()
    };
    
    // Save order to database
    fileDb.addOrder(order);
    
    // Return order ID to client
    res.status(201).json({ 
      message: 'Order created successfully',
      orderId: order.id
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

/**
 * Get order by ID
 * GET /api/orders/:id
 * Public route - but order details should only be shown to the owner
 * (In a real app, we would verify ownership)
 */
router.get('/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const orders = fileDb.getOrders();
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
    
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
});

/**
 * Get all orders (admin only)
 * GET /api/orders
 * Admin only route
 */
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const orders = fileDb.getOrders();
    res.json(orders);
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

module.exports = router; 