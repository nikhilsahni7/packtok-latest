import { Router } from "express";
import {
  acknowledgePaymentCapture,
  enrollInAuction,
  getAuction,
  getMyAuctionEnrollments,
  listAuctions,
  submitBid,
} from "../controllers/auction.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me/enrollments", authMiddleware, getMyAuctionEnrollments);
router.post("/payments/capture", authMiddleware, acknowledgePaymentCapture);
router.get("/", listAuctions);
router.get("/:id", getAuction);
router.post("/:id/enroll", authMiddleware, enrollInAuction);
router.post("/:id/bids", authMiddleware, submitBid);

export default router;
