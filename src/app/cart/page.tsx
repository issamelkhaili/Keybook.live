"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, MinusCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCart } from "@/lib/cart";
import { Separator } from "@/components/ui/separator";
import CartItemCard from "@/components/cart/CartItemCard";
import { ShoppingBag, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Your Cart | BookPlus",
  description: "View and manage items in your shopping cart",
};

export default function CartPage() {
  const cart = getCart();

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Button asChild>
            <Link href="/games">Browse Games</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>$0.00</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">${cart.totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <Button asChild className="w-full mb-4">
                <Link href="/checkout" className="flex items-center justify-center">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                By proceeding, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 