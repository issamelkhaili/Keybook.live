import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1;
    const take = limit;
    const skip = take ? (page - 1) * take : undefined;

    // Build the where clause based on provided filters
    const where: any = {};
    
    if (category) {
      where.category = {
        slug: category
      };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Execute query
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          reviews: {
            select: {
              rating: true
            }
          }
        },
        skip,
        take,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.product.count({ where })
    ]);

    // Calculate average rating for each product
    const productsWithRating = products.map(product => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
        : 0;
      
      return {
        ...product,
        avgRating
      };
    });

    return NextResponse.json({
      products: productsWithRating,
      pagination: {
        total,
        page,
        pageSize: limit,
        pageCount: limit ? Math.ceil(total / limit) : 1
      }
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
} 