"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { animations, gradients } from "@/lib/theme"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2, ChevronLeft, CreditCard } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Mock cart items for demonstration
const initialItems = [
  {
    id: "1",
    name: "Windows 11 Pro",
    price: 129.99,
    quantity: 1,
    image: "/images/products/windows11.jpg",
  },
  {
    id: "2",
    name: "Microsoft Office 2021",
    price: 199.99,
    quantity: 1,
    image: "/images/products/office2021.jpg",
  }
]

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState(initialItems)
  
  // Remove item from cart
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id))
    toast({
      title: "Item Removed",
      description: "Product has been removed from your cart.",
    })
  }
  
  // Update item quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }
  
  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  // Handle checkout
  const handleCheckout = () => {
    toast({
      title: "Checkout Started",
      description: "Redirecting to payment gateway...",
    })
    
    // Simulate redirect to checkout
    setTimeout(() => {
      router.push("/checkout")
    }, 1500)
  }
  
  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="container py-20 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="mb-8 text-muted-foreground max-w-md mx-auto">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Button asChild>
            <Link href="/products">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Browse Products
            </Link>
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container py-10">
      <h1 className={cn("text-3xl font-bold mb-8", gradients.text)}>
        Your Shopping Cart
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="bg-card px-6 py-3 border-b border-border">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6 font-medium">Product</div>
                <div className="col-span-2 font-medium text-center">Price</div>
                <div className="col-span-2 font-medium text-center">Quantity</div>
                <div className="col-span-2 font-medium text-right">Total</div>
              </div>
            </div>
            
            <div className="divide-y divide-border">
              {cartItems.map((item) => (
                <div key={item.id} className="px-6 py-4 bg-background">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center mr-3">
                          <ShoppingCart className="h-6 w-6 text-primary/50" />
                        </div>
                        <div>
                          <Link 
                            href={`/products/${item.id}`} 
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {item.name}
                          </Link>
                          <div className="text-sm text-muted-foreground">
                            ID: {item.id}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-center">
                      ${item.price.toFixed(2)}
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex items-center justify-center">
                        <button 
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          -
                        </button>
                        <div className="w-8 text-center">{item.quantity}</div>
                        <button 
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-2 flex items-center justify-end font-medium">
                      <div className="mr-2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <Button variant="outline" asChild className={animations.button}>
              <Link href="/products" className="flex items-center">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            
            <Button 
              variant="destructive" 
              size="sm" 
              className={animations.button}
              onClick={() => setCartItems([])}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="rounded-lg border border-border bg-card p-6 sticky top-20">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxes</span>
                <span>${(subtotal * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${(subtotal * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Button 
              className={cn("w-full", animations.button)}
              onClick={handleCheckout}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Checkout
            </Button>
            
            <div className="mt-4 text-xs text-muted-foreground text-center">
              Secure payment processing. All transactions are encrypted.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 