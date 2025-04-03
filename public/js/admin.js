// public/js/admin.js
document.addEventListener('DOMContentLoaded', () => {
    // Add admin style fixes
    addAdminStyleFixes();
    
    // Initialize admin panel
    initAdminPanel();
    
    // Check auth status
    checkAdminAuth();
    
    // Set the active page based on URL
    setActivePageFromUrl();
    
    // Load initial data for current page
    loadDataForCurrentPage();
  });
  
  // Style fixes for admin panel
  function addAdminStyleFixes() {
    // Add admin-specific styles
    document.body.classList.add('admin-panel');
    
    // Add icons to sidebar items
    const iconMap = {
      'dashboard': 'icon-dashboard',
      'products': 'icon-products',
      'orders': 'icon-orders',
      'users': 'icon-users',
      'settings': 'icon-settings'
    };
    
    // Add icons to nav items
    const navItems = document.querySelectorAll('.admin-nav-item');
    navItems.forEach(item => {
      const pageId = item.getAttribute('data-page');
      if (pageId && iconMap[pageId]) {
        // Check if icon already exists
        if (!item.querySelector('i')) {
          const iconElement = document.createElement('i');
          iconElement.className = iconMap[pageId];
          item.prepend(iconElement);
        }
      }
    });
  }
  
  // Set active page from URL
  function setActivePageFromUrl() {
    const path = window.location.pathname;
    let activePage = 'dashboard';
    
    if (path.includes('/admin/products')) {
      activePage = 'products';
    } else if (path.includes('/admin/orders')) {
      activePage = 'orders';
    } else if (path.includes('/admin/users')) {
      activePage = 'users';
    } else if (path.includes('/admin/settings')) {
      activePage = 'settings';
    }
    
    // Find and activate the corresponding nav item
    setActivePage(activePage);
  }
  
  // Set active page and show corresponding content
  function setActivePage(pageId) {
    // Update navigation
    const navItems = document.querySelectorAll('.admin-nav-item');
    navItems.forEach(nav => nav.classList.remove('active'));
    
    const activeNav = document.querySelector(`.admin-nav-item[data-page="${pageId}"]`);
    if (activeNav) {
      activeNav.classList.add('active');
    }
    
    // Update pages
    const adminPages = document.querySelectorAll('.admin-page');
    adminPages.forEach(page => page.classList.remove('active'));
    
    const selectedPage = document.getElementById(`${pageId}Page`);
    if (selectedPage) {
      selectedPage.classList.add('active');
    }
    
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle && activeNav) {
      pageTitle.textContent = activeNav.querySelector('span').textContent;
    }
    
    // Update URL without reloading
    history.pushState(null, null, `/admin/${pageId === 'dashboard' ? '' : pageId}`);
  }
  
  // Load data for current page
  function loadDataForCurrentPage() {
    const activePage = document.querySelector('.admin-page.active');
    if (!activePage) return;
    
    const pageId = activePage.id.replace('Page', '');
    
    switch (pageId) {
      case 'dashboard':
        loadDashboardData();
        break;
      case 'products':
        loadProducts();
        break;
      case 'orders':
        loadOrders();
        break;
      case 'users':
        loadUsers();
        break;
    }
  }
  
  // Initialize admin panel functionality
  function initAdminPanel() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const adminSidebar = document.getElementById('adminSidebar');
    
    if (sidebarToggle && adminSidebar) {
      sidebarToggle.addEventListener('click', () => {
        adminSidebar.classList.toggle('expanded');
      });
    }
    
    // User dropdown
    const userButton = document.querySelector('.admin-user-button');
    const dropdownMenu = document.querySelector('.admin-dropdown-menu');
    
    if (userButton && dropdownMenu) {
      userButton.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        dropdownMenu.classList.remove('show');
      });
      
      dropdownMenu.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
    
    // Navigation
    const navItems = document.querySelectorAll('.admin-nav-item');
    
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get page ID from data attribute
        const pageId = item.getAttribute('data-page');
        
        // Set active page and load data
        setActivePage(pageId);
        loadDataForCurrentPage();
      });
    });
    
    // Initialize modal functionality
    initModals();
    
    // Product form
    initProductForm();
    
    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
      addProductBtn.addEventListener('click', () => {
        resetProductForm();
        openModal('productModal');
      });
    }
    
    // Logout button
    const logoutBtns = document.querySelectorAll('#adminLogout, #adminLogoutMenu');
    logoutBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          // Call logout API
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
          });
          
          // Clear local storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          
          // Redirect to login page
          window.location.href = '/login';
        } catch (error) {
          console.error('Logout error:', error);
          window.location.href = '/login';
        }
      });
    });
  }
  
  // Check if user is authenticated as admin
  function checkAdminAuth() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (!token || !userData) {
      window.location.href = '/login?redirect=/admin';
      return;
    }
    
    try {
      const user = JSON.parse(userData);
      // Check if user is admin
      if (user.role !== 'ADMIN') {
        console.log('Non-admin user tried to access admin page:', user.email);
        localStorage.setItem('adminAccessDenied', 'true');
        window.location.href = '/dashboard';
        return;
      }
      
      // User is authorized as admin
      console.log('Admin authenticated:', user.email);
      localStorage.removeItem('adminAccessDenied');
    } catch (error) {
      console.error('Admin auth error:', error);
      window.location.href = '/login?redirect=/admin';
    }
  }
  
  // Load dashboard data using the API helper
  function loadDashboardData() {
    adminFetch('/api/admin/dashboard')
      .then(data => {
        // Update stat cards
        document.getElementById('totalUsers').textContent = data.totalUsers;
        document.getElementById('totalProducts').textContent = data.totalProducts;
        document.getElementById('totalOrders').textContent = data.totalOrders;
        document.getElementById('totalRevenue').textContent = `$${data.totalRevenue.toFixed(2)}`;
        
        // Recent orders
        updateRecentOrdersTable(data.recentOrders);
        
        // Low stock products
        updateLowStockTable(data.lowStockProducts);
      })
      .catch(() => {
        console.log('Using fallback dashboard data...');
        
        // Use fallback data if API fails
        document.getElementById('totalUsers').textContent = '0';
        document.getElementById('totalProducts').textContent = '0';
        document.getElementById('totalOrders').textContent = '0';
        document.getElementById('totalRevenue').textContent = '$0.00';
        
        updateRecentOrdersTable([]);
        updateLowStockTable([]);
      });
  }
  
  // Update recent orders table
  function updateRecentOrdersTable(orders) {
    const recentOrdersTable = document.getElementById('recentOrdersTable');
    if (!recentOrdersTable) return;
    
    const tbody = recentOrdersTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    if (!orders || orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center">No recent orders</td></tr>';
      return;
    }
    
    orders.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${getUserNameById(order.userId)}</td>
        <td>$${order.total.toFixed(2)}</td>
        <td><span class="admin-status admin-status-${order.status}">${order.status}</span></td>
        <td>${formatDate(new Date(order.createdAt))}</td>
      `;
      tbody.appendChild(row);
    });
  }
  
  // Update low stock products table
  function updateLowStockTable(products) {
    const lowStockTable = document.getElementById('lowStockTable');
    if (!lowStockTable) return;
    
    const tbody = lowStockTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    if (!products || products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center">No low stock products</td></tr>';
      return;
    }
    
    products.forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td><span class="admin-stock-warning">${product.stock}</span></td>
        <td>
          <div class="admin-actions">
            <button class="admin-btn admin-btn-sm admin-btn-primary" onclick="editProduct('${product.id}')">
              Edit
            </button>
            <button class="admin-btn admin-btn-sm admin-btn-secondary" onclick="restockProduct('${product.id}')">
              Restock
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(row);
    });
  }
  
  // API helper function
  async function adminFetch(url, options = {}) {
    try {
      // Add authorization header if not present
      if (!options.headers) {
        options.headers = {};
      }
      
      if (!options.headers['Authorization']) {
        const token = localStorage.getItem('authToken');
        if (token) {
          options.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      
      // Make the request
      const response = await fetch(url, options);
      
      // Check if response was successful
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API Error (${url}):`, error);
      showToast(error.message || 'Error communicating with server', 'error');
      throw error;
    }
  }
  
  // Load products using the API helper
  function loadProducts() {
    const productsTable = document.getElementById('productsTable');
    if (!productsTable) return;
    
    const tbody = productsTable.querySelector('tbody');
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Loading products...</td></tr>';
    
    adminFetch('/api/admin/products')
      .then(products => {
        tbody.innerHTML = '';
        
        if (products.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" class="text-center">No products found</td></tr>';
          return;
        }
        
        products.forEach(product => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>
              <div class="admin-product-info">
                <img src="${product.image || '/images/placeholder.jpg'}" 
                     alt="${product.name}" 
                     style="width: 40px; height: 40px; object-fit: cover; margin-right: 10px; border-radius: 4px;">
                <div class="admin-product-name">${product.name}</div>
              </div>
            </td>
            <td>${product.id}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
              <div class="admin-actions">
                <button class="admin-btn admin-btn-sm admin-btn-primary" onclick="editProduct('${product.id}')">
                  Edit
                </button>
                <button class="admin-btn admin-btn-sm admin-btn-danger" onclick="deleteProduct('${product.id}')">
                  Delete
                </button>
              </div>
            </td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(() => {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Failed to load products</td></tr>';
      });
  }
  
  // Load orders using the API helper
  function loadOrders() {
    const ordersTable = document.getElementById('ordersTable');
    if (!ordersTable) return;
    
    const tbody = ordersTable.querySelector('tbody');
    tbody.innerHTML = '<tr><td colspan="7" class="text-center">Loading orders...</td></tr>';
    
    adminFetch('/api/admin/orders')
      .then(orders => {
        tbody.innerHTML = '';
        
        if (orders.length === 0) {
          tbody.innerHTML = '<tr><td colspan="7" class="text-center">No orders found</td></tr>';
          return;
        }
        
        orders.forEach(order => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${order.id}</td>
            <td>${getUserNameById(order.userId)}</td>
            <td>${order.items.length} items</td>
            <td>$${order.total.toFixed(2)}</td>
            <td><span class="admin-status admin-status-${order.status}">${order.status}</span></td>
            <td>${formatDate(new Date(order.createdAt))}</td>
            <td>
              <div class="admin-actions">
                <button class="admin-btn admin-btn-sm admin-btn-primary" onclick="viewOrder('${order.id}')">
                  View
                </button>
              </div>
            </td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(() => {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Failed to load orders</td></tr>';
      });
  }
  
  // Load users using the API helper
  function loadUsers() {
    const usersTable = document.getElementById('usersTable');
    if (!usersTable) return;
    
    const tbody = usersTable.querySelector('tbody');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Loading users...</td></tr>';
    
    adminFetch('/api/admin/users')
      .then(users => {
        tbody.innerHTML = '';
        
        if (users.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" class="text-center">No users found</td></tr>';
          return;
        }
        
        users.forEach(user => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="admin-status ${user.role === 'ADMIN' ? 'admin-status-completed' : 'admin-status-pending'}">${user.role}</span></td>
            <td>
              <div class="admin-actions">
                <button class="admin-btn admin-btn-sm admin-btn-primary" onclick="editUser('${user.id}')">
                  Edit
                </button>
                <button class="admin-btn admin-btn-sm admin-btn-danger" onclick="deleteUser('${user.id}')" ${user.role === 'ADMIN' ? 'disabled' : ''}>
                  Delete
                </button>
              </div>
            </td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(() => {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Failed to load users</td></tr>';
      });
  }
  
  // Initialize modals
  function initModals() {
    // Close modal buttons
    const closeButtons = document.querySelectorAll('.admin-modal-close, [data-close]');
    closeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-close') || button.closest('.admin-modal').id;
        closeModal(modalId);
      });
    });
    
    // Close modal when clicking outside
    const modals = document.querySelectorAll('.admin-modal');
    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal.id);
        }
      });
    });
  }
  
  // Open modal
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
    }
  }
  
  // Close modal
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
    }
  }
  
  // Initialize product form
  function initProductForm() {
    const productForm = document.getElementById('productForm');
    if (productForm) {
      // Preview image when file is selected
      const imageInput = document.getElementById('productImage');
      const imagePreview = document.getElementById('productImagePreview');
      
      if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function(e) {
          if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
              imagePreview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 150px;">`;
            }
            reader.readAsDataURL(e.target.files[0]);
          }
        });
      }
      
      productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Create FormData for file uploads
        const formData = new FormData(productForm);
        
        // Get product ID to determine if this is an update or a new product
        const productId = document.getElementById('productId').value;
        
        if (productId) {
          // Update existing product
          updateProduct(formData, productId);
        } else {
          // Create new product
          createProduct(formData);
        }
      });
    }
  }
  
  // Reset product form
  function resetProductForm() {
    document.getElementById('productId').value = '';
    document.getElementById('productName').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productFullDescription').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productCategory').value = '';
    document.getElementById('productStock').value = '';
    document.getElementById('productFeatures').value = '';
    
    // Reset image preview
    if (document.getElementById('productImagePreview')) {
      document.getElementById('productImagePreview').innerHTML = '';
    }
    
    document.getElementById('productModalTitle').textContent = 'Add New Product';
  }
  
  // Create product
  function createProduct(formData) {
    // Show loading state
    const submitBtn = document.querySelector('#productForm [type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating...';
    
    // Add authorization header
    const token = localStorage.getItem('authToken');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Send formData to the server
    fetch('/api/admin/products', {
      method: 'POST',
      headers: headers,
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        closeModal('productModal');
        showToast('Product added successfully', 'success');
        loadProducts();
      })
      .catch(error => {
        console.error('Error adding product:', error);
        showToast('Failed to add product: ' + error.message, 'error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
  }
  
  // Update product
  function updateProduct(formData, productId) {
    // Show loading state
    const submitBtn = document.querySelector('#productForm [type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Updating...';
    
    // Add authorization header
    const token = localStorage.getItem('authToken');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Send formData to the server
    fetch(`/api/admin/products/${productId}`, {
      method: 'PUT',
      headers: headers,
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        closeModal('productModal');
        showToast('Product updated successfully', 'success');
        loadProducts();
      })
      .catch(error => {
        console.error('Error updating product:', error);
        showToast('Failed to update product: ' + error.message, 'error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
  }
  
  // Delete product
  function deleteProduct(productId) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    // In a real app, you would send this request to the server
    fetch(`/api/admin/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        showToast('Product deleted successfully', 'success');
        loadProducts();
      })
      .catch(error => {
        console.error('Error deleting product:', error);
        showToast('Failed to delete product: ' + error.message, 'error');
      });
  }
  
  // Edit product
  function editProduct(productId) {
    // Show loading in form
    document.getElementById('productModalTitle').textContent = 'Loading product...';
    openModal('productModal');
    
    // Fetch product from server
    adminFetch(`/api/admin/products/${productId}`)
      .then(product => {
        // Populate form with product data
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productFullDescription').value = product.fullDescription || '';
        document.getElementById('productPrice').value = product.price.toFixed(2);
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productStock').value = product.stock || 0;
        document.getElementById('productFeatures').value = (product.features || []).join('\n');
        
        // Show current image if available
        const imagePreview = document.getElementById('productImagePreview');
        if (imagePreview && product.image) {
          imagePreview.innerHTML = `
            <img src="${product.image}" style="max-width: 100%; max-height: 150px;">
            <p style="margin-top: 5px; font-size: 0.8rem;">Current image will be kept if no new image is selected.</p>
          `;
        }
        
        document.getElementById('productModalTitle').textContent = 'Edit Product';
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        closeModal('productModal');
      });
  }
  
  // Restock product
  function restockProduct(productId) {
    // Show prompt for quantity
    const quantity = parseInt(prompt("Enter quantity to add to stock:", "10"));
    
    if (isNaN(quantity) || quantity <= 0) {
      showToast('Please enter a valid quantity', 'error');
      return;
    }
    
    fetch(`/api/admin/products/${productId}/restock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ quantity })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        showToast(`Successfully added ${quantity} items to stock`, 'success');
        loadDashboardData();
        // Also reload products if on products page
        if (document.getElementById('productsPage').classList.contains('active')) {
          loadProducts();
        }
      })
      .catch(error => {
        console.error('Restock error:', error);
        showToast('Failed to restock product', 'error');
      });
  }
  
  // Edit user
  function editUser(userId) {
    // Initialize the user modal if it doesn't exist
    initUserModal();
    
    // Show loading in modal
    document.getElementById('userModalTitle').textContent = 'Loading user...';
    openModal('userModal');
    
    // Fetch user from server
    fetch(`/api/admin/users/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then(user => {
        // Populate form with user data
        document.getElementById('userId').value = user.id;
        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userRole').value = user.role;
        
        document.getElementById('userModalTitle').textContent = 'Edit User';
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        showToast('Failed to load user details', 'error');
        closeModal('userModal');
      });
  }
  
  // Initialize user modal
  function initUserModal() {
    // Check if modal already exists
    if (document.getElementById('userModal')) {
      return;
    }
    
    // Create user modal HTML
    const userModal = document.createElement('div');
    userModal.className = 'admin-modal';
    userModal.id = 'userModal';
    
    userModal.innerHTML = `
      <div class="admin-modal-content">
        <div class="admin-modal-header">
          <h2 id="userModalTitle">Edit User</h2>
          <button class="admin-modal-close" data-close="userModal">&times;</button>
        </div>
        <div class="admin-modal-body">
          <form id="userForm">
            <input type="hidden" id="userId">
            
            <div class="admin-form-group">
              <label for="userName">Name</label>
              <input type="text" id="userName" required>
            </div>
            
            <div class="admin-form-group">
              <label for="userEmail">Email</label>
              <input type="email" id="userEmail" required>
            </div>
            
            <div class="admin-form-group">
              <label for="userRole">Role</label>
              <select id="userRole" required>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            
            <div class="admin-form-group">
              <label for="userPassword">New Password (leave blank to keep current)</label>
              <input type="password" id="userPassword">
            </div>
            
            <div class="admin-form-actions">
              <button type="button" class="admin-btn" data-close="userModal">Cancel</button>
              <button type="submit" class="admin-btn admin-btn-primary">Save User</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    // Add modal to body
    document.body.appendChild(userModal);
    
    // Initialize modal events
    initModals();
    
    // Set up form submission
    const userForm = document.getElementById('userForm');
    userForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const userId = document.getElementById('userId').value;
      const name = document.getElementById('userName').value;
      const email = document.getElementById('userEmail').value;
      const role = document.getElementById('userRole').value;
      const password = document.getElementById('userPassword').value;
      
      // Create user data
      const userData = {
        name,
        email,
        role
      };
      
      // Add password only if provided
      if (password) {
        userData.password = password;
      }
      
      // Show loading state
      const submitBtn = userForm.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';
      
      // Update user
      fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(userData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          closeModal('userModal');
          showToast('User updated successfully', 'success');
          loadUsers();
        })
        .catch(error => {
          console.error('Error updating user:', error);
          showToast('Failed to update user: ' + error.message, 'error');
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        });
    });
  }
  
  // Delete user
  function deleteUser(userId) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        showToast('User deleted successfully', 'success');
        loadUsers();
      })
      .catch(error => {
        console.error('Error deleting user:', error);
        showToast('Failed to delete user: ' + error.message, 'error');
      });
  }

  // View order details
  function viewOrder(orderId) {
    // Show loading in modal
    document.getElementById('modalOrderId').textContent = 'Loading...';
    openModal('orderModal');
    
    fetch(`/api/admin/orders/${orderId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then(order => {
        // Populate order details
        document.getElementById('modalOrderId').textContent = order.id;
        document.getElementById('modalCustomerName').textContent = getUserNameById(order.userId);
        document.getElementById('modalOrderDate').textContent = formatDate(new Date(order.createdAt));
        document.getElementById('modalOrderStatus').textContent = order.status;
        
        // Set status dropdown value
        document.getElementById('orderStatusSelect').value = order.status;
        
        // Populate order items
        const itemsTable = document.getElementById('orderItemsTable');
        const tbody = itemsTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        let subtotal = 0;
        
        order.items.forEach(item => {
          const row = document.createElement('tr');
          const itemTotal = item.price * item.quantity;
          subtotal += itemTotal;
          
          row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${itemTotal.toFixed(2)}</td>
          `;
          tbody.appendChild(row);
        });
        
        // Update order totals
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + tax;
        
        document.getElementById('modalOrderSubtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('modalOrderTax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('modalOrderTotal').textContent = `$${total.toFixed(2)}`;
        
        // Set up update status button
        document.getElementById('updateOrderStatusBtn').onclick = () => updateOrderStatus(order.id);
        
        // Set up generate license keys button
        document.getElementById('generateLicenseBtn').onclick = () => generateLicenseKeys(order.id);
      })
      .catch(error => {
        console.error('Error fetching order:', error);
        showToast('Failed to load order details', 'error');
        closeModal('orderModal');
      });
  }

  // Update order status
  function updateOrderStatus(orderId) {
    const status = document.getElementById('orderStatusSelect').value;
    
    fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ status })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        showToast('Order status updated successfully', 'success');
        document.getElementById('modalOrderStatus').textContent = status;
        loadOrders(); // Refresh orders list
      })
      .catch(error => {
        console.error('Error updating order status:', error);
        showToast('Failed to update order status', 'error');
      });
  }

  // Generate license keys for an order
  function generateLicenseKeys(orderId) {
    const generateBtn = document.getElementById('generateLicenseBtn');
    const originalText = generateBtn.textContent;
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';
    
    fetch(`/api/admin/orders/${orderId}/generate-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        showToast('License keys generated successfully', 'success');
        
        // Refresh order details
        viewOrder(orderId);
      })
      .catch(error => {
        console.error('Error generating license keys:', error);
        showToast('Failed to generate license keys', 'error');
      })
      .finally(() => {
        generateBtn.disabled = false;
        generateBtn.textContent = originalText;
      });
  }

  // Helper function to get user name by ID
  function getUserNameById(userId) {
    // This would normally fetch from the server or a local cache
    // For now, just return a placeholder
    return "User " + userId.substring(0, 4);
  }

  // Helper function to format date
  function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  // Show toast notification
  function showToast(message, type = 'info') {
    // Check if toast container exists, if not create it
    let toastContainer = document.querySelector('.admin-toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'admin-toast-container';
      document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `admin-toast admin-toast-${type}`;
    toast.innerHTML = `
      <div class="admin-toast-message">${message}</div>
      <button class="admin-toast-close">&times;</button>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    const timeout = setTimeout(() => {
      toast.classList.add('admin-toast-hiding');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 5000);
    
    // Close button
    const closeBtn = toast.querySelector('.admin-toast-close');
    closeBtn.addEventListener('click', () => {
      clearTimeout(timeout);
      toast.classList.add('admin-toast-hiding');
      setTimeout(() => {
        toast.remove();
      }, 300);
    });
    
    // Add show class to animate in
    setTimeout(() => {
      toast.classList.add('admin-toast-show');
    }, 10);
  }
