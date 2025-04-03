// Checkout page functionality
document.addEventListener('DOMContentLoaded', () => {
  // Load the cart data from localStorage and display in order summary
  loadCartAndSummary();
  
  // Add event listener to the checkout form
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }
});

/**
 * Load cart data and display in the order summary section
 */
function loadCartAndSummary() {
  const orderSummaryElement = document.getElementById('orderSummary');
  
  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  if (!cart.length) {
    orderSummaryElement.innerHTML = `
      <div class="empty-state">
        <p>Your cart is empty. Please add items before checkout.</p>
        <a href="/" class="btn btn-primary">Browse Products</a>
      </div>
    `;
    return;
  }
  
  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;
  
  // Build the order summary HTML
  let itemsHtml = `<ul class="checkout-items">`;
  
  cart.forEach(item => {
    itemsHtml += `
      <li class="checkout-item">
        <div class="checkout-item-name">${item.name}</div>
        <div class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
      </li>
    `;
  });
  
  itemsHtml += `</ul>`;
  
  const summaryHtml = `
    ${itemsHtml}
    <div class="checkout-summary">
      <div class="checkout-row">
        <span>Subtotal</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>
      <div class="checkout-row">
        <span>Tax (10%)</span>
        <span>$${tax.toFixed(2)}</span>
      </div>
      <div class="checkout-row total">
        <span>Total</span>
        <span>$${total.toFixed(2)}</span>
      </div>
    </div>
  `;
  
  orderSummaryElement.innerHTML = summaryHtml;
}

/**
 * Handle the checkout form submission
 * @param {Event} e - Form submit event
 */
async function handleCheckoutSubmit(e) {
  e.preventDefault();
  
  const submitButton = e.target.querySelector('[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Processing...';
  
  try {
    // Get cart data
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (!cart.length) {
      showToast('Your cart is empty. Please add items before checkout.', 'error');
      return;
    }
    
    // Get form data
    const cardName = document.getElementById('cardName').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const email = document.getElementById('billingEmail').value;
    
    // For this demo, we'll just validate that fields are not empty
    // In a real app, you would use a proper payment gateway
    if (!cardName || !cardNumber || !expiryDate || !cvv || !email) {
      showToast('Please fill in all payment details', 'error');
      return;
    }
    
    // Mock payment processing - in a real app, this would be handled by a payment gateway
    // Create order on server
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: cart,
        payment: {
          email: email,
          // In a real app, you would not send full card details to your server
          // Instead, you'd use a payment processor's secure tokenization
          cardLast4: cardNumber.slice(-4)
        }
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error processing order');
    }
    
    const orderData = await response.json();
    
    // Clear the cart
    localStorage.removeItem('cart');
    
    // Redirect to order confirmation page
    window.location.href = `/order-confirmation?id=${orderData.orderId}`;
    
  } catch (error) {
    console.error('Checkout error:', error);
    showToast('Error processing your order. Please try again.', 'error');
    
    // Re-enable the submit button
    submitButton.disabled = false;
    submitButton.textContent = 'Complete Purchase';
  }
}

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error)
 */
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Show the toast
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Remove the toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
} 