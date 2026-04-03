import {
  VendorAnalyticsRange,
  useVendorProductAnalytics,
} from "@/hooks/useVendorAnalytics";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const RANGE_OPTIONS: VendorAnalyticsRange[] = ["30d", "90d", "all"];

const rangeLabel = (range: VendorAnalyticsRange) => {
  if (range === "all") return "All";
  if (range === "30d") return "30D";
  return "90D";
};

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

export default function VendorAnalyticsScreen() {
  const router = useRouter();
  const [range, setRange] = useState<VendorAnalyticsRange>("30d");
  const { data, isLoading, isRefetching, refetch, isError } =
    useVendorProductAnalytics(range);

  const topCurrency = useMemo(() => {
    const first = data?.overview.totalRevenueByCurrency[0];
    return first?.currency ?? "USD";
  }, [data]);

  const topViewMax = useMemo(() => {
    return Math.max(...(data?.topViewed.map((item) => item.views) ?? [1]), 1);
  }, [data]);

  const topRevenueMax = useMemo(() => {
    return Math.max(
      ...(data?.topSelling.map((item) => item.revenue) ?? [1]),
      1,
    );
  }, [data]);

  const totalStatusCount = useMemo(() => {
    if (!data) return 0;
    return (
      data.breakdown.status.available +
      data.breakdown.status.outOfStock +
      data.breakdown.status.draft +
      data.breakdown.status.sold
    );
  }, [data]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F4F6FA]">
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#FF8C42" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F4F6FA]">
      <StatusBar style="dark" />

      <View className="px-5 pt-12 pb-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-xl border border-gray-200 items-center justify-center"
          >
            <Feather name="arrow-left" size={18} color="#111827" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Analytics</Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="w-10 h-10 rounded-xl border border-gray-200 items-center justify-center"
            disabled={isRefetching}
          >
            {isRefetching ? (
              <ActivityIndicator size="small" color="#FF8C42" />
            ) : (
              <Feather name="refresh-cw" size={16} color="#111827" />
            )}
          </TouchableOpacity>
        </View>

        <Text className="text-xs text-gray-500 mt-2">
          Includes cart orders and completed quote sales.
        </Text>

        <View className="flex-row mt-4 bg-gray-100 rounded-xl p-1">
          {RANGE_OPTIONS.map((item) => {
            const active = item === range;
            return (
              <TouchableOpacity
                key={item}
                onPress={() => setRange(item)}
                className={`flex-1 py-2 rounded-lg items-center ${active ? "bg-white" : ""}`}
              >
                <Text
                  className={`text-xs font-semibold ${active ? "text-gray-900" : "text-gray-500"}`}
                >
                  {rangeLabel(item)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 30 }}
      >
        {isError || !data ? (
          <View className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <Text className="text-red-800 font-semibold">
              Unable to load analytics
            </Text>
            <Text className="text-red-700 text-sm mt-1">
              Please try again in a moment.
            </Text>
          </View>
        ) : (
          <>
            <View className="flex-row flex-wrap -mx-1.5">
              <MetricCard
                title="Products"
                value={String(data.overview.totalProducts)}
              />
              <MetricCard
                title="Views"
                value={String(data.overview.totalViews)}
              />
              <MetricCard
                title="Units Sold"
                value={String(data.overview.totalUnitsSold)}
              />
              <MetricCard
                title="Quote Sales"
                value={String(data.overview.quoteCompletedCount)}
              />
            </View>

            <View className="mt-4 bg-white rounded-2xl border border-gray-200 p-4">
              <Text className="text-base font-semibold text-gray-900">
                Revenue Split Pulse
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                Cart vs quote contribution for selected range.
              </Text>

              <View className="mt-3">
                <View className="mb-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-gray-600">Cart units</Text>
                    <Text className="text-xs font-semibold text-gray-900">
                      {data.overview.cartUnitsSold}
                    </Text>
                  </View>
                  <View className="h-2 rounded-full bg-gray-200 mt-1 overflow-hidden">
                    <View
                      className="h-full bg-[#22C55E]"
                      style={{
                        width: `${Math.max((data.overview.cartUnitsSold / Math.max(data.overview.totalUnitsSold, 1)) * 100, data.overview.cartUnitsSold > 0 ? 6 : 0)}%`,
                      }}
                    />
                  </View>
                </View>

                <View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-gray-600">Quote units</Text>
                    <Text className="text-xs font-semibold text-gray-900">
                      {data.overview.quoteUnitsSold}
                    </Text>
                  </View>
                  <View className="h-2 rounded-full bg-gray-200 mt-1 overflow-hidden">
                    <View
                      className="h-full bg-[#6366F1]"
                      style={{
                        width: `${Math.max((data.overview.quoteUnitsSold / Math.max(data.overview.totalUnitsSold, 1)) * 100, data.overview.quoteUnitsSold > 0 ? 6 : 0)}%`,
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View className="mt-4 bg-white rounded-2xl border border-gray-200 p-4">
              <Text className="text-base font-semibold text-gray-900">
                Revenue by Currency
              </Text>
              <View className="mt-3 space-y-2">
                {data.overview.totalRevenueByCurrency.length === 0 ? (
                  <Text className="text-sm text-gray-500">
                    No revenue yet for selected range.
                  </Text>
                ) : (
                  data.overview.totalRevenueByCurrency.map((row) => (
                    <View
                      key={row.currency}
                      className="flex-row items-center justify-between py-2 border-b border-gray-100"
                    >
                      <Text className="text-sm text-gray-600">
                        {row.currency}
                      </Text>
                      <Text className="text-sm font-semibold text-gray-900">
                        {formatCurrency(row.amount, row.currency)}
                      </Text>
                    </View>
                  ))
                )}
              </View>

              <View className="mt-3 bg-gray-50 rounded-xl p-3">
                <Text className="text-xs font-semibold text-gray-800">
                  Split
                </Text>
                <Text className="text-xs text-gray-600 mt-1">
                  Cart Orders: {data.overview.cartOrdersCount} | Completed
                  Quotes: {data.overview.quoteCompletedCount}
                </Text>
                <Text className="text-xs text-gray-600 mt-1">
                  Cart Units: {data.overview.cartUnitsSold} | Quote Units:{" "}
                  {data.overview.quoteUnitsSold}
                </Text>
                <Text className="text-xs text-gray-600 mt-1">
                  Primary Currency: {topCurrency}
                </Text>
              </View>
            </View>

            <View className="mt-4 bg-white rounded-2xl border border-gray-200 p-4">
              <Text className="text-base font-semibold text-gray-900">
                Inventory and Approval Breakdown
              </Text>
              <View className="mt-2 bg-[#F8FAFC] border border-gray-100 rounded-xl p-3">
                <Text className="text-xs text-gray-600">
                  Inventory coverage: {totalStatusCount}
                </Text>
                <View className="h-2.5 rounded-full overflow-hidden bg-gray-200 mt-2 flex-row">
                  <View
                    className="h-full bg-[#22C55E]"
                    style={{
                      width: `${(data.breakdown.status.available / Math.max(totalStatusCount, 1)) * 100}%`,
                    }}
                  />
                  <View
                    className="h-full bg-[#F59E0B]"
                    style={{
                      width: `${(data.breakdown.status.outOfStock / Math.max(totalStatusCount, 1)) * 100}%`,
                    }}
                  />
                  <View
                    className="h-full bg-[#6366F1]"
                    style={{
                      width: `${(data.breakdown.status.draft / Math.max(totalStatusCount, 1)) * 100}%`,
                    }}
                  />
                  <View
                    className="h-full bg-[#0EA5E9]"
                    style={{
                      width: `${(data.breakdown.status.sold / Math.max(totalStatusCount, 1)) * 100}%`,
                    }}
                  />
                </View>
              </View>

              <View className="mt-3 flex-row flex-wrap -mx-1.5">
                <MiniPill
                  label="Available"
                  value={data.breakdown.status.available}
                />
                <MiniPill
                  label="Out of stock"
                  value={data.breakdown.status.outOfStock}
                />
                <MiniPill label="Draft" value={data.breakdown.status.draft} />
                <MiniPill label="Sold" value={data.breakdown.status.sold} />
                <MiniPill
                  label="Pending"
                  value={data.breakdown.submission.pending}
                />
                <MiniPill
                  label="Approved"
                  value={data.breakdown.submission.approved}
                />
              </View>
            </View>

            <View className="mt-4 bg-white rounded-2xl border border-gray-200 p-4">
              <Text className="text-base font-semibold text-gray-900">
                Top Selling Products
              </Text>
              {data.topSelling.length === 0 ? (
                <Text className="text-sm text-gray-500 mt-2">
                  No sold products in this range.
                </Text>
              ) : (
                data.topSelling.slice(0, 5).map((item) => (
                  <View
                    key={item.productId}
                    className="py-3 border-b border-gray-100"
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 pr-3">
                        <Text
                          className="text-sm font-semibold text-gray-900"
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1">
                          Sold {item.unitsSold} (cart {item.cartUnitsSold},
                          quote {item.quoteUnitsSold})
                        </Text>
                      </View>
                      <Text className="text-xs font-semibold text-gray-900">
                        {formatCurrency(item.revenue, item.currency)}
                      </Text>
                    </View>
                    <View className="h-1.5 rounded-full bg-gray-200 mt-2 overflow-hidden">
                      <View
                        className="h-full bg-[#F97316]"
                        style={{
                          width: `${Math.max((item.revenue / topRevenueMax) * 100, item.revenue > 0 ? 8 : 0)}%`,
                        }}
                      />
                    </View>
                  </View>
                ))
              )}
            </View>

            <View className="mt-4 bg-white rounded-2xl border border-gray-200 p-4">
              <Text className="text-base font-semibold text-gray-900">
                Top Viewed Products
              </Text>
              {data.topViewed.length === 0 ? (
                <Text className="text-sm text-gray-500 mt-2">
                  No product views in this range.
                </Text>
              ) : (
                data.topViewed.slice(0, 5).map((item) => (
                  <View
                    key={item.productId}
                    className="py-3 border-b border-gray-100"
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 pr-3">
                        <Text
                          className="text-sm font-semibold text-gray-900"
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1">
                          {formatCurrency(item.price, item.currency)}
                        </Text>
                      </View>
                      <Text className="text-xs font-semibold text-gray-900">
                        {item.views} views
                      </Text>
                    </View>
                    <View className="h-1.5 rounded-full bg-gray-200 mt-2 overflow-hidden">
                      <View
                        className="h-full bg-[#3B82F6]"
                        style={{
                          width: `${Math.max((item.views / topViewMax) * 100, item.views > 0 ? 8 : 0)}%`,
                        }}
                      />
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <View className="w-1/2 px-1.5 mb-3">
      <View className="bg-white rounded-2xl border border-gray-200 p-3">
        <Text className="text-[11px] text-gray-500">{title}</Text>
        <Text className="text-lg font-bold text-gray-900 mt-1">{value}</Text>
      </View>
    </View>
  );
}

function MiniPill({ label, value }: { label: string; value: number }) {
  return (
    <View className="w-1/2 px-1.5 mb-3">
      <View className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 flex-row items-center justify-between">
        <Text className="text-xs text-gray-600">{label}</Text>
        <Text className="text-xs font-semibold text-gray-900">{value}</Text>
      </View>
    </View>
  );
}
