export type AuctionStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "LIVE"
  | "CLOSED"
  | "CANCELLED";

export type AuctionBidType = "FORWARD" | "REVERSE";

export type AuctionEnrollmentStatus =
  | "PENDING_PAYMENT"
  | "ACTIVE"
  | "DISQUALIFIED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentIntentStatus =
  | "CREATED"
  | "PENDING"
  | "CAPTURED"
  | "FAILED"
  | "CANCELLED";

export interface AuctionLeaderboardEntry {
  bidId: string;
  userId: string;
  name: string | null;
  email: string;
  amount: string;
  sequence: number;
  createdAt: string;
}

export interface AuctionLeaderboardSnapshot {
  updatedAt: string;
  mode: AuctionBidType;
  bidders: AuctionLeaderboardEntry[];
  currentAmount: string;
}

export interface AuctionLeaderboard {
  id: string;
  snapshot: AuctionLeaderboardSnapshot | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuctionProductSummary {
  id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  images: string[];
  imagesThumbnail?: string;
  manufacturer?: string;
  productType?: string;
  status?: string;
}

export interface Auction {
  id: string;
  productId: string;
  mode: AuctionBidType;
  status: AuctionStatus;
  startAt: string;
  endAt: string;
  startingAmount: string;
  earnestAmount: string;
  currency: string;
  minBidIncrement?: string | null;
  minBidDecrement?: string | null;
  reservePrice?: string | null;
  maxWinners: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  product?: AuctionProductSummary;
  leaderboard?: AuctionLeaderboard | null;
}

export interface AuctionEnrollment {
  id: string;
  auctionId: string;
  userId: string;
  status: AuctionEnrollmentStatus;
  earnestAmount: string;
  currency: string;
  paymentIntentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntent {
  id: string;
  status: PaymentIntentStatus;
  amount: string;
  currency: string;
  providerOrderId?: string | null;
  providerPaymentId?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface RazorpayOrderSummary {
  id: string;
  amount: number;
  currency: string;
  receipt?: string | null;
  status: string;
  notes?: Record<string, string> | null;
}

export interface EnrollmentInitiationResponse {
  enrollment: AuctionEnrollment;
  paymentIntent: PaymentIntent;
  razorpayOrder: RazorpayOrderSummary;
  razorpayKey: string;
}

export interface AuctionBidEvent {
  auctionId: string;
  bid: {
    id: string;
    auctionId: string;
    userId: string;
    enrollmentId: string;
    amount: string;
    sequence: number;
    clientSequence: number | null;
    createdAt: string;
  };
}

export interface AuctionLeaderboardEvent {
  auctionId: string;
  leaderboard: AuctionLeaderboardSnapshot | null;
}

export interface AuctionFinalizedEvent {
  auctionId: string;
  winners: unknown;
}
