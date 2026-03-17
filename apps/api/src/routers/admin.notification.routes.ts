import { Role } from "@packtok/db";
import { Router } from "express";
import {
  adminListNotifications,
  adminSendCustomNotification,
  adminSupportedNotificationTypes,
} from "../controllers/admin.notification.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { hasRole } from "../middlewares/roles.middleware";

const router = Router();

router.use(authMiddleware, hasRole(Role.ADMIN, Role.SUPER_ADMIN));
router.get("/meta", adminSupportedNotificationTypes);
router.get("/", adminListNotifications);
router.post("/custom", adminSendCustomNotification);

export default router;
