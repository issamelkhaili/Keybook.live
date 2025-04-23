import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export type CartItem = {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
};

// Cookie name for the cart
const CART_COOKIE = "bookplus_cart";

// Get cart from cookies
export function getCart(): Cart {
  const cookieStore = cookies();
  const cartCookie = cookieStore.get(CART_COOKIE);
  
  if (!cartCookie?.value) {
    return { items: [], totalItems: 0, totalPrice: 0 };
  }
  
  try {
    const cart = JSON.parse(cartCookie.value) as Cart;
    return {
      ...cart,
      totalItems: cart.items.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    };
  } catch (error) {
    return { items: [], totalItems: 0, totalPrice: 0 };
  }
}

// Add item to cart
export async function addToCart(productId: string, quantity: number = 1): Promise<Cart> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      title: true,
      price: true,
      images: true,
      inStock: true
    }
  });

  if (!product || !product.inStock) {
    throw new Error("Product not available");
  }

  const cart = getCart();
  const existingItem = cart.items.find(item => item.productId === productId);
  
  if (existingItem) {
    // Update existing item quantity
    existingItem.quantity += quantity;
  } else {
    // Add new item
    cart.items.push({
      id: `cart_${Date.now()}_${productId}`,
      productId: product.id,
      title: product.title,
      price: parseFloat(product.price.toString()),
      image: product.images[0] || "",
      quantity
    });
  }
  
  cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Save cart to cookies
  const cookieStore = cookies();
  cookieStore.set(CART_COOKIE, JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/"
  });
  
  return cart;
}

// Update item quantity
export function updateCartItemQuantity(itemId: string, quantity: number): Cart {
  const cart = getCart();
  const item = cart.items.find(item => item.id === itemId);
  
  if (item) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items = cart.items.filter(item => item.id !== itemId);
    } else {
      // Update quantity
      item.quantity = quantity;
    }
    
    cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    // Save cart to cookies
    const cookieStore = cookies();
    cookieStore.set(CART_COOKIE, JSON.stringify(cart), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/"
    });
  }
  
  return cart;
}

// Remove item from cart
export function removeCartItem(itemId: string): Cart {
  const cart = getCart();
  cart.items = cart.items.filter(item => item.id !== itemId);
  
  cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Save cart to cookies
  const cookieStore = cookies();
  cookieStore.set(CART_COOKIE, JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/"
  });
  
  return cart;
}

// Clear cart
export function clearCart(): Cart {
  const emptyCart: Cart = { items: [], totalItems: 0, totalPrice: 0 };
  
  // Save empty cart to cookies
  const cookieStore = cookies();
  cookieStore.set(CART_COOKIE, JSON.stringify(emptyCart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/"
  });
  
  return emptyCart;
} 