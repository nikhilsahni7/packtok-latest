"use client";

import {
  VendorAnalyticsRange,
  useVendorProductAnalytics,
} from "@/hooks/useVendorProductAnalytics";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

const currencyFormatter = (value: number, currency: string) => {
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

export default function VendorAnalyticsPage() {
  const [range, setRange] = useState<VendorAnalyticsRange>("30d");
  const { data, isLoading, isError } = useVendorProductAnalytics(range);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center py-24">
        <Loader2 className="h-7 w-7 animate-spin text-gray-500" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-2">Advanced Analytics</h1>
        <p className="text-sm text-red-600">Unable to load analytics.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Link
        href="/vendor/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Advanced Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Includes cart orders and completed quote sales.
          </p>
        </div>
        <select
          value={range}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            setRange(event.target.value as VendorAnalyticsRange)
          }
          className="text-sm border rounded-lg px-3 py-2 text-gray-700"
        >
          <option value="all">All time</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Products"
          value={data.overview.totalProducts}
        />
        <MetricCard title="Total Views" value={data.overview.totalViews} />
        <MetricCard title="Units Sold" value={data.overview.totalUnitsSold} />
        <MetricCard
          title="Quote Sales"
          value={data.overview.quoteCompletedCount}
          subtitle="completed quotes"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Revenue by Currency
          </h2>
          <div className="space-y-2">
            {data.overview.totalRevenueByCurrency.length === 0 && (
              <p className="text-sm text-gray-500">
                No revenue yet for selected range.
              </p>
            )}
            {data.overview.totalRevenueByCurrency.map((item) => (
              <div
                key={item.currency}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">{item.currency}</span>
                <span className="font-semibold text-gray-900">
                  {currencyFormatter(item.amount, item.currency)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-3 grid grid-cols-2 gap-3 text-xs text-gray-600">
            <div>
              <p className="font-semibold text-gray-800 mb-1">Cart Revenue</p>
              {data.overview.cartRevenueByCurrency.map((item) => (
                <p key={`cart-${item.currency}`}>
                  {item.currency}:{" "}
                  {currencyFormatter(item.amount, item.currency)}
                </p>
              ))}
              {data.overview.cartRevenueByCurrency.length === 0 && <p>None</p>}
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">Quote Revenue</p>
              {data.overview.quoteRevenueByCurrency.map((item) => (
                <p key={`quote-${item.currency}`}>
                  {item.currency}:{" "}
                  {currencyFormatter(item.amount, item.currency)}
                </p>
              ))}
              {data.overview.quoteRevenueByCurrency.length === 0 && <p>None</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Inventory and Approval Breakdown
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <StatusPill
              label="Available"
              value={data.breakdown.status.available}
            />
            <StatusPill
              label="Out of stock"
              value={data.breakdown.status.outOfStock}
            />
            <StatusPill label="Draft" value={data.breakdown.status.draft} />
            <StatusPill label="Sold" value={data.breakdown.status.sold} />
            <StatusPill
              label="Pending Review"
              value={data.breakdown.submission.pending}
            />
            <StatusPill
              label="Approved"
              value={data.breakdown.submission.approved}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Top Selling Products
          </h2>
          <div className="space-y-3">
            {data.topSelling.length === 0 && (
              <p className="text-sm text-gray-500">
                No sold products yet in this range.
              </p>
            )}
            {data.topSelling.map((item) => (
              <div
                key={item.productId}
                className="flex items-start justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Sold: {item.unitsSold} (cart {item.cartUnitsSold}, quote{" "}
                    {item.quoteUnitsSold})
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {currencyFormatter(item.revenue, item.currency)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Top Viewed Products
          </h2>
          <div className="space-y-3">
            {data.topViewed.length === 0 && (
              <p className="text-sm text-gray-500">
                No product views in this range.
              </p>
            )}
            {data.topViewed.map((item) => (
              <div
                key={item.productId}
                className="flex items-start justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currencyFormatter(item.price, item.currency)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {item.views} views
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4 text-sm text-gray-600">
        <p>
          Sales logic: cart sales are taken from
          paid/processing/shipped/delivered orders. Quote sales are counted from
          quote requests marked completed by admins.
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: number;
  subtitle?: string;
}) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function StatusPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-gray-50 px-3 py-2 flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}
