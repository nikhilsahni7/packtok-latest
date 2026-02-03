/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@packtok/db";
import { ApiError } from "../utils/apiError";

/**
 * Check if user has purchased a product (verified purchase)
 * Supports BOTH cart purchases AND quote-based purchases
 */
export const hasUserPurchasedProduct = async (
  userId: string,
  productId: string
): Promise<boolean> => {
  console.log(`[REVIEW DEBUG] Checking purchase for userId: ${userId}, productId: ${productId}`);

  // Check 1: Cart-based purchases (spare parts, raw materials, consumables, cart-enabled machinery)
  const cartPurchase = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        status: {
          in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"],
        },
      },
    },
  });

  if (cartPurchase) return true;

  // Check 2: Quote-based purchases (machinery with completed quotes)
  const quotePurchase = await prisma.quoteRequest.findFirst({
    where: {
      productId,
      userId,
      status: "COMPLETED", // Quote was accepted and transaction completed
    },
  });

  return !!quotePurchase;
};

/**
 * Create a product review
 */
export const createReview = async (
  userId: string,
  productId: string,
  rating: number,
  comment?: string
) => {
  // Check if product exists
  const product = await prisma.marketplaceProduct.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check if user already reviewed this product
  const existingReview = await prisma.productReview.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this product");
  }

  // Check if it's a verified purchase
  const isVerified = await hasUserPurchasedProduct(userId, productId);

  // Create the review
  return prisma.productReview.create({
    data: {
      userId,
      productId,
      rating,
      comment,
      isVerified,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profile_image: true,
        },
      },
    },
  });
};

/**
 * Get reviews for a product
 */
export const getProductReviews = async (
  productId: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.productReview.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile_image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.productReview.count({ where: { productId } }),
  ]);

  return {
    reviews,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get review statistics for a product
 */
export const getReviewStats = async (productId: string) => {
  const stats = await prisma.productReview.aggregate({
    where: { productId },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  return {
    averageRating: stats._avg.rating || 0,
    totalReviews: stats._count.rating || 0,
  };
};

/**
 * Update a review (user can only edit their own)
 */
export const updateReview = async (
  reviewId: string,
  userId: string,
  rating: number,
  comment?: string
) => {
  const review = await prisma.productReview.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (review.userId !== userId) {
    throw new ApiError(403, "You can only edit your own reviews");
  }

  return prisma.productReview.update({
    where: { id: reviewId },
    data: {
      rating,
      comment,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profile_image: true,
        },
      },
    },
  });
};

/**
 * Delete a review (user can only delete their own)
 */
export const deleteReview = async (reviewId: string, userId: string) => {
  const review = await prisma.productReview.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (review.userId !== userId) {
    throw new ApiError(403, "You can only delete your own reviews");
  }

  return prisma.productReview.delete({
    where: { id: reviewId },
  });
};

/**
 * Get user's review for a specific product
 */
export const getUserReviewForProduct = async (
  userId: string,
  productId: string
) => {
  return prisma.productReview.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
};

/**
 * Admin: Get all reviews with filters
 */
export const getAllReviews = async (
  page: number = 1,
  limit: number = 20,
  filters?: {
    productId?: string;
    userId?: string;
    minRating?: number;
    maxRating?: number;
  }
) => {
  const skip = (page - 1) * limit;
  const where: any = {};

  if (filters?.productId) where.productId = filters.productId;
  if (filters?.userId) where.userId = filters.userId;
  if (filters?.minRating || filters?.maxRating) {
    where.rating = {};
    if (filters.minRating) where.rating.gte = filters.minRating;
    if (filters.maxRating) where.rating.lte = filters.maxRating;
  }

  const [reviews, total] = await Promise.all([
    prisma.productReview.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_image: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            imagesThumbnail: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.productReview.count({ where }),
  ]);

  return {
    reviews,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Admin: Delete any review (moderation)
 */
export const adminDeleteReview = async (reviewId: string) => {
  const review = await prisma.productReview.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  return prisma.productReview.delete({
    where: { id: reviewId },
  });
};
