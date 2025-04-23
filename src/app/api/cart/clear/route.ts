import { NextResponse } from "next/server";
import { clearCart } from "@/lib/cart";

export async function POST() {
  try {
    const cart = clearCart();
    return NextResponse.json({ cart });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to clear cart" },
      { status: 500 }
    );
  }
} 