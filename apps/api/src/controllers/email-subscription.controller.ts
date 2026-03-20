import { Request, Response } from "express";
import {
  EmailSubscriptionType,
  subscribeToEmailUpdates,
} from "../services/email-subscription.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const allowedTypes: EmailSubscriptionType[] = ["PODCAST", "NEWSLETTER"];

export const subscribeEmailHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, type } = req.body as {
      email?: string;
      type?: EmailSubscriptionType;
    };

    if (!email || !type || !allowedTypes.includes(type)) {
      res
        .status(400)
        .json(new ApiResponse(400, null, "Email and valid type are required"));
      return;
    }

    const result = await subscribeToEmailUpdates({ email, type });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          ...result,
          subscribed: true,
        },
        result.alreadySubscribed
          ? "Already subscribed"
          : "Subscribed successfully"
      )
    );
  }
);
