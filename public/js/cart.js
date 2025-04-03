// Cart functionality
class Cart {
    constructor() {
      this.items = [];
      this.total = 0;
      this.init();
    }
    
    init() {
      // Load cart from localStorage
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const { items, total } = JSON.parse(savedCart);
        this.items = items || [];
        this.total = total || 0;
      }
      
      // Update UI
      this.updateCartCount();
      
      // Initialize cart page if applicable
      if (window.location.pathname === '/cart') {
        this.renderCart();
      }
    }
    
    addItem(product, quantity = 1) {
      // Check if product already exists in cart
      const existingItemIndex = this.items.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Update quantity if already exists
        this.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image || '/images/placeholder.jpg'
        });
      }
      
      // Update total
      this.calculateTotal();
      
      // Save to localStorage
      this.saveCart();
      
      // Update UI
      this.updateCartCount();
      
      return this.items;
    }
    
    removeItem(id) {
      this.items = this.items.filter(item => item.id !== id);
      this.calculateTotal();
      this.saveCart();
      this.updateCartCount();
      
      // If on cart page, update the cart UI
      if (window.location.pathname === '/cart') {
        this.renderCart();
      }
      
      return this.items;
    }
    
    updateQuantity(id, quantity) {
      if (quantity <= 0) {
        return this.removeItem(id);
      }
      
      const itemIndex = this.items.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        this.items[itemIndex].quantity = quantity;
        this.calculateTotal();
        this.saveCart();
        
        // If on cart page, update the cart UI
        if (window.location.pathname === '/cart') {
          this.updateCartItemUI(id, quantity);
        }
      }
      
      return this.items;
    }
    
    updateCartItemUI(id, quantity) {
      const itemRow = document.querySelector(`.cart-item[data-id="${id}"]`);
      if (itemRow) {
        const quantityDisplay = itemRow.querySelector('.quantity-display');
        const itemTotal = itemRow.querySelector('.cart-item-total');
        const item = this.items.find(item => item.id === id);
        
        if (quantityDisplay && item) {
          quantityDisplay.textContent = quantity;
        }
        
        if (itemTotal && item) {
          const totalPrice = (item.price * quantity).toFixed(2);
          itemTotal.innerHTML = `$${totalPrice} <button class="remove-item" data-id="${id}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>`;
          
          // Reattach event listener to remove button
          const removeBtn = itemTotal.querySelector('.remove-item');
          if (removeBtn) {
            removeBtn.addEventListener('click', () => {
              this.removeItem(id);
              showToast('Item removed from cart', 'success');
            });
          }
        }
        
        // Update summary if it exists
        this.updateCartSummary();
      }
    }
    
    updateCartSummary() {
      const cartSummary = document.getElementById('cartSummary');
      if (cartSummary) {
        const subtotal = this.total;
        const taxes = subtotal * 0.1; // 10% tax rate
        const total = subtotal + taxes;
        
        const subtotalElement = cartSummary.querySelector('.summary-row:nth-child(1) .summary-value');
        const taxesElement = cartSummary.querySelector('.summary-row:nth-child(2) .summary-value');
        const totalElement = cartSummary.querySelector('.summary-row.total .summary-value');
        
        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (taxesElement) taxesElement.textContent = `$${taxes.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
      }
    }
    
    clearCart() {
      this.items = [];
      this.total = 0;
      this.saveCart();
      this.updateCartCount();
      
      // If on cart page, update the cart UI
      if (window.location.pathname === '/cart') {
        this.renderCart();
      }
      
      return this.items;
    }
    
    calculateTotal() {
      this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return this.total;
    }
    
    saveCart() {
      localStorage.setItem('cart', JSON.stringify({
        items: this.items,
        total: this.total
      }));
    }
    
    updateCartCount() {
      const cartCountElement = document.getElementById('cartCount');
      if (cartCountElement) {
        cartCountElement.textContent = this.items.length;
      }
    }
    
    renderCart() {
      const cartContainer = document.getElementById('cartContainer');
      if (!cartContainer) return;
      
      if (this.items.length === 0) {
        cartContainer.innerHTML = `
          <div class="cart-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h2>Your cart is empty</h2>
            <p>Add some products to your cart and they will appear here</p>
            <a href="/products" class="btn btn-primary">Continue Shopping</a>
          </div>
        `;
        
        // Hide summary if it exists
        const cartSummary = document.getElementById('cartSummary');
        if (cartSummary) {
          cartSummary.style.display = 'none';
        }
        
        return;
      }
      
      // Show cart items
      cartContainer.innerHTML = `
        <div class="cart-items">
          <div class="cart-header">
            <div>Product</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Total</div>
          </div>
          ${this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
              <div class="cart-item-info">
                <div class="cart-item-image">
                  <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                  <h3>${item.name}</h3>
                  <p>ID: ${item.id}</p>
                </div>
              </div>
              <div class="cart-item-price">$${item.price.toFixed(2)}</div>
              <div class="cart-item-quantity">
                <div class="quantity-controls">
                  <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                  <div class="quantity-display">${item.quantity}</div>
                  <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
              </div>
              <div class="cart-item-total">
                $${(item.price * item.quantity).toFixed(2)}
                <button class="remove-item" data-id="${item.id}">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="cart-actions">
          <a href="/products" class="btn btn-outline">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
              <path d="M19 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Continue Shopping
          </a>
          
          <button class="btn btn-outline btn-danger" id="clearCart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
              <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Clear Cart
          </button>
        </div>
      `;
      
      // Show and update summary
      const cartSummary = document.getElementById('cartSummary');
      if (cartSummary) {
        cartSummary.style.display = 'block';
        
        const subtotal = this.total;
        const taxes = subtotal * 0.1; // 10% tax rate
        const total = subtotal + taxes;
        
        cartSummary.innerHTML = `
          <h2>Order Summary</h2>
          
          <div class="summary-row">
            <div class="summary-label">Subtotal</div>
            <div class="summary-value">$${subtotal.toFixed(2)}</div>
          </div>
          
          <div class="summary-row">
            <div class="summary-label">Taxes (10%)</div>
            <div class="summary-value">$${taxes.toFixed(2)}</div>
          </div>
          
          <div class="summary-row">
            <div class="summary-label">Shipping</div>
            <div class="summary-value">Free</div>
          </div>
          
          <div class="summary-row total">
            <div class="summary-label">Total</div>
            <div class="summary-value">$${total.toFixed(2)}</div>
          </div>
          
          <button class="btn btn-primary btn-block mt-4" id="checkoutBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
              <path d="M17 9V7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3 9H21V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Proceed to Checkout
          </button>
          
          <div class="summary-note">
            Secure payment processing. All transactions are encrypted.
          </div>
        `;
        
        // Add checkout button event listener
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
          checkoutBtn.addEventListener('click', () => {
            // Check if user is logged in
            const token = localStorage.getItem('authToken');
            
            if (!token) {
              // Not logged in, redirect to login
              window.location.href = '/login?redirect=/checkout';
              return;
            }
            
            // In a real app, this would redirect to checkout
            showToast('Redirecting to checkout...', 'success');
            setTimeout(() => {
              window.location.href = '/checkout';
            }, 1500);
          });
        }
      }
      
      // Add event listeners for quantity buttons and remove buttons
      const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
      const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
      const removeButtons = document.querySelectorAll('.remove-item');
      const clearCartButton = document.getElementById('clearCart');
      
      decreaseButtons.forEach(button => {
        button.addEventListener('click', () => {
          const id = button.getAttribute('data-id');
          const item = this.items.find(item => item.id === id);
          if (item) {
            this.updateQuantity(id, Math.max(1, item.quantity - 1));
          }
        });
      });
      
      increaseButtons.forEach(button => {
        button.addEventListener('click', () => {
          const id = button.getAttribute('data-id');
          const item = this.items.find(item => item.id === id);
          if (item) {
            this.updateQuantity(id, item.quantity + 1);
          }
        });
      });
      
      removeButtons.forEach(button => {
        button.addEventListener('click', () => {
          const id = button.getAttribute('data-id');
          this.removeItem(id);
          showToast('Item removed from cart', 'success');
        });
      });
      
      if (clearCartButton) {
        clearCartButton.addEventListener('click', () => {
          if (confirm('Are you sure you want to clear your cart?')) {
            this.clearCart();
            showToast('Cart cleared', 'success');
          }
        });
      }
    }
  }
  
  // Initialize cart
  const cart = new Cart();
  
  // Add to cart functionality for product pages
  document.addEventListener('DOMContentLoaded', () => {
    // Event delegation for add to cart buttons
    document.addEventListener('click', (e) => {
      // Check if the clicked element is an add-to-cart button or its child
      const addToCartBtn = e.target.closest('.add-to-cart');
      if (addToCartBtn) {
        e.preventDefault();
        
        // Get product information
        const productCard = addToCartBtn.closest('.product-card');
        if (productCard) {
          const id = productCard.getAttribute('data-id');
          const name = productCard.querySelector('h3').textContent;
          const priceText = productCard.querySelector('.price').textContent;
          const price = parseFloat(priceText.replace('$', ''));
          
          // Get image src or use placeholder
          let image = '/images/placeholder.jpg';
          const imgElement = productCard.querySelector('img');
          if (imgElement) {
            image = imgElement.src;
          }
          
          // Add to cart
          cart.addItem({ id, name, price, image }, 1);
          
          // Show success message
          showToast(`${name} added to cart`, 'success');
        }
      }
    });
    
    // Initialize cart on cart page
    if (window.location.pathname === '/cart') {
      cart.renderCart();
    }
    
    // Product detail page - Add to cart
    const addToCartDetailBtn = document.getElementById('addToCartDetail');
    if (addToCartDetailBtn) {
      addToCartDetailBtn.addEventListener('click', () => {
        const productId = addToCartDetailBtn.getAttribute('data-id');
        const productName = document.querySelector('.product-detail-title').textContent;
        const productPrice = parseFloat(document.querySelector('.product-detail-price').textContent.replace('$', ''));
        const quantityInput = document.getElementById('quantity');
        const quantity = quantityInput ? parseInt(quantityInput.textContent) : 1;
        
        // Add to cart
        cart.addItem({
          id: productId,
          name: productName,
          price: productPrice,
          image: '/images/placeholder.jpg' // This should be updated with actual image
        }, quantity);
        
        // Show success message
        showToast(`${productName} added to cart`, 'success');
      });
    }
    
    // Buy now button
    const buyNowBtn = document.getElementById('buyNowBtn');
    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', () => {
        const productId = document.getElementById('addToCartDetail').getAttribute('data-id');
        const productName = document.querySelector('.product-detail-title').textContent;
        const productPrice = parseFloat(document.querySelector('.product-detail-price').textContent.replace('$', ''));
        const quantityInput = document.getElementById('quantity');
        const quantity = quantityInput ? parseInt(quantityInput.textContent) : 1;
        
        // Add to cart
        cart.addItem({
          id: productId,
          name: productName,
          price: productPrice,
          image: '/images/placeholder.jpg'
        }, quantity);
        
        // Redirect to cart
        window.location.href = '/cart';
      });
    }
  });