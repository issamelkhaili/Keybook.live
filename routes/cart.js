const express = require('express');
const router = express.Router();

// Get cart (in a real app, this would be stored in a database)
router.get('/', (req, res) => {
  // Since we're using client-side storage for the cart,
  // this endpoint would typically check authentication and 
  // then return the user's cart from a database
  
  res.json({
    items: [],
    total: 0
  });
});

// Add item to cart
router.post('/add', (req, res) => {
  const { productId, quantity } = req.body;
  
  // In a real app, this would validate the product ID, 
  // check stock, and add to the user's cart in the database
  
  res.json({
    success: true,
    message: 'Item added to cart'
  });
});

// Update cart item quantity
router.put('/update', (req, res) => {
  const { productId, quantity } = req.body;
  
  // In a real app, this would update the quantity in the database
  
  res.json({
    success: true,
    message: 'Cart updated'
  });
});

// Remove item from cart
router.delete('/remove/:id', (req, res) => {
  const productId = req.params.id;
  
  // In a real app, this would remove the item from the database
  
  res.json({
    success: true,
    message: 'Item removed from cart'
  });
});

// Clear cart
router.delete('/clear', (req, res) => {
  // In a real app, this would clear all items from the user's cart
  
  res.json({
    success: true,
    message: 'Cart cleared'
  });
});

// Get user orders - endpoint used by the dashboard
router.get('/orders', (req, res) => {
  // In a real app, this would fetch the user's orders from the database
  // For now, return mock data
  
  const mockOrders = [
    {
      id: 'ORD-001',
      date: new Date().toISOString(),
      total: 129.99,
      items: [
        { id: '1', name: 'Windows 11 Pro', price: 129.99, quantity: 1 }
      ],
      status: 'completed',
      keys: [
        { id: 'KEY-001', product: 'Windows 11 Pro', code: 'XXXX-XXXX-XXXX-XXXX', activated: false }
      ]
    }
  ];
  
  res.json(mockOrders);
});

module.exports = router;