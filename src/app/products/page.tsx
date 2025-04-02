import { cn } from "@/lib/utils"
import { animations, gradients } from "@/lib/theme"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingCart, Search, Filter } from "lucide-react"

// Sample products data
const products = [
  {
    id: "1",
    name: "Windows 11 Pro",
    description: "Genuine Windows 11 Professional License Key",
    price: 129.99,
    category: "Operating Systems",
    image: "/images/products/windows11.jpg",
    badge: "Best Seller"
  },
  {
    id: "2",
    name: "Microsoft Office 2021",
    description: "Lifetime license for Office Professional 2021",
    price: 199.99,
    category: "Office Software",
    image: "/images/products/office2021.jpg"
  },
  {
    id: "3",
    name: "Windows 10 Pro",
    description: "Authentic Windows 10 Professional License",
    price: 99.99,
    category: "Operating Systems",
    image: "/images/products/windows10.jpg"
  },
  {
    id: "4",
    name: "Adobe Creative Cloud",
    description: "1-year subscription to Adobe Creative Cloud",
    price: 599.99,
    category: "Design Software",
    image: "/images/products/adobe.jpg",
    badge: "Popular"
  },
  {
    id: "5",
    name: "Avast Antivirus Premium",
    description: "Complete protection for your PC",
    price: 49.99,
    category: "Security Software",
    image: "/images/products/avast.jpg"
  },
  {
    id: "6",
    name: "VMware Workstation Pro",
    description: "Run multiple operating systems as virtual machines",
    price: 189.99,
    category: "Utilities",
    image: "/images/products/vmware.jpg"
  }
]

// Categories for filtering
const categories = [
  "All",
  "Operating Systems",
  "Office Software",
  "Design Software",
  "Security Software",
  "Utilities"
]

export default function ProductsPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className={cn("text-3xl font-bold mb-2", gradients.text)}>Software Keys</h1>
          <p className="text-muted-foreground">
            Browse our selection of genuine software licenses
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="h-10 w-full sm:w-[200px] pl-9 pr-4 rounded-md border border-input bg-background"
            />
          </div>
          
          <div className="dropdown">
            <Button variant="outline" size="icon" className="relative">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters sidebar - Would be interactive in full implementation */}
        <div className="w-full md:w-64 shrink-0">
          <div className={cn(
            "p-4 rounded-lg border border-border",
            "bg-card sticky top-20"
          )}>
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <label className="flex items-center space-x-2 text-sm">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                      defaultChecked={category === "All"}
                    />
                    <span>{category}</span>
                  </label>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Price Range</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Min</label>
                    <input type="number" placeholder="0" className="w-full h-8 rounded border border-input px-2" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Max</label>
                    <input type="number" placeholder="1000" className="w-full h-8 rounded border border-input px-2" />
                  </div>
                </div>
                <Button size="sm" className="w-full mt-2">
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Products grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div 
                key={product.id} 
                className={cn(
                  "group rounded-lg border border-border overflow-hidden",
                  "bg-card hover:shadow-lg transition-all duration-200",
                  "hover:border-primary/20",
                  animations.card
                )}
              >
                <div className="aspect-video relative bg-muted overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-4 text-center">
                      <div className="h-16 w-16 mx-auto mb-2 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ShoppingCart className="h-8 w-8 text-primary/80" />
                      </div>
                      <div className="text-sm font-medium text-primary">Product Image</div>
                    </div>
                  </div>
                  {product.badge && (
                    <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                      {product.badge}
                    </span>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-bold">${product.price.toFixed(2)}</span>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={animations.button}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                      <Button 
                        asChild
                        size="sm"
                        className={animations.button}
                      >
                        <Link href={`/products/${product.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 