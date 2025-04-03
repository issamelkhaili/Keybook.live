// public/js/admin.js
document.addEventListener('DOMContentLoaded', () => {
    // Add admin style fixes
    addAdminStyleFixes();
    
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
      productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const productId = document.getElementById('productId').value;
        const name = document.getElementById('productName').value;
        const description = document.getElementById('productDescription').value;
        const fullDescription = document.getElementById('productFullDescription').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const category = document.getElementById('productCategory').value;
        const stock = parseInt(document.getElementById('productStock').value);
        const featuresText = document.getElementById('productFeatures').value;
        
        // Parse features
        const features = featuresText
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
        
        // Create product object
        const product = {
          id: productId,
          name,
          description,
          fullDescription,
          price,
          category,
          stock,
          features
        };
        
        if (productId) {
          // Update existing product
          updateProduct(product);
        } else {
          // Create new product
          createProduct(product);
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
    document.getElementById('productModalTitle').textContent = 'Add New Product';
  }
  
  // Create product
  function createProduct(product) {
    // In a real app, you would send this request to the server
    fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
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
  function updateProduct(product) {
    // In a real app, you would send this data to the server
    fetch('/api/admin/products', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
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
    // In a real app, you would send this request to the server
    fetch(`/api/admin/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => {
        if (response.ok) {
          showToast('Product deleted successfully', 'success');
          loadProducts();
        } else {
          console.error('Error deleting product:', response.statusText);
          showToast('Failed to delete product', 'error');
        }
      })
      .catch(error => {
        console.error('Error deleting product:', error);
        showToast('Failed to delete product', 'error');
      });
  }
  
  // Edit product
  function editProduct(productId) {
    // In a real app, you would fetch this product from the server
    // For this demo, we'll use mock data
    const product = {
      id: productId,
      name: 'Windows 11 Pro',
      description: 'The latest version of Windows',
      fullDescription: 'Windows 11 is the latest version of Windows',
      price: 129.99,
      category: 'Operating Systems',
      stock: 5,
      features: ['New Start Menu', 'Snap Layouts', 'Taskbar']
    };
    
    // Populate form with product data
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productFullDescription').value = product.fullDescription;
    document.getElementById('productPrice').value = product.price.toFixed(2);
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productFeatures').value = product.features.join('\n');
    
    // Open modal
    openModal('productModal');
  }
  
  // Restock product
  function restockProduct(productId) {
    // In a real app, you would fetch this product from the server
    // For this demo, we'll use mock data
    const product = {
      id: productId,
      name: 'Windows 11 Pro',
      category: 'Operating Systems',
      stock: 10
    };
    
    // Populate form with product data
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productFullDescription').value = product.fullDescription;
    document.getElementById('productPrice').value = product.price.toFixed(2);
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productFeatures').value = product.features.join('\n');
    
    // Open modal
    openModal('productModal');
  }
  
  // Edit user
  function editUser(userId) {
    // In a real app, you would fetch this user from the server
    // For this demo, we'll use mock data
    const user = {
      id: userId,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'ADMIN'
    };
    
    // Populate form with user data
    document.getElementById('userId').value = user.id;
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;
    
    // Open modal
    openModal('userModal');
  }
  
  // Delete user
  function deleteUser(userId) {
    // In a real app, you would send this request to the server
    fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => {
        if (response.ok) {
          showToast('User deleted successfully', 'success');
          loadUsers();
        } else {
          console.error('Error deleting user:', response.statusText);
          showToast('Failed to delete user', 'error');
        }
      })
      .catch(error => {
        console.error('Error deleting user:', error);
        showToast('Failed to delete user', 'error');
      });
  }
