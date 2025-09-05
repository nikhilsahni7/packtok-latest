import { Role } from "@packtok/db";
import { Router } from "express";
import {
  adminApproveVendor,
  adminListVendorApplications,
  adminRejectVendor,
} from "../controllers/vendor.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { hasRole } from "../middlewares/roles.middleware";

const router = Router();

router.use(authMiddleware, hasRole(Role.ADMIN, Role.SUPER_ADMIN));

router.get("/", adminListVendorApplications);
router.put("/:id/approve", adminApproveVendor);
router.put("/:id/reject", adminRejectVendor);

export default router;
