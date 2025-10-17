import { MarketplaceProduct } from "./product";

export type AuctionStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "LIVE"
  | "CLOSED"
  | "CANCELLED";

export type AuctionBidType = "FORWARD" | "REVERSE";

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
  updatedAt: string;
  createdAt: string;
}

export interface AuctionResult {
  id: string;
  createdAt: string;
  updatedAt: string;
  winners: unknown;
  settledAt: string | null;
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
  product?: MarketplaceProduct;
  leaderboard?: AuctionLeaderboard | null;
  result?: AuctionResult | null;
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
