import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/apiError";

const prisma = new PrismaClient();

export class UserTrackingService {
  // ===== BOOKMARKS / WISHLIST =====

  /**
   * Add a product to user's wishlist/bookmarks
   */
  static async addBookmark(userId: string, productId: string) {
    // Check if product exists
    const product = await prisma.marketplaceProduct.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // Check if already bookmarked
    const existing = await prisma.productBookmark.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      return existing; // Already bookmarked, return existing
    }

    // Create bookmark
    const bookmark = await prisma.productBookmark.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    return bookmark;
  }

  /**
   * Remove a product from user's wishlist/bookmarks
   */
  static async removeBookmark(userId: string, productId: string) {
    const bookmark = await prisma.productBookmark.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (!bookmark) {
      throw new ApiError(404, "Bookmark not found");
    }

    await prisma.productBookmark.delete({
      where: {
        userId_productId: { userId, productId },
      },
    });

    return { message: "Bookmark removed successfully" };
  }

  /**
   * Get all bookmarked products for a user
   */
  static async getUserBookmarks(
    userId: string,
    options: {
      page?: number;
      limit?: number;
    } = {}
  ) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      prisma.productBookmark.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.productBookmark.count({
        where: { userId },
      }),
    ]);

    return {
      bookmarks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Check if a product is bookmarked by user
   */
  static async isBookmarked(userId: string, productId: string) {
    const bookmark = await prisma.productBookmark.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    return { isBookmarked: !!bookmark };
  }

  // ===== SEARCH HISTORY =====

  /**
   * Track a search query
   */
  static async trackSearch(
    userId: string,
    searchTerm: string,
    filters?: any,
    resultsCount?: number
  ) {
    const searchHistory = await prisma.searchHistory.create({
      data: {
        userId,
        searchTerm: searchTerm.toLowerCase().trim(),
        filters: filters || null,
        resultsCount,
      },
    });

    return searchHistory;
  }

  /**
   * Get user's search history
   */
  static async getSearchHistory(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      unique?: boolean; // Only return unique search terms
    } = {}
  ) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    if (options.unique) {
      // Get unique search terms with most recent occurrence
      const searches = await prisma.searchHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        distinct: ["searchTerm"],
        take: limit,
      });

      return {
        searches,
        total: searches.length,
        page: 1,
        limit,
      };
    }

    const [searches, total] = await Promise.all([
      prisma.searchHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.searchHistory.count({
        where: { userId },
      }),
    ]);

    return {
      searches,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get popular/trending searches for a user (most frequent)
   */
  static async getPopularSearches(userId: string, limit: number = 10) {
    const searches = await prisma.$queryRaw<
      Array<{ searchTerm: string; count: bigint }>
    >`
      SELECT "searchTerm", COUNT(*) as count
      FROM "search_history"
      WHERE "userId" = ${userId}
      GROUP BY "searchTerm"
      ORDER BY count DESC
      LIMIT ${limit}
    `;

    return searches.map((s) => ({
      searchTerm: s.searchTerm,
      count: Number(s.count),
    }));
  }

  /**
   * Clear search history for a user
   */
  static async clearSearchHistory(userId: string) {
    await prisma.searchHistory.deleteMany({
      where: { userId },
    });

    return { message: "Search history cleared successfully" };
  }

  // ===== PRODUCT VIEW HISTORY =====

  /**
   * Track a product view
   */
  static async trackProductView(
    userId: string,
    productId: string,
    durationSeconds?: number
  ) {
    // Check if product exists
    const product = await prisma.marketplaceProduct.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // Check if user viewed this product recently (within last hour)
    const recentView = await prisma.productView.findFirst({
      where: {
        userId,
        productId,
        viewedAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // Last 1 hour
        },
      },
      orderBy: { viewedAt: "desc" },
    });

    if (recentView) {
      // Update the existing view with duration if provided
      if (durationSeconds !== undefined) {
        await prisma.productView.update({
          where: { id: recentView.id },
          data: { durationSeconds },
        });
      }
      return recentView;
    }

    // Create new view record
    const view = await prisma.productView.create({
      data: {
        userId,
        productId,
        durationSeconds,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    return view;
  }

  /**
   * Get user's recently viewed products
   */
  static async getRecentlyViewed(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      unique?: boolean; // Only return unique products
    } = {}
  ) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    if (options.unique) {
      // Get unique products with most recent view
      const views = await prisma.productView.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
        orderBy: { viewedAt: "desc" },
        distinct: ["productId"],
        take: limit,
      });

      return {
        views,
        total: views.length,
        page: 1,
        limit,
      };
    }

    const [views, total] = await Promise.all([
      prisma.productView.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
        orderBy: { viewedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.productView.count({
        where: { userId },
      }),
    ]);

    return {
      views,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get product recommendations based on user's view history
   * Returns products from same categories as viewed products
   */
  static async getRecommendations(userId: string, limit: number = 10) {
    // Get categories from recently viewed products
    const recentViews = await prisma.productView.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            categoryId: true,
          },
        },
      },
      orderBy: { viewedAt: "desc" },
      take: 20,
      distinct: ["productId"],
    });

    const categoryIds = [
      ...new Set(recentViews.map((v) => v.product.categoryId)),
    ];

    if (categoryIds.length === 0) {
      // No view history, return popular products
      return prisma.marketplaceProduct.findMany({
        where: {
          status: "AVAILABLE",
          submissionStatus: "APPROVED",
        },
        include: {
          category: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });
    }

    // Get viewed product IDs to exclude from recommendations
    const viewedProductIds = recentViews.map((v) => v.productId);

    // Get products from same categories
    const recommendations = await prisma.marketplaceProduct.findMany({
      where: {
        categoryId: { in: categoryIds },
        id: { notIn: viewedProductIds },
        status: "AVAILABLE",
        submissionStatus: "APPROVED",
      },
      include: {
        category: true,
      },
      take: limit,
    });

    return recommendations;
  }

  /**
   * Clear view history for a user
   */
  static async clearViewHistory(userId: string) {
    await prisma.productView.deleteMany({
      where: { userId },
    });

    return { message: "View history cleared successfully" };
  }

  // ===== ANALYTICS / INSIGHTS =====

  /**
   * Get user activity summary
   */
  static async getUserActivitySummary(userId: string) {
    const [bookmarksCount, searchesCount, viewsCount, recentSearches] =
      await Promise.all([
        prisma.productBookmark.count({ where: { userId } }),
        prisma.searchHistory.count({ where: { userId } }),
        prisma.productView.count({ where: { userId } }),
        this.getSearchHistory(userId, { limit: 5, unique: true }),
      ]);

    return {
      bookmarks: bookmarksCount,
      searches: searchesCount,
      views: viewsCount,
      recentSearches: recentSearches.searches,
    };
  }
}
