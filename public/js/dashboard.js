// dashboard.js - Handles all dashboard functionality

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize dashboard
  initDashboard();
  
  // Check auth status
  checkDashboardAuth();
  
  // Setup event listeners
  setupDashboardEvents();
});

// Initialize the dashboard
function initDashboard() {
  console.log('Initializing dashboard...');
  
  // Load dashboard data
  loadDashboardData();
  
  // Update user info in the UI
  updateUserInterface();
}

// Check if user is authenticated
function checkDashboardAuth() {
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('userData');
  
  if (!token) {
    // User not logged in, redirect to login
    console.log('User not authenticated, redirecting to login');
    window.location.href = '/login?redirect=/dashboard';
    return false;
  }
  
  // Record last login time
  if (!localStorage.getItem('lastLogin')) {
    localStorage.setItem('lastLogin', Date.now().toString());
  }
  
  return true;
}

// Load dashboard data from API
function loadDashboardData() {
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData.id;
  
  if (!userId) {
    console.error('User ID not found');
    return;
  }
  
  // Fetch order data
  fetch('/api/cart/orders')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return response.json();
    })
    .then(data => {
      console.log('Orders loaded:', data);
      updateDashboardStats(data);
    })
    .catch(error => {
      console.error('Error loading orders:', error);
    });
}

// Update dashboard statistics
function updateDashboardStats(data) {
  // Update order count
  const orderCount = data.length || 0;
  const orderCountElements = document.querySelectorAll('.dashboard-tile-value');
  if (orderCountElements && orderCountElements.length > 0) {
    orderCountElements[0].textContent = orderCount;
  }
  
  // Update active keys count
  let activeKeys = 0;
  data.forEach(order => {
    if (order.keys) {
      activeKeys += order.keys.length;
    }
  });
  
  if (orderCountElements && orderCountElements.length > 1) {
    orderCountElements[1].textContent = activeKeys;
  }
  
  // Update last login time
  const lastLogin = localStorage.getItem('lastLogin');
  if (lastLogin && orderCountElements && orderCountElements.length > 2) {
    const date = new Date(parseInt(lastLogin));
    orderCountElements[2].textContent = date.toLocaleDateString();
  }
}

// Update user interface with user data
function updateUserInterface() {
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userName = userData.name || 'User';
  
  // Update username displays
  const userNameElements = document.querySelectorAll('#userName, #welcomeUserName');
  userNameElements.forEach(element => {
    if (element) {
      element.textContent = userName;
    }
  });
}

// Setup event listeners
function setupDashboardEvents() {
  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Redirect to home page
      window.location.href = '/';
    });
  }
  
  // Dashboard navigation
  const menuItems = document.querySelectorAll('.dashboard-menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const isButton = e.currentTarget.tagName === 'BUTTON';
      if (!isButton) {
        // Only for links, not buttons (like logout)
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        
        // Remove active class from all items
        menuItems.forEach(i => i.classList.remove('active'));
        
        // Add active class to clicked item
        e.currentTarget.classList.add('active');
        
        // Handle navigation (in a full app, we would load the appropriate content)
        if (href && href !== '#') {
          window.location.href = href;
        }
      }
    });
  });
} 