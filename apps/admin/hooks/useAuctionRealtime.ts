"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import {
  AuctionBidEvent,
  AuctionFinalizedEvent,
  AuctionLeaderboardEvent,
} from "../types/auction";
import { QK } from "../utils/queryKeys";
import { useAuctionSnapshot } from "./useAuctions";

interface AuctionRealtimeHandlers {
  onBidPlaced?: (event: AuctionBidEvent) => void;
  onLeaderboard?: (event: AuctionLeaderboardEvent) => void;
  onFinalized?: (event: AuctionFinalizedEvent) => void;
}

export const useAuctionRealtime = (
  auctionId: string | null | undefined,
  handlers: AuctionRealtimeHandlers = {}
) => {
  const updateSnapshot = useAuctionSnapshot();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!auctionId) {
      return undefined;
    }

    const socket = getSocket();
    if (!socket) {
      return undefined;
    }

    const joinPayload = { auctionId };
    socket.emit("auction:join", joinPayload);

    const handleBidPlaced = (event: AuctionBidEvent) => {
      if (event.auctionId !== auctionId) {
        return;
      }
      handlers.onBidPlaced?.(event);
    };

    const handleLeaderboard = (event: AuctionLeaderboardEvent) => {
      if (event.auctionId !== auctionId) {
        return;
      }
      updateSnapshot(auctionId, event.leaderboard ?? null);
      handlers.onLeaderboard?.(event);
    };

    const handleFinalized = (event: AuctionFinalizedEvent) => {
      if (event.auctionId !== auctionId) {
        return;
      }
      handlers.onFinalized?.(event);
      queryClient.invalidateQueries({ queryKey: QK.auctions });
      queryClient.invalidateQueries({ queryKey: [...QK.auction, auctionId] });
    };

    socket.on("auction:bid-placed", handleBidPlaced);
    socket.on("auction:leaderboard", handleLeaderboard);
    socket.on("auction:finalized", handleFinalized);

    return () => {
      socket.emit("auction:leave", joinPayload);
      socket.off("auction:bid-placed", handleBidPlaced);
      socket.off("auction:leaderboard", handleLeaderboard);
      socket.off("auction:finalized", handleFinalized);
    };
  }, [auctionId, handlers, updateSnapshot, queryClient]);
};
