"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import api from "../lib/axios";
import {
  Auction,
  AuctionBidType,
  AuctionLeaderboardSnapshot,
  AuctionStatus,
} from "../types/auction";
import { QK } from "../utils/queryKeys";

interface CreateAuctionPayload {
  productId: string;
  mode: AuctionBidType;
  startAt: string;
  endAt: string;
  startingAmount: number;
  earnestAmount: number;
  currency: string;
  minBidIncrement?: number | null;
  minBidDecrement?: number | null;
  reservePrice?: number | null;
  maxWinners?: number;
  notes?: string | null;
  status?: AuctionStatus;
}

interface UpdateAuctionPayload extends Partial<CreateAuctionPayload> {}

export const useAdminAuctions = () => {
  return useQuery({
    queryKey: QK.auctions,
    queryFn: async (): Promise<Auction[]> => {
      const { data } = await api.get("/api/v1/admins/auctions");
      return data.data ?? data;
    },
    staleTime: 1000 * 30,
  });
};

export const useAdminAuction = (auctionId: string | null | undefined) => {
  return useQuery({
    queryKey: [...QK.auction, auctionId],
    enabled: Boolean(auctionId),
    queryFn: async (): Promise<Auction> => {
      const { data } = await api.get(`/api/v1/admins/auctions/${auctionId}`);
      return data.data ?? data;
    },
    staleTime: 1000 * 10,
  });
};

const normalizeBody = (
  payload: CreateAuctionPayload | UpdateAuctionPayload
) => {
  const body: Record<string, unknown> = { ...payload };
  if (payload.minBidIncrement === undefined) {
    delete body.minBidIncrement;
  }
  if (payload.minBidDecrement === undefined) {
    delete body.minBidDecrement;
  }
  if (payload.reservePrice === undefined) {
    delete body.reservePrice;
  }
  if (payload.maxWinners === undefined) {
    delete body.maxWinners;
  }
  if (!payload.notes) {
    body.notes = null;
  }
  return body;
};

export const useCreateAuction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateAuctionPayload): Promise<Auction> => {
      const body = normalizeBody(payload);
      const { data } = await api.post("/api/v1/admins/auctions", body);
      return data.data ?? data;
    },
    onSuccess: (auction) => {
      queryClient.invalidateQueries({ queryKey: QK.auctions });
      queryClient.setQueryData([...QK.auction, auction.id], auction);
    },
  });
};

export const useUpdateAuction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      auctionId,
      payload,
    }: {
      auctionId: string;
      payload: UpdateAuctionPayload;
    }): Promise<Auction> => {
      const body = normalizeBody(payload);
      const { data } = await api.patch(
        `/api/v1/admins/auctions/${auctionId}`,
        body
      );
      return data.data ?? data;
    },
    onSuccess: (auction) => {
      queryClient.invalidateQueries({ queryKey: QK.auctions });
      queryClient.invalidateQueries({ queryKey: [...QK.auction, auction.id] });
    },
  });
};

export const useFinalizeAuction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (auctionId: string): Promise<{ winners: unknown }> => {
      const { data } = await api.post(
        `/api/v1/admins/auctions/${auctionId}/finalize`
      );
      return data.data ?? data;
    },
    onSuccess: (_result, auctionId) => {
      queryClient.invalidateQueries({ queryKey: QK.auctions });
      queryClient.invalidateQueries({ queryKey: [...QK.auction, auctionId] });
    },
  });
};

export const useAuctionSnapshot = () => {
  const queryClient = useQueryClient();
  return useCallback(
    (auctionId: string, snapshot: AuctionLeaderboardSnapshot | null) => {
      queryClient.setQueryData<Auction | undefined>(
        [...QK.auction, auctionId],
        (existing) =>
          existing
            ? {
                ...existing,
                leaderboard: existing.leaderboard
                  ? {
                      ...existing.leaderboard,
                      snapshot,
                      updatedAt: new Date().toISOString(),
                    }
                  : snapshot
                    ? {
                        id: `${auctionId}-leaderboard`,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        snapshot,
                      }
                    : existing.leaderboard,
              }
            : existing
      );
    },
    [queryClient]
  );
};
