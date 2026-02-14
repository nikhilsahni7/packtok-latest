import { Role } from "@packtok/db";
import { Router } from "express";
import {
    getContactInquiries,
    submitContactInquiry,
    updateInquiryStatus,
} from "../controllers/contact.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { hasRole } from "../middlewares/roles.middleware";

const router = Router();

router.post("/", submitContactInquiry);

// Admin-only routes
router.get("/", authMiddleware, hasRole(Role.ADMIN, Role.SUPER_ADMIN), getContactInquiries);
router.patch("/:id", authMiddleware, hasRole(Role.ADMIN, Role.SUPER_ADMIN), updateInquiryStatus);

export default router;
