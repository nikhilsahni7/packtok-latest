import { Request, Response } from "express";
import {
  EmailSubscriptionType,
  listEmailSubscriptionsForAdmin,
} from "../services/email-subscription.service";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const parseType = (value: unknown): EmailSubscriptionType | undefined => {
  if (!value) return undefined;
  if (value === "PODCAST" || value === "NEWSLETTER") {
    return value;
  }
  throw new ApiError(400, "Invalid subscription type");
};

export const adminListEmailSubscriptions = asyncHandler(
  async (req: Request, res: Response) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const type = parseType(req.query.type);

    const result = await listEmailSubscriptionsForAdmin({
      page,
      limit,
      type,
    });

    res
      .status(200)
      .json(new ApiResponse(200, result, "Email subscriptions fetched"));
  }
);
