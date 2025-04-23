"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getProducts({ 
  category,
  searchQuery,
  limit
}: { 
  category?: string;
  searchQuery?: string;
  limit?: number;
}) {
  try {
    const where = {
      ...(category ? { category: { slug: category } } : {}),
      ...(searchQuery ? { 
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } }
        ] 
      } : {})
    };

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        reviews: {
          select: {
            rating: true
          }
        }
      },
      take: limit || undefined,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      products: products.map(product => ({
        ...product,
        avgRating: product.reviews.length > 0 
          ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
          : 0
      }))
    };
  } catch (error) {
    return { error: "Failed to fetch products" };
  }
}

export async function getProductBySlug(slug: string) {
  try {
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
      return { error: "Product not found" };
    }

    return { product };
  } catch (error) {
    return { error: "Failed to fetch product" };
  }
}

export async function createProduct(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const categoryId = formData.get('categoryId') as string;
    const platform = formData.get('platform') as string;
    const platformIcon = formData.get('platformIcon') as string;
    const rewardPoints = formData.get('rewardPoints') as string;
    const images = formData.getAll('images') as string[];

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price: parseFloat(price),
        categoryId,
        platform,
        platformIcon,
        rewardPoints: parseInt(rewardPoints),
        images,
        inStock: true,
      }
    });

    revalidatePath('/admin/products');
    redirect('/admin/products');
  } catch (error) {
    return { error: "Failed to create product" };
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const categoryId = formData.get('categoryId') as string;
    const platform = formData.get('platform') as string;
    const platformIcon = formData.get('platformIcon') as string;
    const rewardPoints = formData.get('rewardPoints') as string;
    const images = formData.getAll('images') as string[];
    const inStock = formData.get('inStock') === 'on';

    await prisma.product.update({
      where: { id: productId },
      data: {
        title,
        description,
        price: parseFloat(price),
        categoryId,
        platform,
        platformIcon,
        rewardPoints: parseInt(rewardPoints),
        images,
        inStock,
      }
    });

    revalidatePath(`/admin/products/${productId}`);
    revalidatePath(`/product/${productId}`);
    redirect('/admin/products');
  } catch (error) {
    return { error: "Failed to update product" };
  }
}

export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({
      where: { id: productId }
    });

    revalidatePath('/admin/products');
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete product" };
  }
} 