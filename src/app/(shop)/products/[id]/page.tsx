"use client"

import { useState } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

// Temporary mock data - will be replaced with actual API calls
const mockProducts = [
  {
    id: "1",
    name: "Digital Marketing Guide",
    description: "A comprehensive guide to digital marketing strategies and best practices. Learn how to create effective digital marketing campaigns, understand SEO, social media marketing, email marketing, and more. This guide includes practical examples and case studies to help you implement successful marketing strategies.",
    price: 29.99,
    images: ["/images/products/digital-marketing.jpg"],
    category: "Marketing",
    features: [
      "Comprehensive digital marketing strategies",
      "SEO best practices",
      "Social media marketing techniques",
      "Email marketing templates",
      "Analytics and reporting guides"
    ]
  },
  // Add more mock products as needed
]

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const product = mockProducts.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  async function addToCart() {
    setIsAddingToCart(true)
    // TODO: Implement cart functionality
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsAddingToCart(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border ${
                    selectedImage === index ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-bold mt-2 text-primary">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="prose dark:prose-invert">
            <p>{product.description}</p>
          </div>

          {product.features && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-muted-foreground">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={addToCart}
              disabled={isAddingToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          <div className="pt-6 mt-6 border-t">
            <h3 className="text-lg font-semibold mb-2">Product Details</h3>
            <dl className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Category</dt>
                <dd className="font-medium">{product.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Format</dt>
                <dd className="font-medium">Digital Download</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
} 