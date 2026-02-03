/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import {
    createReview,
    deleteReview,
    getProductReviews,
    getReviewStats,
    getUserReviewForProduct,
    hasUserPurchasedProduct,
    updateReview,
} from "../services/review.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * Submit a review for a product
 * POST /api/v1/products/:productId/reviews
 */
export const submitReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user!.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Rating must be between 1 and 5"));
    }

    const review = await createReview(userId, productId, rating, comment);
    res.status(201).json(new ApiResponse(201, review, "Review submitted"));
  }
);

/**
 * Get reviews for a product
 * GET /api/v1/products/:productId/reviews
 */
export const listProductReviews = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getProductReviews(productId, page, limit);
    res
      .status(200)
      .json(new ApiResponse(200, result, "Reviews fetched successfully"));
  }
);

/**
 * Get review statistics for a product
 * GET /api/v1/products/:productId/reviews/stats
 */
export const getProductReviewStats = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    const stats = await getReviewStats(productId);
    res
      .status(200)
      .json(
        new ApiResponse(200, stats, "Review stats fetched successfully")
      );
  }
);

/**
 * Update a review
 * PUT /api/v1/reviews/:reviewId
 */
export const editReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user!.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Rating must be between 1 and 5"));
    }

    const review = await updateReview(reviewId, userId, rating, comment);
    res.status(200).json(new ApiResponse(200, review, "Review updated"));
  }
);

/**
 * Delete a review
 * DELETE /api/v1/reviews/:reviewId
 */
export const removeReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const userId = req.user!.id;

    await deleteReview(reviewId, userId);
    res.status(200).json(new ApiResponse(200, null, "Review deleted"));
  }
);

/**
 * Check if user can review a product
 * GET /api/v1/products/:productId/reviews/can-review
 */
export const canUserReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    const userId = req.user!.id;

    // Check if user has already reviewed
    const existingReview = await getUserReviewForProduct(userId, productId);

    if (existingReview) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            canReview: false,
            reason: "already_reviewed",
            existingReview,
          },
          "User has already reviewed this product"
        )
      );
    }

    // Check if user has purchased
    const hasPurchased = await hasUserPurchasedProduct(userId, productId);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          canReview: hasPurchased,
          reason: hasPurchased ? "can_review" : "not_purchased",
        },
        hasPurchased
          ? "User can review this product"
          : "User must purchase the product first"
      )
    );
  }
);
