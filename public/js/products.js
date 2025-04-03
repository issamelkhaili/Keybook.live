// public/js/products.js
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const productsGrid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchProducts');
    const filterToggle = document.getElementById('filterToggle');
    const sidebar = document.getElementById('productsSidebar');
    const applyPriceBtn = document.getElementById('applyPriceFilter');
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    
    // Product template
    const productTemplate = document.getElementById('productCardTemplate');
    
    // Current filter state
    let filters = {
      search: '',
      category: 'all',
      minPrice: null,
      maxPrice: null
    };
    
    // Fetch products from API
    function fetchProducts() {
      // Build query string from filters
      let queryParams = [];
      
      if (filters.search) {
        queryParams.push(`search=${encodeURIComponent(filters.search)}`);
      }
      
      if (filters.category && filters.category !== 'all') {
        queryParams.push(`category=${encodeURIComponent(filters.category)}`);
      }
      
      if (filters.minPrice !== null) {
        queryParams.push(`minPrice=${filters.minPrice}`);
      }
      
      if (filters.maxPrice !== null) {
        queryParams.push(`maxPrice=${filters.maxPrice}`);
      }
      
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      
      // Show loading state
      if (productsGrid) {
        productsGrid.innerHTML = '<div class="loading">Loading products...</div>';
      }
      
      // Fetch products from API
      fetch(`/api/products${queryString}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
          return response.json();
        })
        .then(products => {
          renderProducts(products);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
          if (productsGrid) {
            productsGrid.innerHTML = '<div class="error">Failed to load products. Please try again later.</div>';
          }
        });
    }
    
    // Render products to grid
    function renderProducts(products) {
      if (!productsGrid || !productTemplate) return;
      
      // Clear products grid
      productsGrid.innerHTML = '';
      
      if (products.length === 0) {
        productsGrid.innerHTML = '<div class="no-results">No products found. Try adjusting your filters.</div>';
        return;
      }
      
      // Loop through products and create cards
      products.forEach(product => {
        // Clone template
        const productCard = document.importNode(productTemplate.content, true);
        
        // Set product data
        productCard.querySelector('.product-card').dataset.id = product.id;
        productCard.querySelector('.product-category').textContent = product.category;
        productCard.querySelector('h3').textContent = product.name;
        productCard.querySelector('p').textContent = product.description;
        productCard.querySelector('.price').textContent = `$${product.price.toFixed(2)}`;
        
        // Set product image
        const imgElement = productCard.querySelector('.product-image img');
        imgElement.src = product.image || '/images/placeholder.jpg';
        imgElement.alt = product.name;
        
        // Set buttons
        productCard.querySelector('.add-to-cart').dataset.id = product.id;
        productCard.querySelector('.view-product').href = `/product/${product.id}`;
        
        // Add to grid
        productsGrid.appendChild(productCard);
      });
      
      // Setup add to cart buttons
      setupAddToCartButtons();
    }
    
    // Setup add to cart buttons
    function setupAddToCartButtons() {
      const addToCartButtons = document.querySelectorAll('.add-to-cart');
      
      addToCartButtons.forEach(button => {
        button.addEventListener('click', async () => {
          const productId = button.dataset.id;
          
          try {
            // Fetch product data
            const response = await fetch(`/api/products/${productId}`);
            
            if (!response.ok) {
              throw new Error('Failed to fetch product');
            }
            
            const product = await response.json();
            
            // Check if cart is available before using it
            if (typeof cart !== 'undefined' && typeof cart.addItem === 'function') {
              cart.addItem(product, 1);
            } else {
              console.error('Cart functionality not available');
              if (typeof showToast === 'function') {
                showToast('Unable to add to cart. Please refresh the page and try again.', 'error');
              } else {
                alert('Unable to add to cart. Please refresh the page and try again.');
              }
            }
          } catch (error) {
            console.error('Error adding product to cart:', error);
            if (typeof showToast === 'function') {
              showToast('Failed to add product to cart', 'error');
            } else {
              alert('Failed to add product to cart');
            }
          }
        });
      });
    }
    
    // Initialize event listeners
    function initEventListeners() {
      // Search input
      if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
          filters.search = e.target.value;
          fetchProducts();
        }, 300));
      }
      
      // Filter toggle (mobile)
      if (filterToggle && sidebar) {
        filterToggle.addEventListener('click', () => {
          sidebar.classList.toggle('active');
        });
      }
      
      // Category filters
      categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          // Uncheck other category checkboxes
          if (checkbox.checked && checkbox.value !== 'all') {
            categoryCheckboxes.forEach(cb => {
              if (cb !== checkbox && cb.value !== 'all') {
                cb.checked = false;
              }
            });
            filters.category = checkbox.value;
          } else if (checkbox.checked && checkbox.value === 'all') {
            // If "All" is checked, uncheck others
            categoryCheckboxes.forEach(cb => {
              if (cb !== checkbox) {
                cb.checked = false;
              }
            });
            filters.category = 'all';
          }
          
          fetchProducts();
        });
      });
      
      // Price filter
      if (applyPriceBtn) {
        applyPriceBtn.addEventListener('click', () => {
          const minPrice = document.getElementById('minPrice').value;
          const maxPrice = document.getElementById('maxPrice').value;
          
          filters.minPrice = minPrice ? parseFloat(minPrice) : null;
          filters.maxPrice = maxPrice ? parseFloat(maxPrice) : null;
          
          fetchProducts();
        });
      }
    }
    
    // Debounce helper function
    function debounce(func, delay) {
      let timeoutId;
      return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    }
    
    // Initialize
    initEventListeners();
    fetchProducts();
  });