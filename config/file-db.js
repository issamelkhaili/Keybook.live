// config/file-db.js
/**
 * Simple file-based database for storing users
 */
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Path to data directory and users file
const dataDir = path.join(__dirname, '../data');
const usersFilePath = path.join(dataDir, 'users.json');

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

module.exports = {
  getUsers,
  saveUsers,
  addUser,
  findUserByEmail,
  initDatabase
};