import { Role } from "@packtok/db";
import { Router } from "express";
import {
  adminCreateAuction,
  adminFinalizeAuction,
  adminGetAuction,
  adminListAuctions,
  adminUpdateAuction,
} from "../controllers/admin.auction.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { hasRole } from "../middlewares/roles.middleware";

const router = Router();

const adminGuard = [authMiddleware, hasRole(Role.ADMIN, Role.SUPER_ADMIN)];

router.get("/", adminGuard, adminListAuctions);
router.get("/:id", adminGuard, adminGetAuction);
router.post("/", adminGuard, adminCreateAuction);
router.patch("/:id", adminGuard, adminUpdateAuction);
router.post("/:id/finalize", adminGuard, adminFinalizeAuction);

export default router;
