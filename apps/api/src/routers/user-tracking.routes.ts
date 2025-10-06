import { Router } from "express";
import { UserTrackingController } from "../controllers/user-tracking.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// ===== BOOKMARKS / WISHLIST ROUTES =====
router.post("/bookmarks", UserTrackingController.addBookmark);
router.delete("/bookmarks/:productId", UserTrackingController.removeBookmark);
router.get("/bookmarks", UserTrackingController.getUserBookmarks);
router.get("/bookmarks/check/:productId", UserTrackingController.checkBookmark);

// ===== SEARCH HISTORY ROUTES =====
router.post("/search-history", UserTrackingController.trackSearch);
router.get("/search-history", UserTrackingController.getSearchHistory);
router.get(
  "/search-history/popular",
  UserTrackingController.getPopularSearches
);
router.delete("/search-history", UserTrackingController.clearSearchHistory);

// ===== PRODUCT VIEW HISTORY ROUTES =====
router.post("/views", UserTrackingController.trackProductView);
router.get("/views", UserTrackingController.getRecentlyViewed);
router.delete("/views", UserTrackingController.clearViewHistory);

// ===== RECOMMENDATIONS =====
router.get("/recommendations", UserTrackingController.getRecommendations);

// ===== ANALYTICS / INSIGHTS =====
router.get("/activity-summary", UserTrackingController.getActivitySummary);

export default router;
