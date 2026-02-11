"use client";

import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ─── Types ──────────────────────────────────────────────────────────────────

export type VendorPlan = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  maxProducts: number;
  priceUsd: string | number;
  interval: string;
  isContactSales: boolean;
  sortOrder: number;
  features: string[];
};

export type VendorSubscription = {
  id: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "PAYMENT_PENDING";
  startDate: string | null;
  endDate: string | null;
  autoRenew: boolean;
  planNameSnapshot: string;
  maxProductsSnapshot: number;
  priceUsdSnapshot: string | number;
  plan: {
    id: string;
    name: string;
    slug: string;
    maxProducts: number;
    priceUsd: string | number;
    isContactSales: boolean;
    features: string[];
  };
};

export type SubscriptionInfo = {
  subscription: VendorSubscription | null;
  productCount: number;
  productLimit: number;
  canCreateProduct: boolean;
};

export type SubscribeResult =
  | {
      type: "free";
      subscription: VendorSubscription;
    }
  | {
      type: "payment";
      subscriptionId: string;
      razorpayOrderId: string;
      razorpayKey: string;
      amount: number;
      currency: string;
      planName: string;
    };

// ─── Hooks ──────────────────────────────────────────────────────────────────

export function usePlans() {
  return useQuery<VendorPlan[], Error>({
    queryKey: ["vendor-plans"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/subscriptions/plans");
      return data.data as VendorPlan[];
    },
    staleTime: 5 * 60_000, // Plans don't change often
  });
}

export function useMySubscription() {
  return useQuery<SubscriptionInfo, Error>({
    queryKey: ["vendor-subscription-info"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/subscriptions/me");
      return data.data as SubscriptionInfo;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function useSubscriptionHistory() {
  return useQuery<VendorSubscription[], Error>({
    queryKey: ["vendor-subscription-history"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/subscriptions/me/history");
      return data.data as VendorSubscription[];
    },
    staleTime: 60_000,
  });
}

export function useSubscribe() {
  const qc = useQueryClient();
  return useMutation<SubscribeResult, Error, string>({
    mutationFn: async (planId: string) => {
      const { data } = await api.post("/api/v1/subscriptions/subscribe", {
        planId,
      });
      return data.data as SubscribeResult;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-subscription-info"] });
      qc.invalidateQueries({ queryKey: ["vendor-subscription-history"] });
      qc.invalidateQueries({ queryKey: ["vendor-products"] });
    },
  });
}

export function useVerifySubscriptionPayment() {
  const qc = useQueryClient();
  return useMutation<
    VendorSubscription,
    Error,
    {
      subscriptionId: string;
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    }
  >({
    mutationFn: async (payload) => {
      const { data } = await api.post(
        "/api/v1/subscriptions/verify-payment",
        payload
      );
      return data.data as VendorSubscription;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-subscription-info"] });
      qc.invalidateQueries({ queryKey: ["vendor-subscription-history"] });
      qc.invalidateQueries({ queryKey: ["vendor-products"] });
    },
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation<VendorSubscription, Error, void>({
    mutationFn: async () => {
      const { data } = await api.post("/api/v1/subscriptions/cancel");
      return data.data as VendorSubscription;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-subscription-info"] });
      qc.invalidateQueries({ queryKey: ["vendor-subscription-history"] });
    },
  });
}

export function useProductLimit() {
  return useQuery<
    { allowed: boolean; currentCount: number; limit: number },
    Error
  >({
    queryKey: ["vendor-product-limit"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/subscriptions/product-limit");
      return data.data;
    },
    staleTime: 15_000,
  });
}
