import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getSocket } from "../lib/socket";

interface QuoteUpdateEvent {
  quoteId: string;
  userId: string;
  status: string;
  updatedAt: string;
}

export function useQuoteSocket(userId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const socket = getSocket();
    if (!socket) return;

    // Listen for quote updates
    const handleQuoteUpdate = (data: QuoteUpdateEvent) => {
      // Only invalidate if the update is for the current user
      if (data.userId === userId) {
        console.log("📝 Quote updated via socket:", data.quoteId);

        // Invalidate the specific quote query
        queryClient.invalidateQueries({
          queryKey: ["quote-request", data.quoteId],
        });

        // Invalidate the quote list query
        queryClient.invalidateQueries({
          queryKey: ["my-quote-requests"],
        });
      }
    };

    socket.on("quote:updated", handleQuoteUpdate);

    // Cleanup on unmount
    return () => {
      socket.off("quote:updated", handleQuoteUpdate);
    };
  }, [userId, queryClient]);
}
