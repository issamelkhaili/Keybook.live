"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Mock wishlist data
const initialWishlistItems = [
  {
    id: 1,
    name: "Windows 11 Pro",
    price: 4.99,
    image: "/images/windows-11.jpg",
    inStock: true,
  },
  {
    id: 2,
    name: "Microsoft Office 365 Personal",
    price: 55.58,
    image: "/images/office-365.jpg",
    inStock: true,
  },
  {
    id: 3,
    name: "Star Wars Jedi: Survivor",
    price: 17.43,
    image: "/images/star-wars.jpg",
    inStock: false,
  },
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);

  const removeFromWishlist = (id: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
    toast.success("Item removed from wishlist");
  };

  const addToCart = (id: number) => {
    // In a real app, you would add to cart via an API call
    toast.success("Item added to cart");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center space-x-2 mb-8">
        <Heart className="text-primary" size={24} />
        <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
      </div>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-12 bg-slate-800 rounded-lg">
          <Heart className="mx-auto text-slate-500" size={48} />
          <h2 className="text-xl text-slate-300 mt-4 mb-6">Your wishlist is empty</h2>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Stock Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {wishlistItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                        <div
                          className="h-full w-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${item.image})` }}
                        ></div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{item.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">${item.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.inStock
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <Trash2 size={16} className="mr-1" />
                        Remove
                      </Button>
                      
                      <Button
                        size="sm"
                        disabled={!item.inStock}
                        onClick={() => addToCart(item.id)}
                      >
                        <ShoppingCart size={16} className="mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <Link href="/" className="text-primary hover:underline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
} 