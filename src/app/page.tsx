import Link from "next/link"
import { Button } from "@/components/ui/button"

const featuredProducts = [
  {
    id: "1",
    name: "Windows 11 Pro Key",
    description: "Genuine Windows 11 Professional License Key",
    price: 129.99,
    image: "/products/windows11.jpg"
  },
  {
    id: "2",
    name: "Microsoft Office 2021",
    description: "Lifetime license for Office Professional 2021",
    price: 199.99,
    image: "/products/office2021.jpg"
  },
  {
    id: "3",
    name: "Windows 10 Pro Key",
    description: "Authentic Windows 10 Professional License",
    price: 99.99,
    image: "/products/windows10.jpg"
  }
]

const categories = [
  {
    id: "1",
    name: "Operating Systems",
    description: "Windows and other OS licenses",
    image: "/categories/os.jpg"
  },
  {
    id: "2",
    name: "Office Software",
    description: "Microsoft Office and productivity tools",
    image: "/categories/office.jpg"
  },
  {
    id: "3",
    name: "Security Software",
    description: "Antivirus and security solutions",
    image: "/categories/security.jpg"
  },
  {
    id: "4",
    name: "Game Keys",
    description: "Digital keys for popular games",
    image: "/categories/games.jpg"
  }
]

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20 mb-12">
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome to Keybook.live
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Your trusted source for genuine software licenses and digital keys
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" variant="default">
              <Link href="/products">Browse Keys</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Keys</h2>
          <Button variant="outline" asChild>
            <Link href="/products">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="group relative bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              <div className="relative">
                <div className="aspect-w-16 aspect-h-9 mb-4 bg-muted rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-muted-foreground mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">${product.price}</span>
                  <Button asChild>
                    <Link href={`/products/${product.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Browse Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group block"
            >
              <div className="bg-card rounded-xl p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="aspect-w-16 aspect-h-9 mb-4 bg-gradient-to-br from-primary/20 to-background rounded-lg" />
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-card rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">100% Genuine Keys</h3>
          <p className="text-muted-foreground">All our keys are sourced directly from official suppliers</p>
        </div>
        <div className="bg-card rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Instant Delivery</h3>
          <p className="text-muted-foreground">Get your keys instantly after payment</p>
        </div>
        <div className="bg-card rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
          <p className="text-muted-foreground">Our support team is always here to help</p>
        </div>
      </section>
    </div>
  )
} 