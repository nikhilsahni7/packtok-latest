import { QuoteStatus } from "@packtok/db";
import { Request, Response } from "express";
import { tryGetSocketServer } from "../realtime/socket";
import {
  getAllQuoteRequests,
  updateQuoteStatus,
} from "../services/quote.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const adminGetQuotes = asyncHandler(
  async (_req: Request, res: Response) => {
    const quotes = await getAllQuoteRequests();
    res
      .status(200)
      .json(new ApiResponse(200, quotes, "Quotes fetched successfully"));
  }
);

export const adminUpdateQuote = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!Object.values(QuoteStatus).includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const updated = await updateQuoteStatus(id, status);

    // Emit socket event for real-time updates
    const io = tryGetSocketServer();
    if (io && updated) {
      io.emit("quote:updated", {
        quoteId: updated.id,
        userId: updated.userId,
        status: updated.status,
        updatedAt: updated.updatedAt,
      });
    }

    res.status(200).json(new ApiResponse(200, updated, "Quote status updated"));
  }
);
