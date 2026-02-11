import { Role } from "@packtok/db";
import { Router } from "express";
import {
  cancelMySubscription,
  checkProductLimit,
  getMySubscription,
  getMySubscriptionHistory,
  listPlans,
  subscribe,
  verifyPayment,
} from "../controllers/subscription.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { hasRole } from "../middlewares/roles.middleware";

const router = Router();

// Public – list available plans (no auth needed)
router.get("/plans", listPlans);

// Vendor-only routes
router.use(authMiddleware, hasRole(Role.VENDOR));
router.get("/me", getMySubscription);
router.get("/me/history", getMySubscriptionHistory);
router.post("/subscribe", subscribe);
router.post("/verify-payment", verifyPayment);
router.post("/cancel", cancelMySubscription);
router.get("/product-limit", checkProductLimit);

export default router;
