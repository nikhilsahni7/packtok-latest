"use client";

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type VendorAnalyticsRange = "all" | "30d" | "90d";

export type VendorProductAnalytics = {
  range: VendorAnalyticsRange;
  overview: {
    totalProducts: number;
    totalViews: number;
    cartOrdersCount: number;
    quoteCompletedCount: number;
    totalUnitsSold: number;
    cartUnitsSold: number;
    quoteUnitsSold: number;
    totalRevenueByCurrency: Array<{ currency: string; amount: number }>;
    cartRevenueByCurrency: Array<{ currency: string; amount: number }>;
    quoteRevenueByCurrency: Array<{ currency: string; amount: number }>;
  };
  breakdown: {
    status: {
      available: number;
      outOfStock: number;
      draft: number;
      sold: number;
    };
    submission: {
      pending: number;
      approved: number;
      rejected: number;
    };
  };
  topViewed: Array<{
    productId: string;
    title: string;
    image: string | null;
    currency: string;
    price: number;
    views: number;
  }>;
  topSelling: Array<{
    productId: string;
    title: string;
    image: string | null;
    unitsSold: number;
    cartUnitsSold: number;
    quoteUnitsSold: number;
    revenue: number;
    currency: string;
  }>;
};

export function useVendorProductAnalytics(range: VendorAnalyticsRange) {
  return useQuery<VendorProductAnalytics, Error>({
    queryKey: ["vendor-product-analytics", range],
    queryFn: async () => {
      const { data } = await api.get(
        `/api/v1/vendors/products/analytics?range=${range}`
      );
      return data.data as VendorProductAnalytics;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}
