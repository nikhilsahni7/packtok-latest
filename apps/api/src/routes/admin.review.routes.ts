import { Router } from "express";
import {
    adminListReviews,
    adminRemoveReview,
} from "../controllers/admin.review.controller";

const router = Router();

router.get("/", adminListReviews);
router.delete("/:reviewId", adminRemoveReview);

export default router;
