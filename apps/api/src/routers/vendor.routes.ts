import { Router } from "express";
import {
  applyVendor,
  getMyVendorApplication,
} from "../controllers/vendor.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/apply", authMiddleware, applyVendor);
router.get("/me/application", authMiddleware, getMyVendorApplication);

export default router;
