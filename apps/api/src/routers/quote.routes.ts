import { Router } from "express";
import {
  createQuote,
  getMyQuotes,
  getQuoteById,
} from "../controllers/quote.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createQuote);
router.get("/my", authMiddleware, getMyQuotes);
router.get("/:id", authMiddleware, getQuoteById);

export default router;
