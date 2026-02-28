import { Role } from "@packtok/db";
import { Router } from "express";
import {
    adminDeleteUser,
    adminGetUser,
    adminListUsers,
    adminUpdateUser,
} from "../controllers/admin.user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { hasRole } from "../middlewares/roles.middleware";

const router = Router();

router.use(authMiddleware, hasRole(Role.ADMIN, Role.SUPER_ADMIN));

router.get("/", adminListUsers);
router.get("/:id", adminGetUser);
router.put("/:id", adminUpdateUser);
router.delete("/:id", hasRole(Role.SUPER_ADMIN), adminDeleteUser);

export default router;
