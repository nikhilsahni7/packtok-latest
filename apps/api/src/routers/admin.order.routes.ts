import { Role } from "@packtok/db";
import { Router } from "express";
import {
    getOrder,
    getStats,
    listOrders,
    updateStatus,
    updateTracking,
} from "../controllers/admin.order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { hasRole } from "../middlewares/roles.middleware";

const router = Router();

// All admin order routes require authentication and admin role
router.use(authMiddleware, hasRole(Role.ADMIN, Role.SUPER_ADMIN));

router.get("/stats", getStats);
router.get("/", listOrders);
router.get("/:id", getOrder);
router.patch("/:id/status", updateStatus);
router.patch("/:id/tracking", updateTracking);

export default router;
