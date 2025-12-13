import { Router } from "express";
import {
    addItem,
    clearUserCart,
    getCart,
    removeItem,
    updateItem,
} from "../controllers/cart.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// All cart routes require authentication
router.use(authMiddleware);

router.get("/", getCart);
router.post("/items", addItem);
router.patch("/items/:productId", updateItem);
router.delete("/items/:productId", removeItem);
router.delete("/", clearUserCart);

export default router;
