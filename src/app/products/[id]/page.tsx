"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { animations, gradients } from "@/lib/theme"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingCart, ChevronLeft, Shield, Zap, Clock, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Sample products data - in production this would come from a database
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
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  
  // Find the product by ID
  const product = products.find(p => p.id === id)
  
  // If product not found, show 404
  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8 text-muted-foreground">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/products">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>
      </div>
    )
  }
  
  const addToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    })
  }
  
  return (
    <div className="container py-10">
      <div className="mb-6">
        <Button variant="ghost" asChild className={animations.button}>
          <Link href="/products" className="flex items-center text-muted-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="bg-muted rounded-lg overflow-hidden border border-border">
          <div className="aspect-square relative bg-gradient-to-br from-primary/5 to-transparent flex items-center justify-center">
            <div className="p-10 text-center">
              <div className="h-32 w-32 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-16 w-16 text-primary/80" />
              </div>
              <div className="text-lg font-medium text-primary">Product Image</div>
              <div className="text-sm text-muted-foreground mt-2">{product.name}</div>
            </div>
          </div>
        </div>
        
        {/* Product Details */}
        <div>
          <div className="mb-2">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
              {product.category}
            </span>
          </div>
          
          <h1 className={cn("text-3xl font-bold mb-2", gradients.text)}>
            {product.name}
          </h1>
          
          <div className="text-2xl font-bold mb-6">
            ${product.price.toFixed(2)}
          </div>
          
          <p className="text-muted-foreground mb-6">
            {product.fullDescription}
          </p>
          
          <div className="mb-8">
            <h3 className="font-semibold mb-3">Key Features</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="font-medium">Quantity:</div>
            <div className="flex items-center border border-input rounded-md">
              <button 
                className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <div className="w-12 text-center">{quantity}</div>
              <button 
                className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                +
              </button>
            </div>
            <div className="text-sm text-muted-foreground">
              {product.stock} available
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              className={cn("px-8", animations.button)}
              onClick={addToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            
            <Button 
              variant="outline" 
              className={animations.button}
              onClick={() => {
                addToCart()
                router.push('/cart')
              }}
            >
              Buy Now
            </Button>
          </div>
          
          {/* Trust Elements */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            <div className="flex flex-col items-center text-center p-4 rounded-lg border border-border bg-card">
              <Shield className="h-6 w-6 text-primary mb-2" />
              <div className="font-medium text-sm">Secure Payment</div>
              <div className="text-xs text-muted-foreground">Safe encryption</div>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg border border-border bg-card">
              <Zap className="h-6 w-6 text-primary mb-2" />
              <div className="font-medium text-sm">Instant Delivery</div>
              <div className="text-xs text-muted-foreground">Digital keys via email</div>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg border border-border bg-card">
              <Clock className="h-6 w-6 text-primary mb-2" />
              <div className="font-medium text-sm">24/7 Support</div>
              <div className="text-xs text-muted-foreground">Help when you need it</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 