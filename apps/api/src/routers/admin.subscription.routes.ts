import { Role } from "@packtok/db";
import { Router } from "express";
import {
  adminCreatePlan,
  adminDeletePlan,
  adminExpireSubscriptions,
  adminListPlans,
  adminListSubscriptions,
  adminSeedPlans,
  adminUpdatePlan,
} from "../controllers/admin.subscription.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { hasRole } from "../middlewares/roles.middleware";

const router = Router();

router.use(authMiddleware, hasRole(Role.ADMIN, Role.SUPER_ADMIN));

// Plan management
router.get("/plans", adminListPlans);
router.post("/plans", adminCreatePlan);
router.put("/plans/:id", adminUpdatePlan);
router.delete("/plans/:id", adminDeletePlan);
router.post("/seed", adminSeedPlans);

// Subscription management
router.get("/", adminListSubscriptions);
router.post("/expire", adminExpireSubscriptions);

export default router;
