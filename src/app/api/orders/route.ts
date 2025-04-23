import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { clearCart } from "@/lib/cart";
import { nanoid } from "nanoid";

// Get user's orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to view orders" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true,
                slug: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// Create a new order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to place an order" },
        { status: 401 }
      );
    }

    const { items, paymentMethod, paymentId } = await request.json();

    if (!items || !items.length) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    const total = items.reduce((acc: number, item: any) => 
      acc + (parseFloat(item.price) * item.quantity), 0);
    
    // Generate a unique order number
    const orderNumber = `BKP-${nanoid(8).toUpperCase()}`;
    
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        total,
        paymentMethod,
        paymentId,
        status: "PAID", // Assuming payment is processed before creating order
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: parseFloat(item.price),
            // In a real implementation, you would generate or assign digital keys here
            key: `XXXX-XXXX-XXXX-${nanoid(4).toUpperCase()}`
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    // Clear the cart after successful order
    clearCart();

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
} 