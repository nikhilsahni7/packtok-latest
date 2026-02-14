import { Request, Response } from "express";
import {
    cancelUserQuoteRequest,
    createQuoteRequest,
    getMyQuoteRequests,
    getQuoteRequestById,
} from "../services/quote.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const createQuote = asyncHandler(async (req: Request, res: Response) => {
  const { productId, companyName, PhoneNo, Email, address, message, additionalInfo } = req.body;
  const quote = await createQuoteRequest(req.user!.id, {
    productId,
    companyName,
    phone: PhoneNo,
    email: Email,
    address,
    message,
    additionalInfo,
  });
  res.status(201).json(new ApiResponse(201, quote, "Quote request submitted"));
});

export const getMyQuotes = asyncHandler(async (req: Request, res: Response) => {
  const quotes = await getMyQuoteRequests(req.user!.id);
  res
    .status(200)
    .json(new ApiResponse(200, quotes, "Quote requests fetched successfully"));
});

export const getQuoteById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const quote = await getQuoteRequestById(id, req.user!.id);
    res
      .status(200)
      .json(new ApiResponse(200, quote, "Quote request fetched successfully"));
  }
);

export const cancelQuote = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Cancellation reason is required"));
    }

    const quote = await cancelUserQuoteRequest(id, req.user!.id, reason.trim());
    res
      .status(200)
      .json(new ApiResponse(200, quote, "Quote request cancelled"));
  }
);
