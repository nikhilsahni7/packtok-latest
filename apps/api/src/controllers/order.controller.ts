import { Request, Response } from "express";
import {
    cancelOrder,
    createOrderFromCart,
    getOrderById,
    getUserOrders,
    verifyPaymentAndCompleteOrder,
} from "../services/order.service";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * POST /orders - Create order from cart
 */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { addressId, customerNotes } = req.body;

  if (!addressId) {
    throw new ApiError(400, "addressId is required");
  }

  const result = await createOrderFromCart(req.user!.id, { addressId, customerNotes });

  res.status(201).json(
    new ApiResponse(201, result, "Order created. Complete payment to confirm.")
  );
});

/**
 * POST /orders/verify-payment - Verify Razorpay payment
 */
export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new ApiError(400, "orderId, razorpayOrderId, razorpayPaymentId, and razorpaySignature are required");
  }

  const order = await verifyPaymentAndCompleteOrder(req.user!.id, {
    orderId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  res.json(new ApiResponse(200, order, "Payment verified successfully"));
});

/**
 * GET /orders - Get user's orders
 */
export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  const { status, limit, offset } = req.query;

  const result = await getUserOrders(req.user!.id, {
    status: status as any,
    limit: limit ? parseInt(limit as string) : undefined,
    offset: offset ? parseInt(offset as string) : undefined,
  });

  res.json(new ApiResponse(200, result, "Orders retrieved successfully"));
});

/**
 * GET /orders/:id - Get order details
 */
export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await getOrderById(req.user!.id, id);
  res.json(new ApiResponse(200, order, "Order retrieved successfully"));
});

/**
 * POST /orders/:id/cancel - Cancel order
 */
export const cancel = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await cancelOrder(req.user!.id, id);
  res.json(new ApiResponse(200, order, "Order cancelled successfully"));
});
