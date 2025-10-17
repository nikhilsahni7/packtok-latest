import { AuctionBidType, AuctionStatus } from "@packtok/db";
import { Request, Response } from "express";
import {
  createAuction,
  finalizeAuction,
  getAuctionDetail,
  listAuctionsForAdmin,
  updateAuction,
  UpdateAuctionInput,
} from "../services/auction.service";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const parseDate = (value: unknown, field: string): Date => {
  if (!value) {
    throw new ApiError(400, `${field} is required`);
  }
  const parsed = new Date(value as string);
  if (Number.isNaN(parsed.getTime())) {
    throw new ApiError(400, `${field} must be a valid ISO date string`);
  }
  return parsed;
};

const assertMode = (value: unknown): AuctionBidType => {
  if (!value) {
    throw new ApiError(400, "mode is required");
  }
  const mode = value as AuctionBidType;
  if (!Object.values(AuctionBidType).includes(mode)) {
    throw new ApiError(400, "Invalid auction mode");
  }
  return mode;
};

const assertStatus = (value: unknown): AuctionStatus | undefined => {
  if (!value) return undefined;
  const status = value as AuctionStatus;
  if (!Object.values(AuctionStatus).includes(status)) {
    throw new ApiError(400, "Invalid auction status");
  }
  return status;
};

export const adminListAuctions = asyncHandler(
  async (_req: Request, res: Response) => {
    const auctions = await listAuctionsForAdmin();
    res
      .status(200)
      .json(new ApiResponse(200, auctions, "Auctions fetched successfully"));
  }
);

export const adminGetAuction = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const auction = await getAuctionDetail(id);
    res
      .status(200)
      .json(new ApiResponse(200, auction, "Auction fetched successfully"));
  }
);

export const adminCreateAuction = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.body.productId) {
      throw new ApiError(400, "productId is required");
    }
    const startAt = parseDate(req.body.startAt, "startAt");
    const endAt = parseDate(req.body.endAt, "endAt");
    const mode = assertMode(req.body.mode);
    const status = assertStatus(req.body.status);

    const auction = await createAuction(req.user!.id, {
      productId: req.body.productId,
      mode,
      startAt,
      endAt,
      startingAmount: req.body.startingAmount,
      earnestAmount: req.body.earnestAmount,
      currency: req.body.currency,
      minBidIncrement: req.body.minBidIncrement,
      minBidDecrement: req.body.minBidDecrement,
      reservePrice: req.body.reservePrice,
      notes: req.body.notes,
      maxWinners: req.body.maxWinners,
      status,
    });

    res
      .status(201)
      .json(new ApiResponse(201, auction, "Auction created successfully"));
  }
);

export const adminUpdateAuction = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload: UpdateAuctionInput = {
      mode: req.body.mode,
      startingAmount: req.body.startingAmount,
      earnestAmount: req.body.earnestAmount,
      currency: req.body.currency,
      minBidIncrement: req.body.minBidIncrement,
      minBidDecrement: req.body.minBidDecrement,
      reservePrice: req.body.reservePrice,
      notes: req.body.notes,
      maxWinners: req.body.maxWinners,
      status: assertStatus(req.body.status),
    };

    if (req.body.startAt) {
      payload.startAt = parseDate(req.body.startAt, "startAt");
    }
    if (req.body.endAt) {
      payload.endAt = parseDate(req.body.endAt, "endAt");
    }
    if (payload.mode) {
      payload.mode = assertMode(payload.mode);
    }

    const auction = await updateAuction(req.user!.id, id, payload);
    res
      .status(200)
      .json(new ApiResponse(200, auction, "Auction updated successfully"));
  }
);

export const adminFinalizeAuction = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await finalizeAuction(id);
    res
      .status(200)
      .json(new ApiResponse(200, result, "Auction finalized successfully"));
  }
);
