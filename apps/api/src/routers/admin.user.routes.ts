import { Role } from "@packtok/db";
import { Router } from "express";
import { adminGetUser, adminListUsers } from "../controllers/admin.user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { hasRole } from "../middlewares/roles.middleware";

const router = Router();

router.use(authMiddleware, hasRole(Role.ADMIN, Role.SUPER_ADMIN));

router.get("/", adminListUsers);
router.get("/:id", adminGetUser);

export default router;
