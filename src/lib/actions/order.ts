"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";

export async function createOrder(
  userId: string,
  items: { productId: string; quantity: number; price: number }[],
  paymentMethod: string
) {
  try {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    // Generate a unique order number
    const orderNumber = `BKP-${nanoid(8).toUpperCase()}`;
    
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        total,
        paymentMethod,
        status: "PAID", // Assuming payment is processed before creating order
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
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
    
    revalidatePath('/orders');
    revalidatePath('/profile');
    return { order };
  } catch (error) {
    return { error: "Failed to create order" };
  }
}

export async function getOrders(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId
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
    
    return { orders };
  } catch (error) {
    return { error: "Failed to fetch orders" };
  }
}

export async function getOrderById(orderId: string, userId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId // Ensures the user can only access their own orders
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    if (!order) {
      return { error: "Order not found" };
    }
    
    return { order };
  } catch (error) {
    return { error: "Failed to fetch order" };
  }
}

// Admin functions
export async function getAllOrders(page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;
    
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.order.count()
    ]);
    
    return { 
      orders,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    };
  } catch (error) {
    return { error: "Failed to fetch orders" };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status as any
      }
    });
    
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);
    return { order };
  } catch (error) {
    return { error: "Failed to update order status" };
  }
} 