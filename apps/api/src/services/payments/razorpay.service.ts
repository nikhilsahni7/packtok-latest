import crypto from "crypto";
import Razorpay from "razorpay";
import config from "../../config";
import { ApiError } from "../../utils/apiError";

export type RazorpayOrderSummary = {
  id: string;
  amount: number;
  currency: string;
  receipt?: string | null;
  status: string;
  notes?: Record<string, string> | null;
};

type CreateOrderParams = {
  amountInPaise: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
};

let razorpayClient: Razorpay | null = null;

const ensureConfigured = () => {
  if (!config.razorpay.keyId || !config.razorpay.keySecret) {
    throw new ApiError(500, "Razorpay credentials are not configured");
  }
};

const getClient = (): Razorpay => {
  ensureConfigured();
  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });
  }
  return razorpayClient;
};

export const createOrder = async (
  params: CreateOrderParams
): Promise<RazorpayOrderSummary> => {
  const client = getClient();
  const order = await client.orders.create({
    amount: params.amountInPaise,
    currency: params.currency,
    receipt: params.receipt,
    payment_capture: 1,
    notes: params.notes,
  });
  return {
    id: order.id,
    amount: order.amount,
    currency: order.currency,
    receipt: order.receipt ?? null,
    status: order.status,
    notes: (order.notes as Record<string, string> | undefined) ?? null,
  };
};

export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  ensureConfigured();
  if (!signature) return false;
  const digest = crypto
    .createHmac("sha256", config.razorpay.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return digest === signature;
};

export const getRazorpayPublishableKey = (): string => {
  ensureConfigured();
  return config.razorpay.keyId;
};
