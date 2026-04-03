"use client";

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type VendorDashboardRange = "all" | "30d" | "90d";

export type VendorDashboardAnalytics = {
  range: VendorDashboardRange;
  overview: {
    totalRevenue: number;
    primaryCurrency: string | null;
    revenueByCurrency: Array<{
      currency: string;
      amount: number;
    }>;
    totalOrders: number;
    totalViews: number;
    salesChangePercent: number | null;
    ordersChangePercent: number | null;
    comparisonLabel: string;
  };
  trend: Array<{
    label: string;
    revenue: number;
    currency: string | null;
    orders: number;
    views: number;
  }>;
  customerDistribution: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    newCustomerPercent: number;
  };
  popularProducts: Array<{
    productId: string;
    title: string;
    image: string | null;
    revenue: number;
    currency: string;
    unitsSold: number;
  }>;
};

export function useVendorDashboardAnalytics(range: VendorDashboardRange) {
  return useQuery<VendorDashboardAnalytics, Error>({
    queryKey: ["vendor-dashboard-analytics", range],
    queryFn: async () => {
      const { data } = await api.get(
        `/api/v1/vendors/me/dashboard-analytics?range=${range}`
      );
      return data.data as VendorDashboardAnalytics;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}
