// Simplified mock database
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
      fullDescription: "Windows 10 Pro offers all the features of Windows 10 Home plus important business functionality for encryption, remote log-in, creating virtual machines, and more.",
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
    },
    {
      id: "4",
      name: "Adobe Creative Cloud",
      description: "1-year subscription to Adobe Creative Cloud",
      fullDescription: "Get access to the entire collection of 20+ creative desktop and mobile apps including Photoshop, Illustrator, InDesign, Premiere Pro, and Acrobat Pro.",
      price: 599.99,
      category: "Design Software",
      image: "/images/products/adobe.jpg",
      features: [
        "Access to 20+ Adobe creative apps",
        "100GB cloud storage",
        "Thousands of Adobe fonts",
        "Adobe Portfolio website builder",
        "Premium features in Adobe mobile apps"
      ],
      stock: 100
    },
    {
      id: "5",
      name: "Avast Antivirus Premium",
      description: "Complete protection for your PC",
      fullDescription: "Avast Premium Security offers advanced protection against viruses, malware, and other threats to keep your devices and data safe.",
      price: 49.99,
      category: "Security Software",
      image: "/images/products/avast.jpg",
      features: [
        "Real-time virus protection",
        "Ransomware shield",
        "Wi-Fi network security",
        "Advanced firewall",
        "Webcam protection",
        "Secure browser for banking"
      ],
      stock: 200
    },
    {
      id: "6",
      name: "VMware Workstation Pro",
      description: "Run multiple operating systems as virtual machines",
      fullDescription: "VMware Workstation Pro allows you to run multiple operating systems as virtual machines on a single PC, perfect for testing, development, and demonstration.",
      price: 189.99,
      category: "Utilities",
      image: "/images/products/vmware.jpg",
      features: [
        "Run multiple OSes on a single PC",
        "Create and test applications in a safe, isolated environment",
        "Share VMs with anyone",
        "Connect to VMware vSphere",
        "3D graphics support"
      ],
      stock: 85
    }
  ];
  
  // Standard user data
  const users = [
    {
      id: "1",
      name: "User",
      email: "user@example.com",
      password: "password",
      role: "USER"
    }
  ];
  
  // Simple database operations
  module.exports = {
    products,
    users,
    
    // Simple functions to simulate database operations
    findProductById: (id) => products.find(p => p.id === id),
    findUserByEmail: (email) => users.find(u => u.email === email),
    createUser: (userData) => {
      const newUser = {
        id: `user_${Date.now()}`,
        ...userData
      };
      users.push(newUser);
      return newUser;
    }
  };