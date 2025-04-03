// cart.js - Shopping cart functionality

// Cart object for managing cart data
const cart = {
  items: [],
  total: 0,
  
  // Initialize cart from localStorage
  init() {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    this.items = savedCart || [];
    this.calculateTotal();
    this.updateCartCount();
  },
  
  // Save cart to localStorage
  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.updateCartCount();
  },
  
  // Add item to cart
  addItem(product, quantity = 1) {
    quantity = parseInt(quantity);
    
    // Check if item already exists in cart
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
    } else {
      // Add new item
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '/images/placeholder.jpg',
        quantity: quantity
      });
    }
    
    // Recalculate total
    this.calculateTotal();
    this.save();
    
    // Show success message
    if (typeof showToast === 'function') {
      showToast(`${product.name} added to cart`, 'success');
    }
    
    return true;
  },
  
  // Update item quantity
  updateQuantity(id, quantity) {
    quantity = parseInt(quantity);
    
    // Find item
    const item = this.items.find(item => item.id === id);
    
    if (item) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return this.removeItem(id);
      } else {
        // Update quantity
        item.quantity = quantity;
        this.calculateTotal();
        this.save();
        return true;
      }
    }
    
    return false;
  },
  
  // Remove item from cart
  removeItem(id) {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== id);
    
    if (this.items.length !== initialLength) {
      this.calculateTotal();
      this.save();
      return true;
    }
    
    return false;
  },
  
  // Clear all items from cart
  clear() {
    this.items = [];
    this.total = 0;
    this.save();
  },
  
  // Calculate cart total
  calculateTotal() {
    this.total = this.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  },
  
  // Update cart count in header
  updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      // Sum all quantities
      const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = count;
      
      // Make cart icon visible if items in cart
      if (count > 0) {
        cartCount.style.display = 'flex';
      } else {
        cartCount.style.display = 'none';
      }
    }
  }
};

// Function to get product data
function fetchProduct(id) {
  return new Promise((resolve, reject) => {
    fetch(`/api/products/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Product not found');
        }
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        reject(error);
      });
  });
}

// Render cart on cart page
function renderCart() {
  const cartContent = document.getElementById('cart-content');
  
  if (!cartContent) return;
  
  if (cart.items.length === 0) {
    // Cart is empty
    cartContent.innerHTML = `
      <div class="cart-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <a href="/products" class="btn btn-primary">Continue Shopping</a>
      </div>
    `;
    
    return;
  }
  
  // Cart has items
  let cartHTML = `
    <div class="cart-grid">
      <div class="cart-items">
        <div class="cart-header">
          <div>Product</div>
          <div>Price</div>
          <div>Quantity</div>
          <div>Total</div>
        </div>
  `;
  
  // Add cart items
  cart.items.forEach(item => {
    cartHTML += `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-info">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <h3>${item.name}</h3>
            <p>Product ID: ${item.id}</p>
          </div>
        </div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-quantity">
          <div class="quantity-controls">
            <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
            <div class="quantity-display">${item.quantity}</div>
            <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="cart-item-total">
          $${(item.price * item.quantity).toFixed(2)}
          <button class="remove-item" data-id="${item.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  });
  
  // Cart actions
  cartHTML += `
        <div class="cart-actions">
          <button class="btn btn-outline" id="clearCart">Clear Cart</button>
          <a href="/products" class="btn btn-outline">Continue Shopping</a>
        </div>
      </div>
      <div class="cart-summary">
        <h2>Order Summary</h2>
        <div class="summary-row">
          <span class="summary-label">Subtotal</span>
          <span>$${cart.total.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Shipping</span>
          <span>$0.00</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Tax</span>
          <span>$${(cart.total * 0.1).toFixed(2)}</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span>$${(cart.total * 1.1).toFixed(2)}</span>
        </div>
        <a href="/checkout" class="btn btn-primary btn-block" id="checkout">Proceed to Checkout</a>
        <p class="summary-note">Taxes and shipping calculated at checkout</p>
      </div>
    </div>
  `;
  
  cartContent.innerHTML = cartHTML;
  
  // Setup event listeners for cart page
  setupCartEventListeners();
}

// Setup event listeners for cart page
function setupCartEventListeners() {
  // Clear cart button
  const clearCartButton = document.getElementById('clearCart');
  if (clearCartButton) {
    clearCartButton.addEventListener('click', () => {
      cart.clear();
      renderCart();
    });
  }
  
  // Quantity buttons
  const decreaseButtons = document.querySelectorAll('.decrease-quantity');
  decreaseButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      const item = cart.items.find(item => item.id === id);
      if (item) {
        cart.updateQuantity(id, item.quantity - 1);
        renderCart();
      }
    });
  });
  
  const increaseButtons = document.querySelectorAll('.increase-quantity');
  increaseButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      const item = cart.items.find(item => item.id === id);
      if (item) {
        cart.updateQuantity(id, item.quantity + 1);
        renderCart();
      }
    });
  });
  
  // Remove item buttons
  const removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const id = e.target.closest('.remove-item').dataset.id;
      cart.removeItem(id);
      renderCart();
    });
  });
  
  // Changed the checkout button to a link, no need for event listener
}

// Setup event listeners for add to cart buttons
function setupAddToCartButtons() {
  const addToCartButton = document.getElementById('addToCart');
  
  if (addToCartButton) {
    addToCartButton.addEventListener('click', async () => {
      const productId = addToCartButton.dataset.productId;
      
      if (!productId) {
        console.error('No product ID found');
        return;
      }
      
      // Get quantity
      const quantityInput = document.getElementById('quantity');
      const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
      
      try {
        // Fetch product data
        const product = await fetchProduct(productId);
        
        // Add to cart
        cart.addItem(product, quantity);
        
        // Optional: redirect to cart
        // window.location.href = '/cart';
      } catch (error) {
        console.error('Error adding to cart:', error);
        if (typeof showToast === 'function') {
          showToast('Error adding product to cart', 'error');
        }
      }
    });
  }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart
  cart.init();
  
  // Render cart if on cart page
  renderCart();
  
  // Setup add to cart buttons
  setupAddToCartButtons();
});