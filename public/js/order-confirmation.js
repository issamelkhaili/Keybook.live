// Order confirmation page functionality
document.addEventListener('DOMContentLoaded', () => {
  // Get the order ID from the URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('id');
  
  if (orderId) {
    loadOrderDetails(orderId);
  } else {
    showError('No order ID provided');
  }
  
  // Set up event delegation for copy buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('copy-btn')) {
      const keyText = e.target.previousElementSibling.textContent;
      copyToClipboard(keyText, e.target);
    }
  });
});

/**
 * Load order details from the server
 * @param {string} orderId - The order ID to load
 */
async function loadOrderDetails(orderId) {
  const orderDetailsElement = document.getElementById('orderDetails');
  
  try {
    const response = await fetch(`/api/orders/${orderId}`);
    
    if (!response.ok) {
      throw new Error('Failed to load order details');
    }
    
    const orderData = await response.json();
    
    // Render order details
    orderDetailsElement.innerHTML = renderOrderDetails(orderData);
    
  } catch (error) {
    console.error('Error loading order:', error);
    showError('Unable to load order details. Please contact support for assistance.');
  }
}

/**
 * Render the order details HTML
 * @param {Object} order - The order data
 * @returns {string} HTML for the order details
 */
function renderOrderDetails(order) {
  // Format the date
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Build the order info section
  const orderInfo = `
    <div class="order-info">
      <div class="order-info-block">
        <h3>Order Information</h3>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Date:</strong> ${orderDate}</p>
        <p><strong>Status:</strong> <span class="status-${order.status.toLowerCase()}">${order.status}</span></p>
      </div>
      <div class="order-info-block">
        <h3>Customer Information</h3>
        <p><strong>Email:</strong> ${order.payment.email}</p>
        <p><strong>Payment:</strong> Card ending in ${order.payment.cardLast4}</p>
      </div>
    </div>
  `;
  
  // Build the items list with license keys
  let itemsHtml = `<div class="order-items-container"><h3>Order Items</h3><ul class="order-items">`;
  
  order.items.forEach(item => {
    itemsHtml += `
      <li class="order-item">
        <div class="item-details">
          <div class="item-name">${item.name}</div>
          <div class="item-quantity">Qty: ${item.quantity}</div>
          ${item.licenseKey ? `
            <div class="license-key-container">
              <div class="license-key-label">License Key:</div>
              <div class="license-key">${item.licenseKey}</div>
              <button class="copy-btn">Copy</button>
            </div>
          ` : ''}
        </div>
        <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
      </li>
    `;
  });
  
  itemsHtml += `</ul></div>`;
  
  // Calculate totals
  const subtotal = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;
  
  // Build the totals section
  const summaryHtml = `
    <div class="order-summary">
      <div class="summary-row">
        <span>Subtotal</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>
      <div class="summary-row">
        <span>Tax (10%)</span>
        <span>$${tax.toFixed(2)}</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span>$${total.toFixed(2)}</span>
      </div>
    </div>
  `;
  
  return `${orderInfo}${itemsHtml}${summaryHtml}`;
}

/**
 * Show an error message
 * @param {string} message - Error message to display
 */
function showError(message) {
  const orderDetailsElement = document.getElementById('orderDetails');
  orderDetailsElement.innerHTML = `
    <div class="error-state">
      <p>${message}</p>
      <a href="/" class="btn btn-primary">Return to Home</a>
    </div>
  `;
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @param {HTMLElement} button - Button element that was clicked
 */
function copyToClipboard(text, button) {
  const originalText = button.textContent;
  
  navigator.clipboard.writeText(text)
    .then(() => {
      // Update button text to indicate success
      button.textContent = 'Copied!';
      
      // Reset button text after 2 seconds
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    })
    .catch(err => {
      console.error('Failed to copy text: ', err);
      // Update button text to indicate failure
      button.textContent = 'Failed to copy';
      
      // Reset button text after 2 seconds
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    });
} 