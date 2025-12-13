import { Router } from "express";
import {
    cancel,
    createOrder,
    getOrder,
    listOrders,
    verifyPayment,
} from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// All order routes require authentication
router.use(authMiddleware);

router.post("/", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/", listOrders);
router.get("/:id", getOrder);
router.post("/:id/cancel", cancel);

export default router;
