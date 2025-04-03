const express = require('express');
const router = express.Router();

// Mock database of products
const products = [
  {
    id: "1",
    name: "Windows 11 Pro",
    description: "Genuine Windows 11 Professional License Key",
    fullDescription: "Windows 11 Pro includes all the features of Windows 11 Home plus important business functionality for encryption, remote log-in, creating virtual machines, and more. Get all the features of Windows 11, plus additional security and management features.",
    price: 129.99,
    category: "Operating Systems",
    image: "/images/products/windows11.jpg",
    features: [
      "Genuine Microsoft Product Key",
      "Digital Delivery within minutes",
      "Full version with lifetime license",
      "Compatible with both 32 and 64-bit systems",
      "Includes all security updates",
      "Multi-language support"
    ],
    stock: 50
  },
  {
    id: "2",
    name: "Microsoft Office 2021",
    description: "Lifetime license for Office Professional 2021",
    fullDescription: "Microsoft Office Professional 2021 is designed for professional users who need the full suite of productivity applications. Includes Word, Excel, PowerPoint, Outlook, Publisher, Access, and OneNote for Windows 10 and Windows 11.",
    price: 199.99,
    category: "Office Software",
    image: "/images/products/office2021.jpg",
    features: [
      "One-time purchase for 1 PC or Mac",
      "Classic 2021 versions of Word, Excel, PowerPoint, and Outlook",
      "Microsoft support included for 60 days at no extra cost",
      "Compatible with Windows 11, Windows 10, and macOS",
      "All languages included"
    ],
    stock: 35
  },
  {
    id: "3",
    name: "Windows 10 Pro",
    description: "Authentic Windows 10 Professional License",
    fullDescription: "Windows 10 Pro offers all the features of Windows 10 Home plus important business functionality for encryption, remote log-in, creating virtual machines, and more. Get all the features of Windows 10 Home, plus important business functionality for encryption, remote log-in, creating virtual machines, and more.",
    price: 99.99,
    category: "Operating Systems",
    image: "/images/products/windows10.jpg",
    features: [
      "Genuine Microsoft Product Key",
      "Digital Delivery within minutes",
      "Full version with lifetime license",
      "Compatible with both 32 and 64-bit systems",
      "Includes all security updates",
      "Multi-language support"
    ],
    stock: 75
  }
];

// Get all products
router.get('/', (req, res) => {
  // Get query parameters for filtering
  const { search, category, minPrice, maxPrice } = req.query;
  
  let filteredProducts = [...products];
  
  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchLower) || 
      product.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply category filter
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(product => 
      product.category === category
    );
  }
  
  // Apply price filters
  if (minPrice) {
    filteredProducts = filteredProducts.filter(product => 
      product.price >= parseFloat(minPrice)
    );
  }
  
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product => 
      product.price <= parseFloat(maxPrice)
    );
  }
  
  res.json(filteredProducts);
});

// Get product by ID
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  res.json(product);
});

module.exports = router;