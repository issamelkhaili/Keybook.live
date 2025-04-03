// public/js/auth.js
// Auth functionality
document.addEventListener('DOMContentLoaded', () => {
  // Setup auth status check
  checkAuthStatus();
  
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const loginButton = document.getElementById('loginButton');
      const errorContainer = document.getElementById('loginError');
      
      // Reset UI
      loginButton.disabled = true;
      errorContainer.style.display = 'none';
      
      try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Redirect to dashboard
          window.location.href = '/dashboard';
        } else {
          errorContainer.textContent = data.message || 'Login failed';
          errorContainer.style.display = 'block';
        }
      } catch (error) {
        console.error('Login error:', error);
        errorContainer.textContent = 'An error occurred. Please try again.';
        errorContainer.style.display = 'block';
      } finally {
        loginButton.disabled = false;
      }
    });
  }
  
  // Register form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const registerButton = document.getElementById('registerButton');
      const errorContainer = document.getElementById('registerError');
      
      // Reset UI
      registerButton.disabled = true;
      errorContainer.style.display = 'none';
      
      // Get form values
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      // Validate passwords match
      if (password !== confirmPassword) {
        errorContainer.textContent = 'Passwords do not match';
        errorContainer.style.display = 'block';
        registerButton.disabled = false;
        return;
      }
      
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Redirect to dashboard
          window.location.href = '/dashboard';
        } else {
          errorContainer.textContent = data.message || 'Registration failed';
          errorContainer.style.display = 'block';
        }
      } catch (error) {
        console.error('Registration error:', error);
        errorContainer.textContent = 'An error occurred. Please try again.';
        errorContainer.style.display = 'block';
      } finally {
        registerButton.disabled = false;
      }
    });
  }
});

// Check authentication status from server
window.checkAuthStatus = function() {
  // Fetch auth status from server
  fetch('/api/auth/verify')
    .then(response => response.json())
    .then(data => {
      if (data.authenticated && data.user) {
        // User is logged in - update UI with server data
        updateAuthUI(data.user);
      } else {
        // User is not logged in
        updateAuthUI(null);
      }
    })
    .catch(error => {
      console.error('Auth verification error:', error);
      // In case of error, assume not logged in
      updateAuthUI(null);
    });
};

// Update UI based on authentication status
function updateAuthUI(user) {
  // Get auth elements
  const authButtons = document.getElementById('authButtons');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (user) {
    // User is logged in
    if (authButtons) {
      authButtons.innerHTML = `
        <a href="/dashboard" class="btn btn-outline">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${user.name || 'Dashboard'}
        </a>
      `;
      
      // Add admin link if user is admin
      if (user.role === 'ADMIN') {
        authButtons.innerHTML += `
          <a href="/admin" class="btn btn-primary">Admin Panel</a>
        `;
      }
    }
    
    // Update mobile menu
    if (mobileMenu) {
      const menuList = mobileMenu.querySelector('ul');
      if (menuList) {
        menuList.innerHTML = `
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/cart">My Cart</a></li>
          ${user.role === 'ADMIN' ? '<li><a href="/admin">Admin Panel</a></li>' : ''}
          <li><a href="#" class="logout-link">Logout</a></li>
        `;
        
        // Add logout handler
        const logoutLink = menuList.querySelector('.logout-link');
        if (logoutLink) {
          logoutLink.addEventListener('click', handleLogout);
        }
      }
    }
  } else {
    // User is not logged in
    if (authButtons) {
      authButtons.innerHTML = `
        <a href="/login" class="btn btn-outline">Sign In</a>
        <a href="/register" class="btn btn-primary">Sign Up</a>
      `;
    }
    
    // Reset mobile menu
    if (mobileMenu) {
      const menuList = mobileMenu.querySelector('ul');
      if (menuList) {
        menuList.innerHTML = `
          <li><a href="/login">Sign In</a></li>
          <li><a href="/register">Sign Up</a></li>
        `;
      }
    }
  }
  
  // Setup logout buttons
  setupLogoutButtons();
}

// Handle logout process
async function handleLogout(e) {
  if (e) e.preventDefault();
  
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      // Redirect to login
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Setup all logout buttons
function setupLogoutButtons() {
  const logoutButtons = document.querySelectorAll('#logoutBtn, .logout-link, #adminLogout, #adminLogoutMenu');
  
  logoutButtons.forEach(button => {
    if (button) {
      // Remove any existing listeners
      button.removeEventListener('click', handleLogout);
      // Add fresh listener
      button.addEventListener('click', handleLogout);
    }
  });
}

// Toast notification function
function showToast(message, type = 'success') {
  // Check if toast container exists, if not create it
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .toast-container {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        z-index: 1000;
      }
      .toast {
        background-color: var(--card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 1rem;
        margin-top: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        max-width: 300px;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
      }
      .toast.show {
        transform: translateX(0);
        opacity: 1;
      }
      .toast.success {
        border-left: 4px solid #10b981;
      }
      .toast.error {
        border-left: 4px solid #ef4444;
      }
      .toast-icon {
        margin-right: 0.75rem;
        flex-shrink: 0;
      }
      .toast-message {
        font-size: 0.875rem;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  // Set icon based on type
  let icon = '';
  if (type === 'success') {
    icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toast-icon">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>`;
  } else if (type === 'error') {
    icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toast-icon">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>`;
  }
  
  toast.innerHTML = `
    ${icon}
    <div class="toast-message">${message}</div>
  `;
  
  toastContainer.appendChild(toast);
  
  // Show toast with animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, 3000);
}

// Simple check if user is on dashboard or protected page
function checkPageAccess() {
  // We'll check with the server on protected pages
  if (window.location.pathname.includes('/dashboard') || 
      window.location.pathname.includes('/admin')) {
    
    fetch('/api/auth/verify')
      .then(response => {
        if (!response.ok) {
          // Redirect to login if not authenticated
          window.location.href = '/login';
        }
      })
      .catch(error => {
        console.error('Auth check error:', error);
        window.location.href = '/login';
      });
  }
}