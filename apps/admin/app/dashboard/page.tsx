"use client";

import { Button } from "@packtok/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useProducts, useQuotes } from "../../hooks";
import api from "../../lib/axios";
import { Order } from "../../types/order";
import { DashboardCharts } from "./_components/dashboard-charts";
import { DashboardStats } from "./_components/dashboard-stats";
import { DashboardTables } from "./_components/dashboard-tables";

export default function DashboardPage() {
  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts();

  const {
    data: quotes = [],
    isLoading: quotesLoading,
    error: quotesError,
    refetch: refetchQuotes,
  } = useQuotes();

  const {
    data: orders = [],
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["dashboard", "orders"],
    queryFn: async (): Promise<Order[]> => {
      const response = await api.get("/api/v1/admins/orders");
      return response.data.data?.orders || response.data.orders || [];
    },
    staleTime: 1000 * 60,
  });

  const dashboardData = useMemo(() => {
    const successfulOrderStatuses = [
      "PAID",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
    ];
    const recentOrderStatuses = ["PAID", "DELIVERED", "REFUNDED", "CANCELLED"];

    const inStockCount = products.filter(
      (product) => product.status === "AVAILABLE" && product.quantity > 0,
    ).length;

    const recentOrders = [...orders]
      .filter((order) => recentOrderStatuses.includes(order.status))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5)
      .map((order) => ({
        id: order.orderNumber,
        product:
          order.items[0]?.product?.title || order.items[0]?.productTitle || "-",
        price: `${order.currency} ${Number(order.items[0]?.productPrice || 0).toLocaleString()}`,
        status:
          order.status === "DELIVERED"
            ? "COMPLETED"
            : order.status === "REFUNDED"
              ? "REFUND"
              : order.status === "CANCELLED"
                ? "CANCEL"
                : "PAID",
        total: `${order.currency} ${Number(order.totalAmount).toLocaleString()}`,
      }));

    const monthFormatter = new Intl.DateTimeFormat("en", {
      month: "short",
      year: "2-digit",
    });
    const monthKeys: string[] = [];

    for (let i = 6; i >= 0; i -= 1) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - i);
      const label = monthFormatter.format(monthDate);
      monthKeys.push(label);
    }

    const currencies = Array.from(
      new Set(
        orders
          .filter((order) => successfulOrderStatuses.includes(order.status))
          .map((order) => order.currency || "INR"),
      ),
    ).sort();

    const monthlyMapByCurrency = new Map<string, Map<string, number>>();
    monthKeys.forEach((month) => {
      const initial = new Map<string, number>();
      currencies.forEach((currency) => initial.set(currency, 0));
      monthlyMapByCurrency.set(month, initial);
    });

    orders.forEach((order) => {
      if (successfulOrderStatuses.includes(order.status)) {
        const label = monthFormatter.format(new Date(order.createdAt));
        const monthMap = monthlyMapByCurrency.get(label);
        if (monthMap) {
          const currency = order.currency || "INR";
          monthMap.set(
            currency,
            (monthMap.get(currency) || 0) + Number(order.totalAmount),
          );
        }
      }
    });

    const salesData = monthKeys.map((month) => {
      const row: { name: string; [currency: string]: string | number } = {
        name: month,
      };
      const monthMap = monthlyMapByCurrency.get(month);
      currencies.forEach((currency) => {
        row[currency] = Math.round(monthMap?.get(currency) || 0);
      });
      return row;
    });

    const paidCount = orders.filter((order) =>
      successfulOrderStatuses.includes(order.status),
    ).length;
    const pendingCount = orders.filter((order) =>
      ["PENDING_PAYMENT", "PAYMENT_FAILED"].includes(order.status),
    ).length;
    const returnCount = orders.filter((order) =>
      ["CANCELLED", "REFUND_PENDING", "REFUNDED"].includes(order.status),
    ).length;

    const analyticsData = [
      { name: "Completed", value: paidCount, color: "#4f46e5" },
      { name: "Pending", value: pendingCount, color: "#f59e0b" },
      { name: "Cancelled/Refund", value: returnCount, color: "#ef4444" },
    ].filter((entry) => entry.value > 0);

    const productRatingMap = new Map<string, number>();
    products.forEach((product) => {
      const anyProduct = product as unknown as {
        averageRating?: number;
        reviews?: { rating?: number }[];
      };

      if (typeof anyProduct.averageRating === "number") {
        productRatingMap.set(product.id, anyProduct.averageRating);
      } else if (
        Array.isArray(anyProduct.reviews) &&
        anyProduct.reviews.length
      ) {
        const sum = anyProduct.reviews.reduce(
          (acc, review) => acc + Number(review.rating || 0),
          0,
        );
        productRatingMap.set(product.id, sum / anyProduct.reviews.length);
      }
    });

    const salesByProduct = new Map<
      string,
      {
        name: string;
        soldCount: number;
        rating: number;
        revenueByCurrency: Map<string, number>;
      }
    >();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.product?.id || item.productTitle;
        const existing = salesByProduct.get(key) || {
          name: item.product?.title || item.productTitle,
          soldCount: 0,
          rating: productRatingMap.get(item.product?.id || "") || 0,
          revenueByCurrency: new Map<string, number>(),
        };

        const lineCurrency = item.currency || order.currency || "INR";
        existing.soldCount += Number(item.quantity || 0);
        existing.revenueByCurrency.set(
          lineCurrency,
          (existing.revenueByCurrency.get(lineCurrency) || 0) +
            Number(item.totalPrice || 0),
        );

        if (!existing.rating && item.product?.id) {
          existing.rating = productRatingMap.get(item.product.id) || 0;
        }
        salesByProduct.set(key, existing);
      });
    });

    const topProducts = [...salesByProduct.values()]
      .sort((a, b) => {
        if (b.soldCount !== a.soldCount) {
          return b.soldCount - a.soldCount;
        }

        const totalA = [...a.revenueByCurrency.values()].reduce(
          (sum, value) => sum + value,
          0,
        );
        const totalB = [...b.revenueByCurrency.values()].reduce(
          (sum, value) => sum + value,
          0,
        );
        return totalB - totalA;
      })
      .slice(0, 5)
      .map((product) => ({
        name: product.name,
        rating: product.rating || 0,
        soldCount: product.soldCount,
        revenue: [...product.revenueByCurrency.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(
            ([currency, value]) =>
              `${currency} ${Math.round(value).toLocaleString()}`,
          )
          .join(" | "),
      }));

    return {
      productsCount: products.length,
      inStockCount,
      ordersCount: orders.length,
      quotesCount: quotes.length,
      salesData,
      salesCurrencies: currencies,
      analyticsData,
      recentOrders,
      topProducts,
    };
  }, [orders, products, quotes]);

  const isLoading = productsLoading || quotesLoading || ordersLoading;
  const hasError = productsError || quotesError || ordersError;

  if (hasError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-semibold text-red-800">
              Failed to load dashboard data
            </h2>
            <p className="text-sm text-red-700 mt-1">
              Please retry. If this continues, verify API connectivity and auth.
            </p>
          </div>
          <Button
            onClick={() => {
              refetchProducts();
              refetchQuotes();
              refetchOrders();
            }}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 rounded-2xl bg-slate-200" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 rounded-2xl bg-slate-200" />
          <div className="h-80 rounded-2xl bg-slate-200" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 rounded-2xl bg-slate-200" />
          <div className="h-96 rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  const currentMonthYear = new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Live snapshot of marketplace performance and order operations
          </p>
        </div>
        <Button variant="outline" className="text-sm bg-white shadow-sm">
          {currentMonthYear}
        </Button>
      </div>

      <DashboardStats
        productsCount={dashboardData.productsCount}
        inStockCount={dashboardData.inStockCount}
        ordersCount={dashboardData.ordersCount}
        quotesCount={dashboardData.quotesCount}
      />

      <DashboardCharts
        salesData={dashboardData.salesData}
        salesCurrencies={dashboardData.salesCurrencies}
        analyticsData={dashboardData.analyticsData}
      />

      <DashboardTables
        recentOrders={dashboardData.recentOrders}
        topProducts={dashboardData.topProducts}
      />
    </div>
  );
}
