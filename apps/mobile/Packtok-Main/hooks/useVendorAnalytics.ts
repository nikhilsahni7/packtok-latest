import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";

export type VendorAnalyticsRange = "all" | "30d" | "90d";

export type VendorDashboardAnalytics = {
  range: VendorAnalyticsRange;
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

export function useVendorDashboardAnalytics(range: VendorAnalyticsRange) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery<VendorDashboardAnalytics>({
    queryKey: ["vendor-dashboard-analytics", range],
    queryFn: async () => {
      const { data } = await api.get(
        `/api/v1/vendors/me/dashboard-analytics?range=${range}`,
      );
      return data.data as VendorDashboardAnalytics;
    },
    enabled: isAuthenticated,
    staleTime: 30_000,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}

export function useVendorProductAnalytics(range: VendorAnalyticsRange) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery<VendorProductAnalytics>({
    queryKey: ["vendor-product-analytics", range],
    queryFn: async () => {
      const { data } = await api.get(
        `/api/v1/vendors/products/analytics?range=${range}`,
      );
      return data.data as VendorProductAnalytics;
    },
    enabled: isAuthenticated,
    staleTime: 30_000,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}
