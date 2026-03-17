import { Router } from "express";
import {
  getMyNotifications,
  getUnreadNotificationCount,
  readAllNotifications,
  readNotification,
} from "../controllers/notification.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);
router.get("/", getMyNotifications);
router.get("/unread-count", getUnreadNotificationCount);
router.patch("/read-all", readAllNotifications);
router.patch("/:id/read", readNotification);

export default router;
