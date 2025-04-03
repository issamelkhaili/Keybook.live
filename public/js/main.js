// DOM Elements
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const cartCount = document.getElementById('cartCount');

// Mobile Menu Toggle
if (mobileMenuToggle && mobileMenu) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    
    // Toggle hamburger icon animation
    const spans = mobileMenuToggle.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
      spans[0].style.transform = 'translateY(8px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
}

// Update cart count badge
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
  if (cartCount) {
    cartCount.textContent = cart.items.length;
  }
}

// Format price to currency
function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

// Toast notification
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

// Load header and footer partials
function loadPartials() {
  const headerPlaceholder = document.getElementById('header-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');
  
  if (headerPlaceholder) {
    fetch('/partials/header.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch header');
        }
        return response.text();
      })
      .then(data => {
        headerPlaceholder.innerHTML = data;
      })
      .catch(error => {
        console.error('Error loading header:', error);
        headerPlaceholder.innerHTML = '<header class="site-header"><div class="container"><a href="/">Keybook.live</a></div></header>';
      });
  }
  
  if (footerPlaceholder) {
    fetch('/partials/footer.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch footer');
        }
        return response.text();
      })
      .then(data => {
        footerPlaceholder.innerHTML = data;
      })
      .catch(error => {
        console.error('Error loading footer:', error);
        footerPlaceholder.innerHTML = '<footer class="site-footer"><div class="container"><p>&copy; 2024 Keybook.live</p></div></footer>';
      });
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Load header and footer
  loadPartials();
  
  // Update cart count
  updateCartCount();
});