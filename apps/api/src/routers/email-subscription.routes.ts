import { Router } from "express";
import { subscribeEmailHandler } from "../controllers/email-subscription.controller";

const router = Router();

router.post("/", subscribeEmailHandler);

export default router;
