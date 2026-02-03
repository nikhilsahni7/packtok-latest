import { Router } from "express";
import { listActiveProperties, submitQuery } from "../controllers/investment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public: list active properties
router.get("/", listActiveProperties);

// Authenticated: submit query
router.post("/query", authMiddleware, submitQuery);

export default router;
