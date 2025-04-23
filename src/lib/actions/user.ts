"use server";

import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcrypt";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function registerUser(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists with that email" };
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Return success and credentials for auto-login (we don't return the password)
    return { success: true, email };
  } catch (error) {
    return { error: "An error occurred during registration" };
  }
}

export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        orders: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    return { user };
  } catch (error) {
    return { error: "Failed to fetch user profile" };
  }
}

export async function updateUserProfile(userId: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const image = formData.get("image") as string;

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== userId) {
      return { error: "Email already in use by another account" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        image,
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update profile" };
  }
}

export async function changePassword(userId: string, formData: FormData) {
  try {
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        password: true,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Verify current password
    const isPasswordValid = await compare(currentPassword, user.password!);
    if (!isPasswordValid) {
      return { error: "Current password is incorrect" };
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to change password" };
  }
} 