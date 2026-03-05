"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { headers } from "next/headers";
import {
  updateProfileSchema,
  type UpdateProfileData,
} from "@/lib/actions/profile-schema";

export async function getUserProfile() {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        joinDate: true,
        emailVerified: true,
        _count: {
          select: {
            notebooks: true,
            favoritePages: true,
            scanHistory: true,
          },
        },
      },
    });
    console.log("user:", user);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      success: true,
      data: {
        ...user,
        joinDate: user.joinDate.toISOString(),
      },
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch profile",
    };
  }
}

export async function updateUserProfile(data: UpdateProfileData) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Validate input data
    const validatedData = updateProfileSchema.parse(data);

    // Check if email is already taken by another user
    if (validatedData.email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (existingUser && existingUser.id !== session.user.id) {
        throw new Error("Email is already in use");
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.name,
        email: validatedData.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        joinDate: true,
        emailVerified: true,
        _count: {
          select: {
            notebooks: true,
            favoritePages: true,
            scanHistory: true,
          },
        },
      },
    });

    // Revalidate the profile page to show updated data
    revalidatePath("/profile");

    return {
      success: true,
      data: {
        ...updatedUser,
        joinDate: updatedUser.joinDate.toISOString(),
      },
    };
  } catch (error) {
    console.error("Error updating user profile:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}

export async function getUserStats() {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const [notebooksCount, pagesCount, scansCount] = await Promise.all([
      prisma.notebook.count({
        where: { userId: session.user.id },
      }),
      prisma.page.count({
        where: {
          chapter: {
            notebook: {
              userId: session.user.id,
            },
          },
        },
      }),
      prisma.scanHistory.count({
        where: { userId: session.user.id },
      }),
    ]);

    return {
      success: true,
      data: {
        notebooksCount,
        pagesCount,
        scansCount,
      },
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch stats",
    };
  }
}
