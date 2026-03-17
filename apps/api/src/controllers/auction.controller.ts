import { Request, Response } from "express";
import {
  confirmEnrollmentPayment,
  createAuctionEnrollment,
  getAuctionDetail,
  getUserBidHistoryStats,
  listPublicAuctions,
  listUserEnrollments,
  placeAuctionBid,
} from "../services/auction.service";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const listAuctions = asyncHandler(
  async (_req: Request, res: Response) => {
    const auctions = await listPublicAuctions();
    res
      .status(200)
      .json(new ApiResponse(200, auctions, "Auctions fetched successfully"));
  }
);

export const getAuction = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const auction = await getAuctionDetail(id);
  res
    .status(200)
    .json(new ApiResponse(200, auction, "Auction fetched successfully"));
});

export const enrollInAuction = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }
    const { id } = req.params;
    const { enrollment, paymentIntent, razorpayOrder, razorpayKey } =
      await createAuctionEnrollment(id, req.user.id);
    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { enrollment, paymentIntent, razorpayOrder, razorpayKey },
          "Enrollment created"
        )
      );
  }
);

export const acknowledgePaymentCapture = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      paymentIntentId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;
    if (!paymentIntentId || !razorpayOrderId || !razorpayPaymentId) {
      throw new ApiError(
        400,
        "paymentIntentId, razorpayOrderId and razorpayPaymentId are required"
      );
    }
    if (!razorpaySignature) {
      throw new ApiError(400, "razorpaySignature is required");
    }

    const result = await confirmEnrollmentPayment({
      paymentIntentId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });
    res
      .status(200)
      .json(new ApiResponse(200, result, "Payment status recorded"));
  }
);

export const getMyAuctionEnrollments = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }
    const enrollments = await listUserEnrollments(req.user.id);
    res
      .status(200)
      .json(new ApiResponse(200, enrollments, "Enrollments fetched"));
  }
);

export const getMyBidHistory = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }
    const history = await getUserBidHistoryStats(req.user.id);
    res.status(200).json(new ApiResponse(200, history, "Bid history fetched"));
  }
);

export const submitBid = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }
  const { id } = req.params;
  const { amount, clientSequence, metadata } = req.body;
  if (amount === undefined || amount === null) {
    throw new ApiError(400, "amount is required");
  }
  const result = await placeAuctionBid(id, req.user.id, amount, {
    clientSequence,
    metadata,
  });
  res.status(201).json(new ApiResponse(201, result, "Bid placed successfully"));
});
