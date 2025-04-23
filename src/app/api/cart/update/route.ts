import { NextRequest, NextResponse } from "next/server";
import { updateCartItemQuantity } from "@/lib/cart";

export async function POST(request: NextRequest) {
  try {
    const { itemId, quantity } = await request.json();

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: "Item ID and quantity are required" },
        { status: 400 }
      );
    }

    const cart = updateCartItemQuantity(itemId, quantity);

    return NextResponse.json({ cart });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update cart" },
      { status: 500 }
    );
  }
} 