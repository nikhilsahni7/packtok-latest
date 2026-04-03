"use client";

import { useVendorApplication } from "@/hooks/useVendorApplication";
import {
  VendorDashboardRange,
  useVendorDashboardAnalytics,
} from "@/hooks/useVendorDashboardAnalytics";
import { useMySubscription } from "@/hooks/useVendorSubscription";
import api from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { Crown, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function VendorDashboardClient() {
  const { data, isLoading, isError } = useVendorApplication();
  const [reapplying, setReapplying] = useState(false);
  const queryClient = useQueryClient();

  const handleReapply = async () => {
    setReapplying(true);
    try {
      await api.post("/api/v1/vendors/apply");
      toast.success(
        "Your application has been re-submitted! We will review it shortly."
      );
      queryClient.invalidateQueries({ queryKey: ["vendor-application"] });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to re-apply. Please try again.";
      toast.error(msg);
    } finally {
      setReapplying(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

  if (isError)
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Vendor Dashboard
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">
            Unable to load vendor status. Please refresh the page.
          </p>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Vendor Dashboard
        </h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            Welcome to Packtok Vendor Portal
          </h2>
          <p className="text-sm text-blue-700 mb-4">
            You have not applied to become a vendor yet. Start selling your
            products on our platform!
          </p>
          <Link
            href="/auth/vendor/signup"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply to Become a Vendor
          </Link>
        </div>
      </div>
    );

  if (data.status === "PENDING")
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Vendor Dashboard
        </h1>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
            <h2 className="text-lg font-semibold text-amber-900">
              Application Under Review
            </h2>
          </div>
          <p className="text-sm text-amber-700 mb-2">
            Your vendor application is currently pending admin approval.
          </p>
          <p className="text-xs text-amber-600">
            You will receive an email notification once your application has
            been reviewed. In the meantime, feel free to explore our platform.
          </p>
        </div>
      </div>
    );

  if (data.status === "REJECTED")
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Vendor Dashboard
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-2">
            Application Rejected
          </h2>
          <p className="text-sm text-red-700 mb-2">
            Unfortunately, your vendor application was not approved.
          </p>
          {data.notes && (
            <div className="bg-red-100 rounded p-3 mb-4">
              <p className="text-xs font-medium text-red-800 mb-1">Reason:</p>
              <p className="text-sm text-red-700">{data.notes}</p>
            </div>
          )}
          <button
            onClick={handleReapply}
            disabled={reapplying}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {reapplying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {reapplying ? "Re-applying..." : "Re-apply as Vendor"}
          </button>
        </div>
      </div>
    );

  // APPROVED - Full Dashboard
  return <DashboardContent />;
}

function DashboardContent() {
  const [range, setRange] = useState<VendorDashboardRange>("30d");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("all");
  const { data: subInfo } = useMySubscription();
  const { data: analytics, isLoading: analyticsLoading } =
    useVendorDashboardAnalytics(range);

  const productCount = subInfo?.productCount ?? 0;
  const productLimit = subInfo?.productLimit ?? 0;
  const canCreate = subInfo?.canCreateProduct ?? true;
  const planName = subInfo?.subscription?.planNameSnapshot ?? "Free";
  const planSlug = subInfo?.subscription?.plan?.slug ?? "free";

  const availableCurrencies =
    analytics?.overview.revenueByCurrency.map((r) => r.currency) ?? [];

  const effectiveSelectedCurrency =
    selectedCurrency !== "all" && availableCurrencies.includes(selectedCurrency)
      ? selectedCurrency
      : "all";

  const trend =
    effectiveSelectedCurrency === "all"
      ? (analytics?.trend ?? [])
      : (analytics?.trend ?? []).map((item) => ({
          ...item,
          revenue:
            item.currency === effectiveSelectedCurrency ? item.revenue : 0,
          currency: effectiveSelectedCurrency,
        }));
  const maxRevenue = Math.max(...trend.map((item) => item.revenue), 1);
  const maxBarValue = Math.max(
    ...trend.flatMap((item) => [item.views, item.orders]),
    1
  );

  const linePoints = trend
    .map((item, index) => {
      const x =
        trend.length > 1 ? 20 + (360 / (trend.length - 1)) * index : 200;
      const y = 140 - (item.revenue / maxRevenue) * 110;
      return `${x},${y}`;
    })
    .join(" ");

  const newCustomerPercent =
    analytics?.customerDistribution.newCustomerPercent ?? 0;
  const returningCustomerPercent = Math.max(0, 100 - newCustomerPercent);
  const circumference = 2 * Math.PI * 50;
  const newCustomerArc = (newCustomerPercent / 100) * circumference;
  const returningCustomerArc = (returningCustomerPercent / 100) * circumference;

  const rangeLabel =
    range === "all"
      ? "All time"
      : range === "30d"
        ? "Last 30 days"
        : "Last 90 days";

  const formatCurrency = (value: number, currency: string) => {
    try {
      return new Intl.NumberFormat("en", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${currency} ${value.toFixed(2)}`;
    }
  };

  const primaryCurrency = analytics?.overview.primaryCurrency ?? null;
  const revenueByCurrency = analytics?.overview.revenueByCurrency ?? [];
  const selectedCurrencyTotal =
    effectiveSelectedCurrency === "all"
      ? null
      : (revenueByCurrency.find(
          (item) => item.currency === effectiveSelectedCurrency
        ) ?? null);
  const currentTotalRevenue =
    selectedCurrencyTotal?.amount ?? analytics?.overview.totalRevenue ?? 0;
  const currentDisplayCurrency =
    effectiveSelectedCurrency === "all"
      ? primaryCurrency
      : effectiveSelectedCurrency;
  const hasSales =
    effectiveSelectedCurrency === "all"
      ? revenueByCurrency.some((item) => item.amount > 0)
      : (selectedCurrencyTotal?.amount ?? 0) > 0;

  const changeText =
    analytics?.overview.salesChangePercent == null
      ? "No previous period"
      : `${analytics.overview.salesChangePercent >= 0 ? "↗" : "↘"} ${Math.abs(
          analytics.overview.salesChangePercent
        ).toFixed(2)}%`;

  const showMobileLabel = (index: number, total: number) => {
    if (total <= 4) return true;
    if (total <= 8) return index % 2 === 0;
    return index % 3 === 0 || index === total - 1;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Subscription Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Crown className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{planName} Plan</p>
              <p className="text-xs text-gray-500">
                {productCount} / {productLimit} products used
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-40">
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    productCount >= productLimit
                      ? "bg-red-500"
                      : productCount >= productLimit * 0.8
                        ? "bg-amber-500"
                        : "bg-blue-500"
                  }`}
                  style={{
                    width: `${Math.min(100, (productCount / Math.max(productLimit, 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
            {planSlug === "free" && (
              <Link
                href="/vendor/subscription"
                className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Upgrade Plan
              </Link>
            )}
          </div>
        </div>
        {!canCreate && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <p className="text-xs text-red-700">
              You&apos;ve reached your product limit.{" "}
              <Link
                href="/vendor/subscription"
                className="font-semibold underline"
              >
                Upgrade your plan
              </Link>{" "}
              to add more products.
            </p>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Vendor account active
              </span>
            </div>
          </div>
        </div>
        {canCreate ? (
          <Link
            href="/vendor/products/new"
            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            + Add product
          </Link>
        ) : (
          <Link
            href="/vendor/subscription"
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            Upgrade to add products
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Sales Analytics */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Total Sales Card */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Total Sales
              </h3>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={effectiveSelectedCurrency}
                  onChange={(event) => setSelectedCurrency(event.target.value)}
                  className="text-sm border rounded-lg px-3 py-1 text-gray-600 w-full sm:w-auto"
                >
                  <option value="all">All currencies</option>
                  {availableCurrencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
                <select
                  value={range}
                  onChange={(event) =>
                    setRange(event.target.value as VendorDashboardRange)
                  }
                  className="text-sm border rounded-lg px-3 py-1 text-gray-600 w-full sm:w-auto"
                >
                  <option value="all">All time</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {analyticsLoading
                    ? "..."
                    : currentDisplayCurrency
                      ? formatCurrency(
                          currentTotalRevenue,
                          currentDisplayCurrency
                        )
                      : "No sales yet"}
                </span>
                <span className="text-base text-gray-600">
                  {analytics?.overview.totalOrders ?? 0} orders
                </span>
              </div>
              {revenueByCurrency.length > 1 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {revenueByCurrency.map((item) => (
                    <span
                      key={item.currency}
                      className={`text-xs px-2 py-1 rounded-full border ${
                        effectiveSelectedCurrency === item.currency
                          ? "bg-blue-50 border-blue-300 text-blue-700"
                          : "bg-gray-100 border-gray-200 text-gray-600"
                      }`}
                    >
                      {item.currency}:{" "}
                      {formatCurrency(item.amount, item.currency)}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`text-sm ${
                    (analytics?.overview.salesChangePercent ?? 0) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {changeText}
                </span>
                <span className="text-gray-500 text-sm">
                  vs previous{" "}
                  {analytics?.overview.comparisonLabel ??
                    rangeLabel.toLowerCase()}
                </span>
              </div>
            </div>

            {/* Sales Chart */}
            <div className="relative">
              {trend.length > 0 && hasSales ? (
                <>
                  <div className="h-40 sm:h-48">
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 400 150"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient
                          id="salesGradient"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#3B82F6"
                            stopOpacity="0.2"
                          />
                          <stop
                            offset="100%"
                            stopColor="#3B82F6"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>

                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <line
                          key={i}
                          x1="0"
                          y1={25 + i * 25}
                          x2="400"
                          y2={25 + i * 25}
                          stroke="#f3f4f6"
                          strokeWidth="1"
                        />
                      ))}

                      <polyline
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        points={linePoints}
                      />

                      <polyline
                        fill="url(#salesGradient)"
                        stroke="none"
                        points={`${linePoints} 380,150 20,150`}
                      />

                      {trend.map((item, index) => {
                        const x =
                          trend.length > 1
                            ? 20 + (360 / (trend.length - 1)) * index
                            : 200;
                        const y = 140 - (item.revenue / maxRevenue) * 110;
                        return (
                          <circle
                            key={item.label}
                            cx={x}
                            cy={y}
                            r="3"
                            fill="#3B82F6"
                          />
                        );
                      })}
                    </svg>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 text-xs text-gray-500 mt-2 gap-x-1 gap-y-1">
                    {trend.map((item, index) => (
                      <span
                        key={item.label}
                        className={`truncate ${
                          showMobileLabel(index, trend.length)
                            ? "block"
                            : "hidden sm:block"
                        }`}
                        title={item.label}
                      >
                        {item.label}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-40 sm:h-48 border border-dashed border-gray-200 rounded-md flex items-center justify-center text-sm text-gray-500">
                  No sales data available for {rangeLabel.toLowerCase()}
                  {effectiveSelectedCurrency !== "all"
                    ? ` in ${effectiveSelectedCurrency}`
                    : ""}
                  .
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500 mt-4">
              Range: {rangeLabel}
            </div>
          </div>

          {/* Product Views Chart */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Product views
              </h3>
              <select
                value={range}
                onChange={(event) =>
                  setRange(event.target.value as VendorDashboardRange)
                }
                className="text-sm border rounded-lg px-3 py-1 text-gray-600 w-full sm:w-auto"
              >
                <option value="all">All time</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>

            {/* Bar Chart */}
            <div className="h-56 sm:h-64 flex items-end justify-between gap-1 sm:gap-4 mb-4 overflow-x-auto px-1">
              {trend.length > 0 ? (
                trend.map((data) => (
                  <div
                    key={data.label}
                    className="flex flex-col items-center gap-2 min-w-[40px] sm:min-w-0 flex-1"
                  >
                    <div className="flex gap-1 items-end h-40">
                      <div
                        className="bg-blue-500 rounded-t w-4"
                        style={{
                          height: `${Math.max(4, (data.views / maxBarValue) * 100)}%`,
                        }}
                      ></div>
                      <div
                        className="bg-orange-400 rounded-t w-4"
                        style={{
                          height: `${Math.max(4, (data.orders / maxBarValue) * 100)}%`,
                        }}
                      ></div>
                    </div>
                    <span
                      className="text-[11px] leading-4 text-gray-500 text-center truncate w-full"
                      title={data.label}
                    >
                      {data.label}
                    </span>
                  </div>
                ))
              ) : (
                <div className="w-full h-full border border-dashed border-gray-200 rounded-md flex items-center justify-center text-sm text-gray-500">
                  No product views data available for {rangeLabel.toLowerCase()}
                  .
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded"></div>
                <span className="text-sm text-gray-600">Orders</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* New Sale Donut Chart */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Customer distribution
            </h3>

            <div className="flex items-center justify-center relative mb-6">
              <svg
                className="w-32 h-32 transform -rotate-90"
                viewBox="0 0 120 120"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="20"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="20"
                  strokeDasharray={`${newCustomerArc} ${circumference - newCustomerArc}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="20"
                  strokeDasharray={`${returningCustomerArc} ${circumference - returningCustomerArc}`}
                  strokeDashoffset={`-${newCustomerArc}`}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm text-gray-600">New customer</span>
                <span className="text-xl font-bold text-gray-900">
                  {newCustomerPercent.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">New customer</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {analytics?.customerDistribution.newCustomers ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Returning customer
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {analytics?.customerDistribution.returningCustomers ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* Popular Products */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Popular products
            </h3>

            <div className="space-y-4">
              {(analytics?.popularProducts ?? []).map((product) => (
                <div
                  key={product.productId}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500 overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      "N/A"
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {product.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.unitsSold} units sold
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(product.revenue, product.currency)}
                    </p>
                  </div>
                </div>
              ))}
              {analytics && analytics.popularProducts.length === 0 && (
                <p className="text-sm text-gray-500">
                  No sales yet for selected range.
                </p>
              )}
            </div>

            <Link
              href="/vendor/products"
              className="block w-full mt-4 py-2 text-sm text-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              All products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
