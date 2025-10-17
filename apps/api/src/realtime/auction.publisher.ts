import { AuctionBid, Prisma } from "@packtok/db";
import logger from "../utils/logger";
import { getAuctionRoomName, tryGetSocketServer } from "./socket";

const EVENT_BID_PLACED = "auction:bid-placed";
const EVENT_LEADERBOARD_UPDATED = "auction:leaderboard";
const EVENT_AUCTION_FINALIZED = "auction:finalized";

type LeaderboardSnapshot = Prisma.JsonValue;

type OutboundBid = {
  id: string;
  auctionId: string;
  userId: string;
  enrollmentId: string;
  amount: string;
  sequence: number;
  clientSequence: number | null;
  createdAt: string;
};

const toOutboundBid = (bid: AuctionBid): OutboundBid => ({
  id: bid.id,
  auctionId: bid.auctionId,
  userId: bid.userId,
  enrollmentId: bid.enrollmentId,
  amount: bid.amount.toString(),
  sequence: bid.sequence,
  clientSequence: bid.clientSequence,
  createdAt: bid.createdAt.toISOString(),
});

const emitAuctionEvent = (
  auctionId: string,
  event: string,
  payload: Record<string, unknown>
) => {
  const io = tryGetSocketServer();
  if (!io) {
    logger.debug(
      {
        auctionId,
        event,
      },
      "Socket server not initialized; skipping realtime emit"
    );
    return;
  }
  io.to(getAuctionRoomName(auctionId)).emit(event, payload);
};

export const publishBidPlaced = (
  auctionId: string,
  bid: AuctionBid,
  leaderboard: LeaderboardSnapshot
) => {
  emitAuctionEvent(auctionId, EVENT_BID_PLACED, {
    auctionId,
    bid: toOutboundBid(bid),
  });
  publishLeaderboardSnapshot(auctionId, leaderboard);
};

export const publishLeaderboardSnapshot = (
  auctionId: string,
  leaderboard: LeaderboardSnapshot
) => {
  emitAuctionEvent(auctionId, EVENT_LEADERBOARD_UPDATED, {
    auctionId,
    leaderboard,
  });
};

export const publishAuctionFinalized = (
  auctionId: string,
  winners: Prisma.JsonValue
) => {
  emitAuctionEvent(auctionId, EVENT_AUCTION_FINALIZED, {
    auctionId,
    winners,
  });
};
