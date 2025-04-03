// public/js/admin.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize admin panel
    initAdminPanel();
    
    // Check auth status
    checkAdminAuth();
    
    // Load initial data for dashboard
    loadDashboardData();
  });
  
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
    const adminPages = document.querySelectorAll('.admin-page');
    const pageTitle = document.getElementById('pageTitle');
    
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all nav items
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Get page ID from data attribute
        const pageId = item.getAttribute('data-page');
        
        // Hide all pages
        adminPages.forEach(page => page.classList.remove('active'));
        
        // Show selected page
        const selectedPage = document.getElementById(`${pageId}Page`);
        if (selectedPage) {
          selectedPage.classList.add('active');
        }
        
        // Update page title
        if (pageTitle) {
          pageTitle.textContent = item.querySelector('span').textContent;
        }
        
        // Load data for the page
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
        
        // Update URL without reloading
        history.pushState(null, null, `/admin/${pageId === 'dashboard' ? '' : pageId}`);
      });
    });
    
    // Check URL on page load to activate correct nav item
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
    
    const activeNav = document.querySelector(`.admin-nav-item[data-page="${activePage}"]`);
    if (activeNav) {
      activeNav.click();
    }
    
    // Initialize modal functionality
    initModals();
    
    // Product form
    initProductForm();
    
    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
      addProductBtn.addEventListener('click', () => {
        openModal('productModal');
        resetProductForm();
      });
    }
    
    // Logout button
    const logoutBtns = document.querySelectorAll('#adminLogout, #adminLogoutMenu');
    logoutBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        window.location.href = '/login';
      });
    });
  }
  
  // Check if user is authenticated as admin
  function checkAdminAuth() {
    const token = localStorage.getItem('adminToken');
    
    // For demo purposes, we'll just check if the token exists
    // In a real app, you would validate the token with the server
    if (!token) {
      window.location.href = '/login?redirect=/admin';
    }
  }
  
  // Load dashboard data
  function loadDashboardData() {
    // In a real app, you would fetch this data from the server
    // For this demo, we'll use mock data
    
    // Update stat cards
    document.getElementById('totalUsers').textContent = 145;
    document.getElementById('totalProducts').textContent = 67;
    document.getElementById('totalOrders').textContent = 583;
    document.getElementById('totalRevenue').textContent = '$12,456.78';
    
    // Recent orders
    const recentOrdersTable = document.getElementById('recentOrdersTable');
    if (recentOrdersTable) {
      const tbody = recentOrdersTable.querySelector('tbody');
      tbody.innerHTML = '';
      
      const mockOrders = [
        { id: 'ORD-001', customer: 'John Doe', amount: 129.99, status: 'completed', date: '2023-04-02' },
        { id: 'ORD-002', customer: 'Jane Smith', amount: 299.98, status: 'pending', date: '2023-04-02' },
        { id: 'ORD-003', customer: 'Bob Johnson', amount: 99.99, status: 'processing', date: '2023-04-01' },
        { id: 'ORD-004', customer: 'Alice Brown', amount: 249.97, status: 'completed', date: '2023-04-01' },
        { id: 'ORD-005', customer: 'Charlie Wilson', amount: 189.99, status: 'cancelled', date: '2023-03-31' }
      ];
      
      mockOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${order.id}</td>
          <td>${order.customer}</td>
          <td>$${order.amount.toFixed(2)}</td>
          <td><span class="admin-status admin-status-${order.status}">${order.status}</span></td>
          <td>${formatDate(order.date)}</td>
        `;
        tbody.appendChild(row);
      });
    }
    
    // Low stock products
    const lowStockTable = document.getElementById('lowStockTable');
    if (lowStockTable) {
      const tbody = lowStockTable.querySelector('tbody');
      tbody.innerHTML = '';
      
      const mockProducts = [
        { id: '1', name: 'Windows 11 Pro', category: 'Operating Systems', price: 129.99, stock: 5 },
        { id: '2', name: 'Microsoft Office 2021', category: 'Office Software', price: 199.99, stock: 8 },
        { id: '3', name: 'Adobe Creative Cloud', category: 'Design Software', price: 599.99, stock: 12 }
      ];
      
      mockProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>$${product.price.toFixed(2)}</td>
          <td><span class="admin-stock-warning">${product.stock}</span></td>
          <td>
            <div class="admin-actions">
              <button class="admin-btn admin-btn-sm admin-btn-primary" data-id="${product.id}" onclick="editProduct('${product.id}')">
                Edit
              </button>
              <button class="admin-btn admin-btn-sm admin-btn-secondary" data-id="${product.id}" onclick="restockProduct('${product.id}')">
                Restock
              </button>
            </div>
          </td>
        `;
        tbody.appendChild(row);
      });
    }
  }
  
  // Load products
  function loadProducts() {
    // In a real app, you would fetch this data from the server
    fetch('/api/admin/products')
      .then(response => response.json())
      .then(products => {
        const productsTable = document.getElementById('productsTable');
        if (!productsTable) return;
        
        const tbody = productsTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        products.forEach(product => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>
              <div class="admin-product-info">
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
      .catch(error => {
        console.error('Error loading products:', error);
        showToast('Failed to load products', 'error');
      });
  }
  
  // Load orders
  function loadOrders() {
    // In a real app, you would fetch this data from the server
    fetch('/api/admin/orders')
      .then(response => response.json())
      .then(orders => {
        const ordersTable = document.getElementById('ordersTable');
        if (!ordersTable) return;
        
        const tbody = ordersTable.querySelector('tbody');
        tbody.innerHTML = '';
        
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
      .catch(error => {
        console.error('Error loading orders:', error);
        showToast('Failed to load orders', 'error');
      });
  }
  
  // Load users
  function loadUsers() {
    // In a real app, you would fetch this data from the server
    fetch('/api/admin/users')
      .then(response => response.json())
      .then(users => {
        const usersTable = document.getElementById('usersTable');
        if (!usersTable) return;
        
        const tbody = usersTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        users.forEach(user => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
              <div class="admin-actions">
                <button class="admin-btn admin-btn-sm admin-btn-primary" onclick="editUser('${user.id}')">
                  Edit
                </button>
                <button class="admin-btn admin-btn-sm admin-btn-danger" onclick="deleteUser('${user.id}')">
                  Delete
                </button>
              </div>
            </td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Error loading users:', error);
        showToast('Failed to load users', 'error');
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
      productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const productId = document.getElementById('productId').value;
        const name = document.getElementById('productName').value;
        const description = document.getElementById('productDescription').value;
        const fullDescription = document.getElementById('productFullDescription').value;
        const price = document.getElementById('productPrice').value;
        const category = document.getElementById('productCategory').value;
        const stock = document.getElementById('productStock').value;
        const featuresText = document.getElementById('productFeatures').value;
        
        // Convert features text to array
        const features = featuresText.split('\n').filter(line => line.trim() !== '');
        
        // Create product object
        const product = {
          name,
          description,
          fullDescription: fullDescription || description,
          price: parseFloat(price),
          category,
          features,
          stock: parseInt(stock)
        };
        
        if (productId) {
          // Update existing product
          updateProduct(productId, product);
        } else {
          // Add new product
          addProduct(product);
        }
      });
    }
  }
  
  // Reset product form
  function resetProductForm() {
    const form = document.getElementById('productForm');
    if (form) {
      form.reset();
      document.getElementById('productId').value = '';
      document.getElementById('productModalTitle').textContent = 'Add New Product';
    }
  }
  
  // Add new product
  function addProduct(product) {
    // In a real app, you would send this data to the server
    fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify(product)
    })
      .then(response => response.json())
      .then(data => {
        closeModal('productModal');
        showToast('Product added successfully', 'success');
        loadProducts();
      })
      .catch(error => {
        console.error('Error adding product:', error);
        showToast('Failed to add product', 'error');
      });
  }
  
  // Update product
  function updateProduct(productId, product) {
    // In a real app, you would send this data to the server
    fetch(`/api/admin/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify(product)
    })
      .then(response => response.json())
      .then(data => {
        closeModal('productModal');
        showToast('Product updated successfully', 'success');
        loadProducts();
      })
      .catch(error => {
        console.error('Error updating product:', error);
        showToast('Failed to update product', 'error');
      });
  }
  
  // Delete product
  function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
      // In a real app, you would send this request to the server
      fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
        .then(response => response.json())
        .then(data => {
          showToast('Product deleted successfully', 'success');
          loadProducts();
        })
        .catch(error => {
          console.error('Error deleting product:', error);
          showToast('Failed to delete product', 'error');
        });
    }
  }
  
  // Edit product
  function editProduct(productId) {
    // Fetch product data
    fetch(`/api/admin/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
      .then(response => response.json())
      .then(product => {
        // Fill form with product data
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productFullDescription').value = product.fullDescription || '';
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productStock').value = product.stock;
        
        // Convert features array to text
        if (product.features && Array.isArray(product.features)) {
          document.getElementById('productFeatures').value = product.features.join('\n');
        }
        
        // Update modal title
        document.getElementById('productModalTitle').textContent = 'Edit Product';
        
        // Edit product
function editProduct(productId) {
    // Fetch product data
    fetch(`/api/admin/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
      .then(response => response.json())
      .then(product => {
        // Fill form with product data
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productFullDescription').value = product.fullDescription || '';
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productStock').value = product.stock;
        
        // Convert features array to text
        if (product.features && Array.isArray(product.features)) {
          document.getElementById('productFeatures').value = product.features.join('\n');
        }
        
        // Update modal title
        document.getElementById('productModalTitle').textContent = 'Edit Product';
        
        // Open modal
        openModal('productModal');
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        showToast('Failed to fetch product data', 'error');
      });
   }
   
   // Restock product
   function restockProduct(productId) {
    const amount = prompt('Enter quantity to add to stock:');
    if (amount && !isNaN(amount) && parseInt(amount) > 0) {
      // In a real app, you would send this request to the server
      fetch(`/api/admin/products/${productId}/restock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ amount: parseInt(amount) })
      })
        .then(response => response.json())
        .then(data => {
          showToast('Product restocked successfully', 'success');
          loadDashboardData();
          loadProducts();
        })
        .catch(error => {
          console.error('Error restocking product:', error);
          showToast('Failed to restock product', 'error');
        });
    }
   }
   
   // View order details
   function viewOrder(orderId) {
    // Fetch order data
    fetch(`/api/admin/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
      .then(response => response.json())
      .then(order => {
        // Fill modal with order data
        document.getElementById('modalOrderId').textContent = order.id;
        document.getElementById('modalCustomerName').textContent = getUserNameById(order.userId);
        document.getElementById('modalOrderDate').textContent = formatDate(new Date(order.createdAt));
        document.getElementById('modalOrderStatus').textContent = order.status;
        document.getElementById('orderStatusSelect').value = order.status;
        
        // Fill order items table
        const itemsTable = document.getElementById('orderItemsTable');
        const tbody = itemsTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        let subtotal = 0;
        
        order.items.forEach(item => {
          const itemTotal = item.price * item.quantity;
          subtotal += itemTotal;
          
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${itemTotal.toFixed(2)}</td>
          `;
          tbody.appendChild(row);
        });
        
        // Update summary
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + tax;
        
        document.getElementById('modalOrderSubtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('modalOrderTax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('modalOrderTotal').textContent = `$${total.toFixed(2)}`;
        
        // Set up update status button
        const updateStatusBtn = document.getElementById('updateOrderStatusBtn');
        updateStatusBtn.onclick = () => updateOrderStatus(order.id);
        
        // Set up generate license button
        const generateLicenseBtn = document.getElementById('generateLicenseBtn');
        generateLicenseBtn.onclick = () => generateLicenseKeys(order.id);
        
        // Open modal
        openModal('orderModal');
      })
      .catch(error => {
        console.error('Error fetching order:', error);
        showToast('Failed to fetch order data', 'error');
      });
   }
   
   // Update order status
   function updateOrderStatus(orderId) {
    const status = document.getElementById('orderStatusSelect').value;
    
    // In a real app, you would send this request to the server
    fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ status })
    })
      .then(response => response.json())
      .then(data => {
        showToast('Order status updated successfully', 'success');
        document.getElementById('modalOrderStatus').textContent = status;
        loadOrders();
      })
      .catch(error => {
        console.error('Error updating order status:', error);
        showToast('Failed to update order status', 'error');
      });
   }
   
   // Generate license keys
   function generateLicenseKeys(orderId) {
    // In a real app, you would fetch order items and generate keys for each
    fetch(`/api/admin/orders/${orderId}/generate-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ productId: '1' }) // Just an example
    })
      .then(response => response.json())
      .then(data => {
        alert(`License key generated: ${data.licenseKey}`);
        showToast('License keys generated successfully', 'success');
      })
      .catch(error => {
        console.error('Error generating license keys:', error);
        showToast('Failed to generate license keys', 'error');
      });
   }
   
   // Edit user
   function editUser(userId) {
    // Fetch user data
    fetch(`/api/admin/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
      .then(response => response.json())
      .then(user => {
        // For simplicity, we'll use a prompt for editing
        const newRole = prompt('Enter new role (USER or ADMIN):', user.role);
        if (newRole && (newRole === 'USER' || newRole === 'ADMIN')) {
          // Update user
          fetch(`/api/admin/users/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify({ role: newRole })
          })
            .then(response => response.json())
            .then(data => {
              showToast('User updated successfully', 'success');
              loadUsers();
            })
            .catch(error => {
              console.error('Error updating user:', error);
              showToast('Failed to update user', 'error');
            });
        }
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        showToast('Failed to fetch user data', 'error');
      });
   }
   
   // Delete user
   function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
      // In a real app, you would send this request to the server
      fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
        .then(response => response.json())
        .then(data => {
          showToast('User deleted successfully', 'success');
          loadUsers();
        })
        .catch(error => {
          console.error('Error deleting user:', error);
          showToast('Failed to delete user', 'error');
        });
    }
   }
   
   // Helper function to get user name by ID
   function getUserNameById(userId) {
    // In a real app, you would fetch this from your user data
    // This is just a mockup
    const mockUsers = {
      'user_1743678663738': 'Issam el khaili'
    };
    
    return mockUsers[userId] || 'Unknown User';
   }
   
   // Format date
   function formatDate(date) {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
   }
   
   // Toast notification
   function showToast(message, type = 'success') {
    // Check if toast container exists, if not create it
    let toastContainer = document.querySelector('.admin-toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'admin-toast-container';
      document.body.appendChild(toastContainer);
      
      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        .admin-toast-container {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          z-index: 9999;
        }
        .admin-toast {
          background-color: var(--admin-card);
          border: 1px solid var(--admin-border);
          border-radius: 0.5rem;
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
        .admin-toast.show {
          transform: translateX(0);
          opacity: 1;
        }
        .admin-toast.success {
          border-left: 4px solid var(--admin-success);
        }
        .admin-toast.error {
          border-left: 4px solid var(--admin-danger);
        }
        .admin-toast-icon {
          margin-right: 0.75rem;
          flex-shrink: 0;
        }
        .admin-toast-message {
          font-size: 0.875rem;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    
    // Set icon based on type
    let icon = '';
    if (type === 'success') {
      icon = `<div class="admin-toast-icon">✓</div>`;
    } else if (type === 'error') {
      icon = `<div class="admin-toast-icon">✕</div>`;
    }
    
    toast.innerHTML = `
      ${icon}
      <div class="admin-toast-message">${message}</div>
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