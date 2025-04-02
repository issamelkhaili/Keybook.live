import { cn } from "@/lib/utils"
import { animations, gradients } from "@/lib/theme"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingCart, Search, Filter, ChevronLeft } from "lucide-react"

// Sample categories data
const categories = [
  {
    id: "games",
    name: "Game Keys",
    description: "Digital keys for popular games across all platforms",
    image: "/images/categories/games.jpg",
    products: [
      {
        id: "101",
        name: "Cyberpunk 2077",
        description: "PC digital key - GOG.com",
        price: 59.99,
        image: "/images/products/cyberpunk.jpg",
        badge: "Best Seller"
      },
      {
        id: "102",
        name: "FIFA 23",
        description: "PC digital key - Origin",
        price: 69.99,
        image: "/images/products/fifa.jpg"
      },
      {
        id: "103",
        name: "Minecraft Java Edition",
        description: "PC digital key",
        price: 29.99,
        image: "/images/products/minecraft.jpg"
      },
      {
        id: "104",
        name: "Call of Duty: Modern Warfare",
        description: "PC digital key - Battle.net",
        price: 59.99,
        image: "/images/products/cod.jpg"
      }
    ]
  },
  {
    id: "os",
    name: "Operating Systems",
    description: "Windows and other OS licenses",
    image: "/images/categories/os.jpg",
    products: [
      {
        id: "1",
        name: "Windows 11 Pro",
        description: "Genuine Windows 11 Professional License Key",
        price: 129.99,
        image: "/images/products/windows11.jpg",
        badge: "Best Seller"
      },
      {
        id: "3",
        name: "Windows 10 Pro",
        description: "Authentic Windows 10 Professional License",
        price: 99.99,
        image: "/images/products/windows10.jpg"
      }
    ]
  }
]

export default function CategoryPage({ params }: { params: { id: string } }) {
  const { id } = params
  
  // Find category by ID
  const category = categories.find(c => c.id === id)
  
  // If category not found, show 404
  if (!category) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        <p className="mb-8 text-muted-foreground">
          The category you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/products">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Browse All Products
          </Link>
        </Button>
      </div>
    )
  }
  
  return (
    <div className="container py-10">
      <div className="mb-6">
        <Button variant="ghost" asChild className={animations.button}>
          <Link href="/products" className="flex items-center text-muted-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" />
            All Categories
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className={cn("text-3xl font-bold mb-2", gradients.text)}>
            {category.name}
          </h1>
          <p className="text-muted-foreground">
            {category.description}
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search in this category..." 
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
      
      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {category.products.map((product) => (
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
                  <div className="h-12 w-12 mx-auto mb-2 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-primary/80" />
                  </div>
                  <div className="text-xs font-medium text-primary">Product Image</div>
                </div>
              </div>
              {product.badge && (
                <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                  {product.badge}
                </span>
              )}
            </div>
            
            <div className="p-4">
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
                    <ShoppingCart className="h-4 w-4" />
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
  )
} 