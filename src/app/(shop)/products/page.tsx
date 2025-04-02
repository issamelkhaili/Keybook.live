"use client"

import { useState } from "react"
import { ProductCard } from "@/components/shop/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal } from "lucide-react"

// Temporary mock data - will be replaced with actual API calls
const mockProducts = [
  {
    id: "1",
    name: "Digital Marketing Guide",
    description: "A comprehensive guide to digital marketing strategies and best practices.",
    price: 29.99,
    images: ["/images/products/digital-marketing.jpg"],
    category: "Marketing",
  },
  {
    id: "2",
    name: "Web Development Course",
    description: "Learn web development from scratch with this complete course.",
    price: 49.99,
    images: ["/images/products/web-dev.jpg"],
    category: "Development",
  },
  // Add more mock products as needed
]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const categories = Array.from(
    new Set(mockProducts.map((product) => product.category))
  )

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">All Products</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {isFilterOpen && (
          <div className="p-4 border rounded-lg space-y-4">
            <h2 className="font-semibold">Categories</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No products found. Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  )
} 