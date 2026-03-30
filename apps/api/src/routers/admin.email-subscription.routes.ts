import { Role } from "@packtok/db";
import { Router } from "express";
import { adminListEmailSubscriptions } from "../controllers/admin.email-subscription.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { hasRole } from "../middlewares/roles.middleware";

const router = Router();

router.use(authMiddleware, hasRole(Role.ADMIN, Role.SUPER_ADMIN));
router.get("/", adminListEmailSubscriptions);

export default router;
