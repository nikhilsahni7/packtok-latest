import { Router } from "express";
import {
    canUserReview,
    editReview,
    getProductReviewStats,
    listProductReviews,
    removeReview,
    submitReview,
} from "../controllers/review.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public routes - get reviews
router.get("/products/:productId/reviews", listProductReviews);
router.get("/products/:productId/reviews/stats", getProductReviewStats);

// Protected routes - submit/edit/delete reviews
router.post("/products/:productId/reviews", authMiddleware, submitReview);
router.get("/products/:productId/reviews/can-review", authMiddleware, canUserReview);
router.put("/reviews/:reviewId", authMiddleware, editReview);
router.delete("/reviews/:reviewId", authMiddleware, removeReview);

export default router;
