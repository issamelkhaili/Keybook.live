// dashboard.js - Handles all dashboard functionality

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize dashboard
  initDashboard();
  
  // Setup dashboard event listeners
  setupDashboardEvents();
  
  // Load dashboard content based on current view
  loadDashboardContent();
});

// Initialize the dashboard
function initDashboard() {
  console.log('Initializing dashboard...');
  
  // Load dashboard data
  loadDashboardData();
  
  // Update user interface elements
  updateUserInterface();
}

// Setup dashboard event listeners
function setupDashboardEvents() {
  // Handle tab navigation
  const navTabs = document.querySelectorAll('.dashboard-nav a');
  navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = tab.getAttribute('href').substring(1);
      activateTab(tabId);
    });
  });
  
  // Setup logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          // Just redirect to login - no localStorage to clear
          window.location.href = '/login';
        } else {
          console.error('Logout failed');
        }
      } catch (error) {
        console.error('Logout error:', error);
      }
    });
  }
}

// Load dashboard data from API
function loadDashboardData() {
  // Fetch user data from server
  fetch('/api/auth/verify')
    .then(response => {
      if (!response.ok) {
        throw new Error('Not authenticated');
      }
      return response.json();
    })
    .then(data => {
      if (data.authenticated) {
        const userData = data.user;
        
        // Update all user name elements in the UI
        const userNameElements = document.querySelectorAll('.user-name, #userName, #welcomeUserName, #profileName');
        userNameElements.forEach(el => {
          if (el) {
            el.textContent = userData.name || 'User';
          }
        });
        
        // Update profile form if it exists
        const profileNameInput = document.getElementById('profileUpdateName');
        const profileEmailInput = document.getElementById('profileUpdateEmail');
        if (profileNameInput) profileNameInput.value = userData.name || '';
        if (profileEmailInput) profileEmailInput.value = userData.email || '';
        
        // Also update email display elements
        const emailElements = document.querySelectorAll('#profileEmail');
        emailElements.forEach(el => {
          if (el) {
            el.textContent = userData.email || '';
          }
        });
        
        // Fetch orders if on dashboard
        return fetchOrderData();
      } else {
        throw new Error('Not authenticated');
      }
    })
    .catch(error => {
      console.error('Error loading user data:', error);
      // Redirect to login if not authenticated
      window.location.href = '/login';
    });
}

// Fetch order data for the dashboard
function fetchOrderData() {
  fetch('/api/cart/orders')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return response.json();
    })
    .then(data => {
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
  // We'll get user data from the server in loadDashboardData
  // This function just updates any additional UI elements that aren't 
  // handled by that function
}

// Load dashboard content based on current URL
function loadDashboardContent() {
  const currentPath = window.location.pathname;
  const dashboardMenuItems = document.querySelectorAll('.dashboard-menu-item');
  
  // Remove active class from all menu items
  dashboardMenuItems.forEach(item => {
    item.classList.remove('active');
  });
  
  // Add active class to current menu item based on URL
  let activeMenuItem;
  
  if (currentPath === '/dashboard') {
    activeMenuItem = document.querySelector('.dashboard-menu-item[href="/dashboard"]');
    // Main dashboard is already loaded
  } else if (currentPath === '/dashboard/profile') {
    activeMenuItem = document.querySelector('.dashboard-menu-item[href="/dashboard/profile"]');
    document.querySelector('.dashboard-content').innerHTML = getProfileContent();
    initProfilePage();
  } else if (currentPath === '/dashboard/orders') {
    activeMenuItem = document.querySelector('.dashboard-menu-item[href="/dashboard/orders"]');
    document.querySelector('.dashboard-content').innerHTML = getOrdersContent();
    loadOrderHistory();
  } else if (currentPath === '/dashboard/settings') {
    activeMenuItem = document.querySelector('.dashboard-menu-item[href="/dashboard/settings"]');
    document.querySelector('.dashboard-content').innerHTML = getSettingsContent();
    initSettingsPage();
  }
  
  if (activeMenuItem) {
    activeMenuItem.classList.add('active');
  }
}

// Profile page content
function getProfileContent() {
  return `
    <h2>My Profile</h2>
    <div class="profile-card">
      <div class="profile-info">
        <div class="profile-avatar">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        
        <div class="profile-details">
          <h3 id="profileName">User Name</h3>
          <p id="profileEmail">user@example.com</p>
        </div>
      </div>
      
      <form id="profileForm" class="profile-form">
        <div class="form-group">
          <label for="profileUpdateName">Name</label>
          <input type="text" id="profileUpdateName" name="name" placeholder="Your name">
        </div>
        
        <div class="form-group">
          <label for="profileUpdateEmail">Email</label>
          <input type="email" id="profileUpdateEmail" name="email" placeholder="Your email" disabled>
        </div>
        
        <div class="form-group">
          <label for="profileUpdatePassword">New Password</label>
          <input type="password" id="profileUpdatePassword" name="password" placeholder="Enter new password (leave blank to keep current)">
        </div>
        
        <div class="form-group">
          <label for="profileUpdatePasswordConfirm">Confirm New Password</label>
          <input type="password" id="profileUpdatePasswordConfirm" name="passwordConfirm" placeholder="Confirm new password">
        </div>
        
        <button type="submit" class="btn btn-primary">Update Profile</button>
      </form>
    </div>
  `;
}

// Orders page content
function getOrdersContent() {
  return `
    <h2>My Orders</h2>
    <div class="orders-container">
      <div class="orders-list" id="ordersList">
        <!-- Orders will be loaded here -->
        <div class="loading">Loading your orders...</div>
      </div>
    </div>
  `;
}

// Settings page content
function getSettingsContent() {
  return `
    <h2>Account Settings</h2>
    <div class="settings-container">
      <div class="settings-section">
        <h3>Notification Preferences</h3>
        <form id="notificationForm" class="settings-form">
          <div class="form-group checkbox">
            <input type="checkbox" id="emailNotifications" name="emailNotifications" checked>
            <label for="emailNotifications">Email notifications for new products</label>
          </div>
          
          <div class="form-group checkbox">
            <input type="checkbox" id="orderUpdates" name="orderUpdates" checked>
            <label for="orderUpdates">Order status updates</label>
          </div>
          
          <div class="form-group checkbox">
            <input type="checkbox" id="promotionalEmails" name="promotionalEmails">
            <label for="promotionalEmails">Promotional emails and special offers</label>
          </div>
          
          <button type="submit" class="btn btn-primary">Save Preferences</button>
        </form>
      </div>
      
      <div class="settings-section">
        <h3>Delete Account</h3>
        <p>Once you delete your account, there is no going back. Please be certain.</p>
        <button class="btn btn-danger" id="deleteAccountBtn">Delete Account</button>
      </div>
    </div>
  `;
}

// Initialize profile page
function initProfilePage() {
  // The profile info will be updated by loadDashboardData
  // which gets data from the server
  
  // Setup form submission
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // For demonstration, just show success message
      showToast('Profile updated successfully!', 'success');
    });
  }
}

// Load order history
function loadOrderHistory() {
  // Fetch orders data
  fetch('/api/cart/orders')
    .then(response => response.json())
    .then(orders => {
      const ordersList = document.getElementById('ordersList');
      
      if (orders.length === 0) {
        ordersList.innerHTML = `
          <div class="no-orders-message">
            <p>You don't have any orders yet.</p>
            <a href="/products" class="btn btn-primary">Shop Now</a>
          </div>
        `;
        return;
      }
      
      // Clear loading message
      ordersList.innerHTML = '';
      
      // Render each order
      orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        const formattedDate = new Date(order.date).toLocaleDateString();
        
        orderCard.innerHTML = `
          <div class="order-header">
            <div>
              <h3>Order #${order.id}</h3>
              <p class="order-date">${formattedDate}</p>
            </div>
            <div class="order-status ${order.status}">${order.status}</div>
          </div>
          
          <div class="order-items">
            ${renderOrderItems(order.items)}
          </div>
          
          <div class="order-footer">
            <div class="order-total">
              <span>Total:</span>
              <span>$${order.total.toFixed(2)}</span>
            </div>
            <button class="btn btn-outline btn-sm">Download Invoice</button>
          </div>
        `;
        
        ordersList.appendChild(orderCard);
      });
    })
    .catch(error => {
      console.error('Error loading orders:', error);
      document.getElementById('ordersList').innerHTML = `
        <div class="error-message">
          <p>Failed to load your orders. Please try again later.</p>
        </div>
      `;
    });
}

// Render order items
function renderOrderItems(items) {
  if (!items || items.length === 0) return '<p>No items in this order</p>';
  
  return items.map(item => `
    <div class="order-item">
      <div class="order-item-details">
        <h4>${item.name}</h4>
        <p>Quantity: ${item.quantity}</p>
        <p>Price: $${item.price.toFixed(2)}</p>
      </div>
      ${item.code ? `
        <div class="order-item-key">
          <span class="key-label">License Key:</span>
          <span class="key-value">${item.code}</span>
        </div>
      ` : ''}
    </div>
  `).join('');
}

// Initialize settings page
function initSettingsPage() {
  // Setup notification form
  const notificationForm = document.getElementById('notificationForm');
  if (notificationForm) {
    notificationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      showToast('Settings saved successfully!', 'success');
    });
  }
  
  // Setup delete account button
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        showToast('Account deleted successfully.', 'success');
        setTimeout(() => {
          // Logout by calling the server logout endpoint
          fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          }).finally(() => {
            // Redirect to home page
            window.location.href = '/';
          });
        }, 2000);
      }
    });
  }
} 