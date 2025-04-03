// config/file-db.js
/**
 * Simple file-based database for storing users
 */
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Path to data directory and files
const dataDir = path.join(__dirname, '../data');
const usersFilePath = path.join(dataDir, 'users.json');
const productsFilePath = path.join(dataDir, 'products.json');
const ordersFilePath = path.join(dataDir, 'orders.json');

// Initialize the database
function initDatabase() {
  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    console.log('Creating data directory...');
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Create users file with default data if it doesn't exist
  if (!fs.existsSync(usersFilePath)) {
    console.log('Creating users.json with default user...');
    
    // Hash the default password
    const hashedPassword = bcrypt.hashSync('password', 10);
    
    const defaultUsers = [
      {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
        role: "USER"
      }
    ];
    fs.writeFileSync(usersFilePath, JSON.stringify(defaultUsers, null, 2));
  }
  
  // Create products file if it doesn't exist
  if (!fs.existsSync(productsFilePath)) {
    console.log('Creating products.json...');
    fs.writeFileSync(productsFilePath, JSON.stringify([], null, 2));
  }
  
  // Create orders file if it doesn't exist
  if (!fs.existsSync(ordersFilePath)) {
    console.log('Creating orders.json...');
    fs.writeFileSync(ordersFilePath, JSON.stringify([], null, 2));
  }
}

// Load users
function getUsers() {
  try {
    // Make sure database is initialized
    initDatabase();
    
    // Read and parse the users file
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
}

// Save users
function saveUsers(users) {
  try {
    // Make sure database is initialized
    initDatabase();
    
    // Write the users to file
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
}

// Add a new user
function addUser(user) {
  const users = getUsers();
  users.push(user);
  return saveUsers(users);
}

// Find a user by email
function findUserByEmail(email) {
  const users = getUsers();
  return users.find(user => user.email === email);
}

// Get products
function getProducts() {
  try {
    // Make sure database is initialized
    initDatabase();
    
    // Read and parse the products file
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

// Update products
function updateProducts(products) {
  try {
    // Make sure database is initialized
    initDatabase();
    
    // Write the products to file
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving products:', error);
    return false;
  }
}

// Add a new product
function addProduct(product) {
  const products = getProducts();
  products.push(product);
  return updateProducts(products);
}

// Get orders
function getOrders() {
  try {
    // Make sure database is initialized
    initDatabase();
    
    // Read and parse the orders file
    const data = fs.readFileSync(ordersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
}

// Update orders
function updateOrders(orders) {
  try {
    // Make sure database is initialized
    initDatabase();
    
    // Write the orders to file
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving orders:', error);
    return false;
  }
}

// Add a new order
function addOrder(order) {
  const orders = getOrders();
  orders.push(order);
  return updateOrders(orders);
}

module.exports = {
  getUsers,
  saveUsers,
  addUser,
  findUserByEmail,
  getProducts,
  updateProducts,
  addProduct,
  getOrders,
  updateOrders,
  addOrder,
  initDatabase
};