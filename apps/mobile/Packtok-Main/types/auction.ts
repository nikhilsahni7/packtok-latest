// types/auction.ts
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
  images?: string[];
  imagesThumbnail?: string;
}

export interface Auction {
  id: string;
  productId: string;
  product?: AuctionProductSummary;
  mode: AuctionBidType;
  status: AuctionStatus;
  currency: string;
  startingAmount: string;
  bidIncrement: string;
  depositAmount: string;
  startAt: string;
  endAt: string;
  leaderboard?: AuctionLeaderboard | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuctionEnrollment {
  id: string;
  userId: string;
  auctionId: string;
  auction?: Auction;
  status: AuctionEnrollmentStatus;
  depositAmount: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentInitiationResponse {
  enrollment: AuctionEnrollment;
  paymentIntent: {
    id: string;
    amount: string;
    currency: string;
    status: PaymentIntentStatus;
    metadata?: Record<string, string>;
  };
  razorpayKey: string;
  razorpayOrder: {
    id: string;
    amount: number;
    currency: string;
  };
}

export interface PlaceBidRequest {
  amount: string;
}

export interface PlaceBidResponse {
  bidId: string;
  amount: string;
  sequence: number;
  createdAt: string;
  leaderboard: AuctionLeaderboardSnapshot | null;
}
