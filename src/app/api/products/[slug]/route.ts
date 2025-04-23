import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        faq: true
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Calculate average rating
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
      : 0;

    // Get related products
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id }
      },
      include: {
        reviews: {
          select: {
            rating: true
          }
        }
      },
      take: 4
    });

    // Add average rating to related products
    const relatedWithRating = relatedProducts.map(related => {
      const rating = related.reviews.length > 0
        ? related.reviews.reduce((acc, review) => acc + review.rating, 0) / related.reviews.length
        : 0;
      return {
        ...related,
        avgRating: rating
      };
    });

    return NextResponse.json({
      product: {
        ...product,
        avgRating
      },
      relatedProducts: relatedWithRating
    });
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
} 