import { Request, Response } from "express";
import {
  canVendorCreateProduct,
  cancelSubscription,
  getActivePlans,
  getActiveSubscription,
  getSubscriptionHistory,
  initiateSubscription,
  verifySubscriptionPayment,
} from "../services/subscription.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * GET /api/v1/subscriptions/plans
 * Public – list all active plans.
 */
export const listPlans = asyncHandler(async (_req: Request, res: Response) => {
  const plans = await getActivePlans();
  res.status(200).json(new ApiResponse(200, plans, "Plans fetched"));
});

/**
 * GET /api/v1/subscriptions/me
 * Returns vendor's active subscription, product count, and limit.
 */
export const getMySubscription = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const [subscription, productCheck] = await Promise.all([
      getActiveSubscription(userId),
      canVendorCreateProduct(userId),
    ]);
    res.status(200).json(
      new ApiResponse(200, {
        subscription,
        productCount: productCheck.currentCount,
        productLimit: productCheck.limit,
        canCreateProduct: productCheck.allowed,
      }, "Subscription info fetched")
    );
  }
);

/**
 * GET /api/v1/subscriptions/me/history
 * Full subscription history for the current vendor.
 */
export const getMySubscriptionHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const history = await getSubscriptionHistory(req.user!.id);
    res
      .status(200)
      .json(new ApiResponse(200, history, "Subscription history fetched"));
  }
);

/**
 * POST /api/v1/subscriptions/subscribe
 * Body: { planId: string }
 * Initiates a subscription – returns Razorpay checkout data or activates free plan.
 */
export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const { planId } = (req.body || {}) as { planId?: string };
  if (!planId) throw new Error("planId is required");

  const result = await initiateSubscription(req.user!.id, planId);
  res.status(200).json(new ApiResponse(200, result, "Subscription initiated"));
});

/**
 * POST /api/v1/subscriptions/verify-payment
 * Body: { subscriptionId, razorpayOrderId, razorpayPaymentId, razorpaySignature }
 */
export const verifyPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { subscriptionId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      (req.body || {}) as {
        subscriptionId?: string;
        razorpayOrderId?: string;
        razorpayPaymentId?: string;
        razorpaySignature?: string;
      };

    if (!subscriptionId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new Error("All payment verification fields are required");
    }

    const activated = await verifySubscriptionPayment(req.user!.id, {
      subscriptionId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    res
      .status(200)
      .json(new ApiResponse(200, activated, "Subscription activated successfully"));
  }
);

/**
 * POST /api/v1/subscriptions/cancel
 * Cancels auto-renewal. Subscription stays active until endDate.
 */
export const cancelMySubscription = asyncHandler(
  async (req: Request, res: Response) => {
    const sub = await cancelSubscription(req.user!.id);
    res.status(200).json(new ApiResponse(200, sub, "Auto-renewal cancelled"));
  }
);

/**
 * GET /api/v1/subscriptions/product-limit
 * Quick check for the vendor product creation UI.
 */
export const checkProductLimit = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await canVendorCreateProduct(req.user!.id);
    res.status(200).json(new ApiResponse(200, result, "Product limit checked"));
  }
);
