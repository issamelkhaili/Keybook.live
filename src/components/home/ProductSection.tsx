import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";

export interface Product {
  id: number;
  title: string;
  image: string;
  price: string;
  rating: number;
  inStock: boolean;
  href: string;
}

interface ProductSectionProps {
  title: string;
  viewAllLink: string;
  products: Product[];
}

export function ProductSection({ title, viewAllLink, products }: ProductSectionProps) {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <Link href={viewAllLink} className="text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
} 