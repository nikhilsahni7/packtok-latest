// hooks/useAuctions.ts
import api from "@/lib/api";
import {
  Auction,
  AuctionEnrollment,
  AuctionLeaderboardSnapshot,
  EnrollmentInitiationResponse,
  PlaceBidRequest,
  PlaceBidResponse,
} from "@/types/auction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const QK = {
  auctions: ["auctions"],
  auction: ["auction"],
  auctionEnrollments: ["auction-enrollments"],
};

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

      queryClient.setQueryData<Auction[] | undefined>(QK.auctions, (items) => {
        if (!items) {
          return items;
        }
        return items.map((auction) =>
          auction.id === auctionId
            ? withUpdatedLeaderboard(auction, auctionId, snapshot, updatedAt)
            : auction
        );
      });

      queryClient.setQueryData<AuctionEnrollment[] | undefined>(
        QK.auctionEnrollments,
        (items) => {
          if (!items) {
            return items;
          }
          return items.map((enrollment) => {
            if (enrollment.auction?.id !== auctionId) {
              return enrollment;
            }
            return {
              ...enrollment,
              auction: withUpdatedLeaderboard(
                enrollment.auction,
                auctionId,
                snapshot,
                updatedAt
              ),
            };
          });
        }
      );
    },
    [queryClient]
  );
};

export const useEnrollInAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      auctionId: string;
    }): Promise<EnrollmentInitiationResponse> => {
      const { data: response } = await api.post(
        `/api/v1/auctions/${data.auctionId}/enroll`
      );
      return response.data ?? response;
    },
    onSuccess: () => {
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

export const usePlaceBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      auctionId,
      amount,
    }: {
      auctionId: string;
      amount: string;
    }): Promise<PlaceBidResponse> => {
      const payload: PlaceBidRequest = { amount };
      const { data } = await api.post(
        `/api/v1/auctions/${auctionId}/bids`,
        payload
      );
      return data.data ?? data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...QK.auction, variables.auctionId],
      });
      queryClient.invalidateQueries({ queryKey: QK.auctions });
      queryClient.invalidateQueries({ queryKey: QK.auctionEnrollments });
    },
  });
};
