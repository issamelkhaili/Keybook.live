"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCartStore } from "@/lib/stores/cart-store";

interface CartItem {
  id: string;
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    slug: string;
  };
  quantity: number;
}

interface CartItemCardProps {
  item: CartItem;
  showControls?: boolean;
}

export default function CartItemCard({ item, showControls = true }: CartItemCardProps) {
  const { removeItem, updateItemQuantity } = useCartStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setIsUpdating(true);
      await updateItemQuantity(item.id, newQuantity);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      setIsUpdating(true);
      await removeItem(item.id);
      toast({
        title: "Item removed",
        description: `${item.product.title} has been removed from your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-start space-x-4 py-4">
      <div className="relative h-20 w-20 overflow-hidden rounded-md bg-muted">
        <Image
          src={item.product.images[0] || "/images/placeholder.png"}
          alt={item.product.title}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="flex-1 space-y-1">
        <Link 
          href={`/product/${item.product.slug}`}
          className="font-medium hover:underline line-clamp-1"
        >
          {item.product.title}
        </Link>
        
        <div className="text-sm text-muted-foreground">
          ${item.product.price.toFixed(2)} each
        </div>
        
        {showControls ? (
          <div className="flex items-center space-x-4 pt-2">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-r-none"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease quantity</span>
              </Button>
              <div className="flex h-8 w-12 items-center justify-center border border-input">
                {item.quantity}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-l-none"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase quantity</span>
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-sm text-muted-foreground"
              onClick={handleRemove}
              disabled={isUpdating}
            >
              <X className="mr-1 h-4 w-4" />
              Remove
            </Button>
          </div>
        ) : (
          <div className="pt-1 text-sm">
            Quantity: {item.quantity}
          </div>
        )}
      </div>
      
      <div className="text-right font-medium">
        ${(item.product.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
} 