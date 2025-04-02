import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { animations, gradients } from "@/lib/theme"
import { ArrowRight, Shield, Zap, Clock } from "lucide-react"

const featuredProducts = [
  {
    id: "1",
    name: "Windows 11 Pro Key",
    description: "Genuine Windows 11 Professional License Key",
    price: 129.99,
    image: "/products/windows11.jpg",
    badge: "Best Seller"
  },
  {
    id: "2",
    name: "Microsoft Office 2021",
    description: "Lifetime license for Office Professional 2021",
    price: 199.99,
    image: "/products/office2021.jpg",
    badge: "Popular"
  },
  {
    id: "3",
    name: "Windows 10 Pro Key",
    description: "Authentic Windows 10 Professional License",
    price: 99.99,
    image: "/products/windows10.jpg",
    badge: "Limited Time"
  }
]

const categories = [
  {
    id: "1",
    name: "Operating Systems",
    description: "Windows and other OS licenses",
    image: "/categories/os.jpg",
    icon: Shield
  },
  {
    id: "2",
    name: "Office Software",
    description: "Microsoft Office and productivity tools",
    image: "/categories/office.jpg",
    icon: Zap
  },
  {
    id: "3",
    name: "Security Software",
    description: "Antivirus and security solutions",
    image: "/categories/security.jpg",
    icon: Shield
  },
  {
    id: "4",
    name: "Game Keys",
    description: "Digital keys for popular games",
    image: "/categories/games.jpg",
    icon: Clock
  }
]

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className={cn(
        "relative overflow-hidden rounded-xl py-20 mb-12",
        gradients.hero,
        "border border-border/50"
      )}>
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
        
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <h1 className={cn(
            "text-4xl sm:text-5xl lg:text-6xl font-bold mb-4",
            gradients.text,
            animations.scale
          )}>
            Welcome to Keybook.live
          </h1>
          <p className={cn(
            "text-lg sm:text-xl mb-8 text-muted-foreground",
            animations.fade
          )}>
            Your trusted source for genuine software licenses and digital keys
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              variant="default"
              className={cn("group", animations.button)}
            >
              <Link href="/products" className="flex items-center">
                Browse Keys
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className={animations.button}
            >
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className={cn("text-3xl font-bold", gradients.text)}>Featured Keys</h2>
          <Button 
            variant="outline" 
            asChild
            className={cn("group", animations.button)}
          >
            <Link href="/products" className="flex items-center">
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div 
              key={product.id} 
              className={cn(
                "group relative bg-card rounded-xl p-6",
                "border border-border/50",
                "hover:shadow-xl hover:shadow-primary/5",
                animations.card
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              <div className="relative">
                <div className="aspect-w-16 aspect-h-9 mb-4 bg-muted rounded-lg overflow-hidden">
                  <div className={cn(
                    "absolute inset-0",
                    gradients.card
                  )} />
                  {product.badge && (
                    <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                      {product.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-muted-foreground mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">${product.price}</span>
                  <Button 
                    asChild
                    className={cn("group", animations.button)}
                  >
                    <Link href={`/products/${product.id}`} className="flex items-center">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-16">
        <h2 className={cn("text-3xl font-bold mb-8", gradients.text)}>Browse Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className={cn(
                "group block",
                animations.card
              )}
            >
              <div className={cn(
                "bg-card rounded-xl p-6",
                "border border-border/50",
                "hover:shadow-xl hover:shadow-primary/5"
              )}>
                <div className="mb-4 p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  {category.icon && <category.icon className="h-6 w-6 text-primary" />}
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className={cn(
          "bg-card rounded-xl p-6 text-center",
          "border border-border/50",
          animations.card
        )}>
          <div className="mb-4 mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">100% Genuine Keys</h3>
          <p className="text-muted-foreground">All our keys are sourced directly from official suppliers</p>
        </div>
        <div className={cn(
          "bg-card rounded-xl p-6 text-center",
          "border border-border/50",
          animations.card
        )}>
          <div className="mb-4 mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Instant Delivery</h3>
          <p className="text-muted-foreground">Get your keys instantly after payment</p>
        </div>
        <div className={cn(
          "bg-card rounded-xl p-6 text-center",
          "border border-border/50",
          animations.card
        )}>
          <div className="mb-4 mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
          <p className="text-muted-foreground">Our support team is always here to help</p>
        </div>
      </section>
    </div>
  )
} 