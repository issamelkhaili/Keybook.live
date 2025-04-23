import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export interface ProductCardProps {
  product: {
    id: number;
    title: string;
    image: string;
    price: string;
    rating: number;
    inStock: boolean;
    href: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="product-card bg-slate-800 border-slate-700 overflow-hidden">
      <Link href={product.href}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${product.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
          {/* Stock label */}
          <div className={`absolute top-2 left-2 ${product.inStock ? "in-stock" : "out-of-stock"}`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        {/* Rating */}
        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
            />
          ))}
        </div>

        {/* Title */}
        <Link href={product.href}>
          <h3 className="text-sm text-white font-medium hover:text-primary transition-colors line-clamp-2 h-10">
            {product.title}
          </h3>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="product-price">{product.price}</span>
        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
          BUY NOW
        </Button>
      </CardFooter>
    </Card>
  );
} 