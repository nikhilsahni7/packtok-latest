"use client";

import api from "@/lib/axios";
import {
  Auction,
  AuctionEnrollment,
  AuctionLeaderboardSnapshot,
  EnrollmentInitiationResponse,
} from "@/types/auction";
import { QK } from "@/utils/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const mergeLeaderboard = (
  auctionId: string,
  current: Auction["leaderboard"] | null | undefined,
  snapshot: AuctionLeaderboardSnapshot | null,
  updatedAt: string
): Auction["leaderboard"] | null => {
  if (current) {
    return {
      ...current,
      snapshot,
      updatedAt,
    };
  }

  if (!snapshot) {
    return current ?? null;
  }

  return {
    id: `${auctionId}-leaderboard`,
    createdAt: updatedAt,
    updatedAt,
    snapshot,
  };
};

const withUpdatedLeaderboard = (
  auction: Auction,
  auctionId: string,
  snapshot: AuctionLeaderboardSnapshot | null,
  updatedAt: string
): Auction => ({
  ...auction,
  leaderboard: mergeLeaderboard(
    auctionId,
    auction.leaderboard ?? null,
    snapshot,
    updatedAt
  ),
});

export const usePublicAuctions = () => {
  return useQuery({
    queryKey: QK.auctions,
    queryFn: async (): Promise<Auction[]> => {
      const { data } = await api.get("/api/v1/auctions");
      return data.data ?? data;
    },
    staleTime: 1000 * 20,
  });
};

export const useAuction = (auctionId: string | null | undefined) => {
  return useQuery({
    queryKey: [...QK.auction, auctionId],
    enabled: Boolean(auctionId),
    queryFn: async (): Promise<Auction> => {
      const { data } = await api.get(`/api/v1/auctions/${auctionId}`);
      return data.data ?? data;
    },
    staleTime: 1000 * 10,
  });
};

export const useMyAuctionEnrollments = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: QK.auctionEnrollments,
    queryFn: async (): Promise<AuctionEnrollment[]> => {
      const { data } = await api.get("/api/v1/auctions/me/enrollments");
      return data.data ?? data;
    },
    enabled: options?.enabled ?? true,
    retry: false,
    staleTime: 1000 * 15,
  });
};

export const useAuctionSnapshot = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (auctionId: string, snapshot: AuctionLeaderboardSnapshot | null) => {
      const updatedAt = snapshot?.updatedAt ?? new Date().toISOString();

      queryClient.setQueryData<Auction | undefined>(
        [...QK.auction, auctionId],
        (current) =>
          current
            ? withUpdatedLeaderboard(current, auctionId, snapshot, updatedAt)
            : current
      );

      queryClient.setQueryData<Auction[] | undefined>(QK.auctions, (current) =>
        current
          ? current.map((auction) =>
              auction.id === auctionId
                ? withUpdatedLeaderboard(
                    auction,
                    auctionId,
                    snapshot,
                    updatedAt
                  )
                : auction
            )
          : current
      );
    },
    [queryClient]
  );
};

export const useEnrollInAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      auctionId,
    }: {
      auctionId: string;
    }): Promise<EnrollmentInitiationResponse> => {
      const { data } = await api.post(`/api/v1/auctions/${auctionId}/enroll`);
      return data.data ?? data;
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...QK.auction, variables.auctionId],
      });
      queryClient.invalidateQueries({ queryKey: QK.auctionEnrollments });
    },
  });
};

interface ConfirmEnrollmentPaymentPayload {
  auctionId?: string;
  paymentIntentId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export const useConfirmEnrollmentPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      auctionId,
      ...payload
    }: ConfirmEnrollmentPaymentPayload) => {
      const { data } = await api.post(
        "/api/v1/auctions/payments/capture",
        payload
      );
      return { response: data.data ?? data, auctionId };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: QK.auctionEnrollments });
      if (result.auctionId) {
        queryClient.invalidateQueries({
          queryKey: [...QK.auction, result.auctionId],
        });
      }
      queryClient.invalidateQueries({ queryKey: QK.auctions });
    },
  });
};

interface PlaceBidPayload {
  auctionId: string;
  amount: number | string;
  clientSequence?: number;
  metadata?: Record<string, unknown>;
}

export const usePlaceBid = () => {
  const queryClient = useQueryClient();
  const applySnapshot = useAuctionSnapshot();

  return useMutation({
    mutationFn: async ({ auctionId, ...body }: PlaceBidPayload) => {
      const { data } = await api.post(
        `/api/v1/auctions/${auctionId}/bids`,
        body
      );
      return { auctionId, payload: data.data ?? data } as {
        auctionId: string;
        payload: {
          leaderboard: AuctionLeaderboardSnapshot | null;
        };
      };
    },
    onSuccess: ({ auctionId, payload }) => {
      applySnapshot(auctionId, payload.leaderboard ?? null);
      queryClient.invalidateQueries({ queryKey: [...QK.auction, auctionId] });
      queryClient.invalidateQueries({ queryKey: QK.auctions });
    },
  });
};
