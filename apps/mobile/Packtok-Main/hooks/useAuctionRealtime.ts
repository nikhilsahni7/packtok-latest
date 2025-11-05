// hooks/useAuctionRealtime.ts
import { getSocket } from "@/lib/socket";
import { AuctionLeaderboardSnapshot } from "@/types/auction";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useAuctionSnapshot } from "./useAuctions";

interface AuctionBidEvent {
  auctionId: string;
  bid: {
    id: string;
    amount: string;
    userId: string;
  };
}

interface AuctionLeaderboardEvent {
  auctionId: string;
  leaderboard?: AuctionLeaderboardSnapshot | null;
  status?: string;
}

interface AuctionFinalizedEvent {
  auctionId: string;
  winnerId?: string;
}

interface UseAuctionRealtimeOptions {
  onLeaderboard?: (event: AuctionLeaderboardEvent) => void;
  onFinalized?: (event: AuctionFinalizedEvent) => void;
  onBidPlaced?: (event: AuctionBidEvent) => void;
}

/**
 * Hook for real-time auction updates using Socket.IO
 */
export const useAuctionRealtime = (
  auctionId: string | null | undefined,
  options: UseAuctionRealtimeOptions = {}
) => {
  const applySnapshot = useAuctionSnapshot();
  const queryClient = useQueryClient();

  // Use refs to store callbacks and avoid re-running effect
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!auctionId) return;

    const socket = getSocket();
    if (!socket) {
      console.warn("⚠️ Socket not available");
      return;
    }

    // Join the auction room
    const joinPayload = { auctionId };
    socket.emit("auction:join", joinPayload);
    console.log(`🔵 Joined auction room: ${auctionId}`);

    // Handle bid placed events
    const handleBidPlaced = (event: AuctionBidEvent) => {
      if (event.auctionId !== auctionId) return;
      console.log("🎯 Bid placed:", event);
      optionsRef.current.onBidPlaced?.(event);
    };

    // Handle leaderboard updates
    const handleLeaderboard = (event: AuctionLeaderboardEvent) => {
      if (event.auctionId !== auctionId) return;
      console.log("📊 Leaderboard updated:", event);

      if (event.leaderboard) {
        applySnapshot(auctionId, event.leaderboard);
      }
      optionsRef.current.onLeaderboard?.(event);
    };

    // Handle auction finalized
    const handleFinalized = (event: AuctionFinalizedEvent) => {
      if (event.auctionId !== auctionId) return;
      console.log("🏁 Auction finalized:", event);

      optionsRef.current.onFinalized?.(event);
      // Invalidate queries to refetch auction data
      queryClient.invalidateQueries({ queryKey: ["auction", auctionId] });
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
    };

    // Register event listeners
    socket.on("auction:bid-placed", handleBidPlaced);
    socket.on("auction:leaderboard", handleLeaderboard);
    socket.on("auction:finalized", handleFinalized);

    // Cleanup on unmount
    return () => {
      console.log(`🔴 Leaving auction room: ${auctionId}`);
      socket.emit("auction:leave", joinPayload);
      socket.off("auction:bid-placed", handleBidPlaced);
      socket.off("auction:leaderboard", handleLeaderboard);
      socket.off("auction:finalized", handleFinalized);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionId]); // Only re-run when auctionId changes
};
