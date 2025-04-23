import { NextRequest, NextResponse } from "next/server";
import { removeCartItem } from "@/lib/cart";

export async function POST(request: NextRequest) {
  try {
    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    const cart = removeCartItem(itemId);

    return NextResponse.json({ cart });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to remove item from cart" },
      { status: 500 }
    );
  }
} 