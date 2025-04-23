import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getProductBySlug } from "@/lib/actions/product";
import AddToCartButton from "@/components/product/AddToCartButton";
import ProductReviews from "@/components/product/ProductReviews";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductFaq from "@/components/product/ProductFaq";
import RelatedProducts from "@/components/product/RelatedProducts";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { product, error } = await getProductBySlug(params.slug);

  if (error || !product) {
    return {
      title: "Product Not Found | BookPlus",
      description: "The product you're looking for could not be found."
    };
  }

  return {
    title: `${product.title} | BookPlus`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { product, error } = await getProductBySlug(params.slug);

  if (error || !product) {
    notFound();
  }

  // Calculate average rating
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Images */}
        <ProductImageGallery images={product.images} title={product.title} />

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.title}</h1>
            
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-yellow-400">
                    {star <= Math.round(avgRating) ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews.length} reviews)
              </span>
            </div>

            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              <span className="ml-2 text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                Earn {product.rewardPoints} points
              </span>
            </div>

            {product.platform && (
              <div className="flex items-center mb-6">
                <span className="text-sm text-muted-foreground mr-2">Platform:</span>
                <div className="flex items-center">
                  {product.platformIcon && (
                    <Image 
                      src={product.platformIcon} 
                      alt={product.platform} 
                      width={20} 
                      height={20} 
                      className="mr-1" 
                    />
                  )}
                  <span>{product.platform}</span>
                </div>
              </div>
            )}

            <p className="text-muted-foreground mb-6">{product.description}</p>

            <div className="flex items-center space-x-4">
              <AddToCartButton productId={product.id} />
              <Button variant="outline">Add to Wishlist</Button>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-10" />

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="space-y-4">
          <h2 className="text-xl font-semibold">About this product</h2>
          <div className="text-muted-foreground">
            <p>{product.description}</p>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews">
          <ProductReviews productSlug={params.slug} initialReviews={product.reviews} />
        </TabsContent>
        
        <TabsContent value="faq">
          <ProductFaq faqs={product.faq} />
        </TabsContent>
      </Tabs>

      <Separator className="my-10" />

      <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
    </div>
  );
} 