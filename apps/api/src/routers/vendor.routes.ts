import { Router } from "express";
import {
  applyVendor,
  getMyVendorApplication,
  getMyVendorDashboardAnalytics,
} from "../controllers/vendor.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/apply", authMiddleware, applyVendor);
router.get("/me/application", authMiddleware, getMyVendorApplication);
router.get(
  "/me/dashboard-analytics",
  authMiddleware,
  getMyVendorDashboardAnalytics
);

export default router;
