import { NextRequest, NextResponse } from "next/server";
import { addToCart } from "@/lib/cart";

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const cart = await addToCart(productId, quantity);

    return NextResponse.json({ cart });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to add item to cart" },
      { status: 500 }
    );
  }
} 