"use client";

import { getSocket } from "@/lib/socket";
import {
  AuctionBidEvent,
  AuctionFinalizedEvent,
  AuctionLeaderboardEvent,
} from "@/types/auction";
import { QK } from "@/utils/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
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
  const { onBidPlaced, onLeaderboard, onFinalized } = handlers;

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
      onBidPlaced?.(event);
    };

    const handleLeaderboard = (event: AuctionLeaderboardEvent) => {
      if (event.auctionId !== auctionId) {
        return;
      }
      updateSnapshot(auctionId, event.leaderboard ?? null);
      onLeaderboard?.(event);
    };

    const handleFinalized = (event: AuctionFinalizedEvent) => {
      if (event.auctionId !== auctionId) {
        return;
      }
      onFinalized?.(event);
      queryClient.invalidateQueries({ queryKey: [...QK.auction, auctionId] });
      queryClient.invalidateQueries({ queryKey: QK.auctions });
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
  }, [
    auctionId,
    onBidPlaced,
    onFinalized,
    onLeaderboard,
    queryClient,
    updateSnapshot,
  ]);
};
