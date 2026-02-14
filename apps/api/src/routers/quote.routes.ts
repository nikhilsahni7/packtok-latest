import { Router } from "express";
import {
    cancelQuote,
    createQuote,
    getMyQuotes,
    getQuoteById,
} from "../controllers/quote.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createQuote);
router.get("/my", authMiddleware, getMyQuotes);
router.get("/:id", authMiddleware, getQuoteById);
router.put("/:id/cancel", authMiddleware, cancelQuote);

export default router;
