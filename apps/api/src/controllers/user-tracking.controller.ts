import { Request, Response } from "express";
import { UserTrackingService } from "../services/user-tracking.service";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export class UserTrackingController {
  // ===== BOOKMARKS / WISHLIST =====

  static addBookmark = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { productId } = req.body;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!productId) {
      throw new ApiError(400, "Product ID is required");
    }

    const bookmark = await UserTrackingService.addBookmark(userId, productId);

    res
      .status(201)
      .json(new ApiResponse(201, bookmark, "Product bookmarked successfully"));
  });

  static removeBookmark = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { productId } = req.params;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const result = await UserTrackingService.removeBookmark(userId, productId);

    res.status(200).json(new ApiResponse(200, result, result.message));
  });

  static getUserBookmarks = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!userId) {
        throw new ApiError(401, "Unauthorized");
      }

      const result = await UserTrackingService.getUserBookmarks(userId, {
        page,
        limit,
      });

      res
        .status(200)
        .json(
          new ApiResponse(200, result, "User bookmarks fetched successfully")
        );
    }
  );

  static checkBookmark = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { productId } = req.params;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const result = await UserTrackingService.isBookmarked(userId, productId);

    res.status(200).json(new ApiResponse(200, result, "Bookmark status"));
  });

  // ===== SEARCH HISTORY =====

  static trackSearch = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { searchTerm, filters, resultsCount } = req.body;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!searchTerm) {
      throw new ApiError(400, "Search term is required");
    }

    const search = await UserTrackingService.trackSearch(
      userId,
      searchTerm,
      filters,
      resultsCount
    );

    res
      .status(201)
      .json(new ApiResponse(201, search, "Search tracked successfully"));
  });

  static getSearchHistory = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const unique = req.query.unique === "true";

      if (!userId) {
        throw new ApiError(401, "Unauthorized");
      }

      const result = await UserTrackingService.getSearchHistory(userId, {
        page,
        limit,
        unique,
      });

      res
        .status(200)
        .json(
          new ApiResponse(200, result, "Search history fetched successfully")
        );
    }
  );

  static getPopularSearches = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?.id;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!userId) {
        throw new ApiError(401, "Unauthorized");
      }

      const searches = await UserTrackingService.getPopularSearches(
        userId,
        limit
      );

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            searches,
            "Popular searches fetched successfully"
          )
        );
    }
  );

  static clearSearchHistory = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(401, "Unauthorized");
      }

      const result = await UserTrackingService.clearSearchHistory(userId);

      res.status(200).json(new ApiResponse(200, result, result.message));
    }
  );

  // ===== PRODUCT VIEW HISTORY =====

  static trackProductView = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?.id;
      const { productId, durationSeconds } = req.body;

      if (!userId) {
        throw new ApiError(401, "Unauthorized");
      }

      if (!productId) {
        throw new ApiError(400, "Product ID is required");
      }

      const view = await UserTrackingService.trackProductView(
        userId,
        productId,
        durationSeconds
      );

      res
        .status(201)
        .json(new ApiResponse(201, view, "Product view tracked successfully"));
    }
  );

  static getRecentlyViewed = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const unique = req.query.unique === "true";

      if (!userId) {
        throw new ApiError(401, "Unauthorized");
      }

      const result = await UserTrackingService.getRecentlyViewed(userId, {
        page,
        limit,
        unique,
      });

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            result,
            "Recently viewed products fetched successfully"
          )
        );
    }
  );

  static getRecommendations = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?.id;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!userId) {
        throw new ApiError(401, "Unauthorized");
      }

      const recommendations = await UserTrackingService.getRecommendations(
        userId,
        limit
      );

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            recommendations,
            "Recommendations fetched successfully"
          )
        );
    }
  );

  static clearViewHistory = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(401, "Unauthorized");
      }

      const result = await UserTrackingService.clearViewHistory(userId);

      res.status(200).json(new ApiResponse(200, result, result.message));
    }
  );

  // ===== ANALYTICS / INSIGHTS =====

  static getActivitySummary = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(401, "Unauthorized");
      }

      const summary = await UserTrackingService.getUserActivitySummary(userId);

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            summary,
            "User activity summary fetched successfully"
          )
        );
    }
  );
}
