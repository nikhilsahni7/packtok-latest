/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import {
    adminDeleteReview,
    getAllReviews,
} from "../services/review.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * Admin: List all reviews with filters
 * GET /api/v1/admins/reviews
 */
export const adminListReviews = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const filters: any = {};
    if (req.query.productId) filters.productId = req.query.productId as string;
    if (req.query.userId) filters.userId = req.query.userId as string;
    if (req.query.minRating) filters.minRating = parseInt(req.query.minRating as string);
    if (req.query.maxRating) filters.maxRating = parseInt(req.query.maxRating as string);

    const result = await getAllReviews(page, limit, filters);
    res
      .status(200)
      .json(new ApiResponse(200, result, "Reviews fetched successfully"));
  }
);

/**
 * Admin: Delete a review (moderation)
 * DELETE /api/v1/admins/reviews/:reviewId
 */
export const adminRemoveReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    await adminDeleteReview(reviewId);
    res.status(200).json(new ApiResponse(200, null, "Review deleted"));
  }
);
