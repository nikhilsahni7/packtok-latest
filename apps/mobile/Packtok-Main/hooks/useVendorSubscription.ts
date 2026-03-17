import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export type VendorPlan = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  maxProducts: number;
  priceUsd: string | number;
  interval: string;
  isContactSales: boolean;
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
  plan?: {
    id: string;
    name: string;
    slug: string;
    maxProducts: number;
    priceUsd: string | number;
    isContactSales: boolean;
    features: string[];
  };
};

export type VendorSubscriptionInfo = {
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

export function useVendorPlans() {
  return useQuery<VendorPlan[]>({
    queryKey: ["vendor-plans"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/subscriptions/plans");
      return data.data as VendorPlan[];
    },
    staleTime: 5 * 60_000,
  });
}

export function useMyVendorSubscription() {
  return useQuery<VendorSubscriptionInfo>({
    queryKey: ["vendor-subscription-info"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/subscriptions/me");
      return data.data as VendorSubscriptionInfo;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 15_000,
    refetchIntervalInBackground: true,
  });
}

export function useVendorSubscriptionHistory() {
  return useQuery<VendorSubscription[]>({
    queryKey: ["vendor-subscription-history"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/subscriptions/me/history");
      return data.data as VendorSubscription[];
    },
    staleTime: 60_000,
  });
}

export function useSubscribeVendorPlan() {
  const qc = useQueryClient();
  return useMutation({
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
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Subscription Failed",
        text2: error?.response?.data?.message || "Please try again.",
        position: "top",
      });
    },
  });
}

export function useVerifyVendorSubscriptionPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      subscriptionId: string;
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    }) => {
      const { data } = await api.post(
        "/api/v1/subscriptions/verify-payment",
        payload,
      );
      return data.data as VendorSubscription;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-subscription-info"] });
      qc.invalidateQueries({ queryKey: ["vendor-subscription-history"] });
      qc.invalidateQueries({ queryKey: ["vendor-products"] });
      Toast.show({
        type: "success",
        text1: "Payment Successful",
        text2: "Your subscription is now active.",
        position: "top",
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Payment Verification Failed",
        text2: error?.response?.data?.message || "Please try again.",
        position: "top",
      });
    },
  });
}

export function useCancelVendorSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/api/v1/subscriptions/cancel");
      return data.data as VendorSubscription;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-subscription-info"] });
      qc.invalidateQueries({ queryKey: ["vendor-subscription-history"] });
      Toast.show({
        type: "success",
        text1: "Subscription Cancelled",
        text2: "Your plan will remain active until expiry.",
        position: "top",
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Cancellation Failed",
        text2: error?.response?.data?.message || "Please try again.",
        position: "top",
      });
    },
  });
}
