// public/js/auth.js
// Auth functionality
document.addEventListener('DOMContentLoaded', () => {
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const loginButton = document.getElementById('loginButton');
      const loginError = document.getElementById('loginError');
      
      // Basic validation
      if (!email || !password) {
        loginError.textContent = 'Please enter both email and password';
        loginError.style.display = 'block';
        return;
      }
      
      // Disable button and show loading state
      loginButton.disabled = true;
      loginButton.textContent = 'Signing in...';
      loginError.style.display = 'none';
      
      try {
        // Call the login API
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include' // Include cookies in the request
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }
        
        // Store auth data in localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        localStorage.setItem('lastLogin', Date.now().toString());
        
        // Show success message
        showToast('Login successful!', 'success');
        
        // Redirect to dashboard or requested page
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect') || '/dashboard';
        
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1000);
        
      } catch (error) {
        console.error('Login error:', error);
        loginError.textContent = error.message || 'Invalid email or password';
        loginError.style.display = 'block';
      } finally {
        loginButton.disabled = false;
        loginButton.textContent = 'Sign In';
      }
    });
  }
  
  // Register form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const registerButton = document.getElementById('registerButton');
      const registerError = document.getElementById('registerError');
      
      // Validate form
      if (!name || !email || !password) {
        registerError.textContent = 'All fields are required';
        registerError.style.display = 'block';
        return;
      }
      
      if (password !== confirmPassword) {
        registerError.textContent = 'Passwords do not match';
        registerError.style.display = 'block';
        return;
      }
      
      // Disable button and show loading state
      registerButton.disabled = true;
      registerButton.textContent = 'Creating account...';
      registerError.style.display = 'none';
      
      try {
        // Call the register API
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
          credentials: 'include' // Include cookies in the request
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }
        
        // Store auth data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        localStorage.setItem('lastLogin', Date.now().toString());
        
        // Show success message
        showToast('Account created successfully!', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
        
      } catch (error) {
        console.error('Registration error:', error);
        registerError.textContent = error.message || 'An error occurred. Please try again.';
        registerError.style.display = 'block';
      } finally {
        registerButton.disabled = false;
        registerButton.textContent = 'Create Account';
      }
    });
  }
  
  // Logout functionality
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        // Call logout API
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include' // Include cookies in the request
        });
        
        // Clear local storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        
        // Redirect to home page
        window.location.href = '/';
      } catch (error) {
        console.error('Logout error:', error);
      }
    });
  }
  
  // Check auth status for header
  checkAuthStatus();
});

// Check if user is logged in
function checkAuthStatus() {
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('userData');
  
  if (token && userData) {
    // User is logged in
    const user = JSON.parse(userData);
    
    // Update auth buttons in header
    const authButtons = document.getElementById('authButtons');
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
    }
    
    // Update mobile menu
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
      const loginLink = mobileMenu.querySelector('a[href="/login"]');
      const registerLink = mobileMenu.querySelector('a[href="/register"]');
      
      if (loginLink) {
        loginLink.href = '/dashboard';
        loginLink.textContent = 'Dashboard';
      }
      
      if (registerLink) {
        registerLink.href = '/cart';
        registerLink.textContent = 'My Cart';
      }
      
      // Add logout link to mobile menu if it doesn't exist
      if (!mobileMenu.querySelector('.logout-link')) {
        const logoutLi = document.createElement('li');
        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.className = 'logout-link';
        logoutLink.textContent = 'Logout';
        logoutLink.addEventListener('click', async (e) => {
          e.preventDefault();
          try {
            await fetch('/api/auth/logout', {
              method: 'POST',
              credentials: 'include'
            });
            
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            window.location.href = '/';
          } catch (error) {
            console.error('Logout error:', error);
          }
        });
        
        logoutLi.appendChild(logoutLink);
        mobileMenu.querySelector('ul').appendChild(logoutLi);
      }
    }
  } else {
    // User is not logged in, show default login/register buttons
    const authButtons = document.getElementById('authButtons');
    if (authButtons) {
      authButtons.innerHTML = `
        <a href="/login" class="btn btn-outline">Sign In</a>
        <a href="/register" class="btn btn-primary">Sign Up</a>
      `;
    }
    
    // Reset mobile menu to default
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
      const dashboardLink = mobileMenu.querySelector('a[href="/dashboard"]');
      const logoutLink = mobileMenu.querySelector('.logout-link');
      
      if (dashboardLink) {
        dashboardLink.href = '/login';
        dashboardLink.textContent = 'Sign In';
      }
      
      if (logoutLink) {
        logoutLink.parentElement.remove();
      }
    }
    
    // Verify with server in case token in cookie exists but not in localStorage
    fetch('/api/auth/verify', {
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      if (data.authenticated) {
        // Store user data in localStorage
        localStorage.setItem('authToken', 'restored');
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        // Refresh page to update UI
        window.location.reload();
      }
    })
    .catch(error => {
      console.error('Auth verification error:', error);
    });
  }
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