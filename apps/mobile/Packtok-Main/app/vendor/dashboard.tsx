import VendorButton from "@/components/VendorButton";
import {
  useApplyVendor,
  useVendorApplication,
} from "@/hooks/useVendorApplication";
import { useVendorProducts } from "@/hooks/useVendorProducts";
import { useMyVendorSubscription } from "@/hooks/useVendorSubscription";
import { useAuthStore } from "@/store/auth-store";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function VendorDashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [companyName, setCompanyName] = useState("");
  const [notes, setNotes] = useState("");

  const {
    data: application,
    isLoading,
    refetch: refetchApplication,
    isFetching,
  } = useVendorApplication();
  const { mutate: applyVendor, isPending: isApplying } = useApplyVendor();

  const {
    data: subscription,
    isLoading: isSubscriptionLoading,
    refetch: refetchSubscription,
  } = useMyVendorSubscription();
  const { data: products = [], refetch: refetchProducts } = useVendorProducts();

  const onRefresh = useCallback(async () => {
    await Promise.allSettled([
      refetchApplication(),
      refetchSubscription(),
      refetchProducts(),
    ]);
  }, [refetchApplication, refetchSubscription, refetchProducts]);

  useFocusEffect(
    useCallback(() => {
      void onRefresh();
      return undefined;
    }, [onRefresh]),
  );

  const handleApply = () => {
    applyVendor(
      {
        companyName: companyName.trim() || undefined,
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: () => {
          setCompanyName("");
          setNotes("");
        },
      },
    );
  };

  const status = application?.status;
  const isApproved = status === "APPROVED";
  const productCount = subscription?.productCount ?? 0;
  const productLimit = subscription?.productLimit ?? 0;
  const drafts = products.filter((item) => item.status === "DRAFT").length;
  const released = products.filter(
    (item) => item.submissionStatus === "APPROVED",
  ).length;
  const pendingReview = products.filter(
    (item) => item.submissionStatus === "PENDING_APPROVAL",
  ).length;
  const usagePercent = useMemo(() => {
    const safeLimit = Math.max(productLimit, 1);
    return Math.min(100, (productCount / safeLimit) * 100);
  }, [productCount, productLimit]);
  const usageColor =
    usagePercent >= 100
      ? "bg-red-500"
      : usagePercent >= 80
        ? "bg-amber-500"
        : "bg-blue-500";
  const canCreateProduct = subscription?.canCreateProduct ?? true;
  const recentProducts = useMemo(() => products.slice(0, 5), [products]);
  const accountName = user?.name || user?.email || "Vendor";
  const planName = subscription?.subscription?.planNameSnapshot || "Free";

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF8C42" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#EEF2F6]">
      <StatusBar style="dark" />

      <View
        pointerEvents="none"
        className="absolute"
        style={{ top: -width * 0.18, left: -width * 0.32, opacity: 0.9 }}
      >
        <Image
          source={require("@/assets/images/bubble 01.png")}
          style={{ width: width * 0.74, height: width * 0.74 }}
          resizeMode="contain"
        />
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isFetching || isSubscriptionLoading}
            onRefresh={onRefresh}
            tintColor="#FF8C42"
          />
        }
      >
        <View className="px-5 pt-14 pb-8">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[28px] font-bold text-gray-900">
                Dashboard
              </Text>
              <Text className="text-xs text-gray-500 mt-0.5">
                Welcome back, {accountName}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)" as any)}
              className="w-11 h-11 rounded-2xl bg-white border border-gray-200 items-center justify-center"
            >
              <Feather name="home" size={20} color="#111827" />
            </TouchableOpacity>
          </View>

          <View className="mt-5 rounded-3xl bg-[#111827] px-4 py-4">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-[11px] uppercase tracking-widest text-gray-300">
                  Vendor Workspace
                </Text>
                <Text className="text-xl font-bold text-white mt-1">
                  {isApproved
                    ? "Everything is live"
                    : "Let us get you approved"}
                </Text>
                <Text className="text-xs text-gray-300 mt-1.5">
                  {isApproved
                    ? "Track products, plan usage and launches from one place."
                    : "Complete your vendor setup to unlock product publishing."}
                </Text>
              </View>
              <View
                className={`px-3 py-1.5 rounded-full ${
                  isApproved
                    ? "bg-emerald-500/20"
                    : status === "PENDING"
                      ? "bg-amber-500/20"
                      : status === "REJECTED"
                        ? "bg-rose-500/20"
                        : "bg-blue-500/20"
                }`}
              >
                <Text className="text-[11px] font-semibold text-white">
                  {isApproved
                    ? "APPROVED"
                    : status === "PENDING"
                      ? "UNDER REVIEW"
                      : status === "REJECTED"
                        ? "ACTION REQUIRED"
                        : "NOT APPLIED"}
                </Text>
              </View>
            </View>

            <View className="mt-4 rounded-2xl bg-white/10 border border-white/15 px-3 py-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full bg-white/15 items-center justify-center">
                    <Feather name="award" size={14} color="#F9FAFB" />
                  </View>
                  <Text className="ml-2 text-sm font-semibold text-white">
                    {planName} Plan
                  </Text>
                </View>
                <Text className="text-[11px] text-gray-200">
                  {productCount}/{productLimit} used
                </Text>
              </View>

              <View className="h-2 bg-white/20 rounded-full mt-3 overflow-hidden">
                <View
                  className={`h-full ${usageColor}`}
                  style={{ width: `${usagePercent}%` }}
                />
              </View>

              {!canCreateProduct && (
                <VendorButton
                  onPress={() => router.push("/vendor/subscription" as any)}
                  label="Upgrade to Add Products"
                  variant="accent"
                  size="sm"
                  className="mt-3"
                  textClassName="text-xs"
                />
              )}
            </View>
          </View>

          <View className="mt-4 flex-row gap-3">
            <View className="flex-1 rounded-2xl bg-white border border-gray-200 px-3 py-3">
              <Text className="text-[11px] text-gray-500">Drafts</Text>
              <Text className="text-2xl font-bold text-gray-900 mt-1">
                {drafts}
              </Text>
            </View>
            <View className="flex-1 rounded-2xl bg-white border border-gray-200 px-3 py-3">
              <Text className="text-[11px] text-gray-500">Released</Text>
              <Text className="text-2xl font-bold text-gray-900 mt-1">
                {released}
              </Text>
            </View>
            <View className="flex-1 rounded-2xl bg-white border border-gray-200 px-3 py-3">
              <Text className="text-[11px] text-gray-500">Pending</Text>
              <Text className="text-2xl font-bold text-gray-900 mt-1">
                {pendingReview}
              </Text>
            </View>
          </View>

          <View className="mt-4 bg-white rounded-2xl p-4 border border-gray-200">
            <Text className="text-sm text-gray-500">Account</Text>
            <Text className="text-lg font-semibold text-gray-900 mt-1">
              {accountName}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              Role: {user?.role || "N/A"}
            </Text>
          </View>

          {!application && (
            <View className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mt-4">
              <Text className="text-base font-semibold text-blue-900">
                Apply to become a vendor
              </Text>
              <Text className="text-sm text-blue-800 mt-1">
                Submit your company details and our team will review your
                application.
              </Text>

              <TextInput
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="Company name"
                className="mt-3 bg-white rounded-xl px-4 py-3 text-gray-900"
                placeholderTextColor="#9CA3AF"
              />

              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Notes (optional)"
                multiline
                numberOfLines={3}
                className="mt-3 bg-white rounded-xl px-4 py-3 text-gray-900"
                placeholderTextColor="#9CA3AF"
                style={{ textAlignVertical: "top" }}
              />

              <VendorButton
                onPress={handleApply}
                disabled={isApplying}
                loading={isApplying}
                label={isApplying ? "Submitting..." : "Submit Application"}
                variant="info"
                className="mt-3"
              />
            </View>
          )}

          {status === "PENDING" && (
            <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-4">
              <Text className="text-base font-semibold text-amber-900">
                Application Under Review
              </Text>
              <Text className="text-sm text-amber-800 mt-1">
                Your vendor application is pending admin approval.
              </Text>
            </View>
          )}

          {status === "REJECTED" && (
            <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mt-4">
              <Text className="text-base font-semibold text-red-900">
                Application Rejected
              </Text>
              <Text className="text-sm text-red-800 mt-1">
                You can update details with a re-application reason and apply
                again.
              </Text>
              {application?.notes ? (
                <View className="mt-3 p-3 bg-red-100 rounded-xl">
                  <Text className="text-xs text-red-900 font-medium">
                    Reason
                  </Text>
                  <Text className="text-sm text-red-800 mt-1">
                    {application.notes}
                  </Text>
                </View>
              ) : null}

              <TextInput
                value={companyName}
                onChangeText={setCompanyName}
                placeholder={application?.companyName || "Company name"}
                className="mt-3 bg-white rounded-xl px-4 py-3 text-gray-900"
                placeholderTextColor="#9CA3AF"
              />

              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Re-application reason / updated details"
                multiline
                numberOfLines={3}
                className="mt-3 bg-white rounded-xl px-4 py-3 text-gray-900"
                placeholderTextColor="#9CA3AF"
                style={{ textAlignVertical: "top" }}
              />

              <VendorButton
                onPress={handleApply}
                disabled={isApplying}
                loading={isApplying}
                label={isApplying ? "Re-applying..." : "Re-apply"}
                variant="danger"
                className="mt-3"
              />
            </View>
          )}

          {isApproved && (
            <>
              <View className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mt-4">
                <Text className="text-base font-semibold text-green-900">
                  Vendor Account Active
                </Text>
                <Text className="text-sm text-green-800 mt-1">
                  You can now manage products and subscriptions.
                </Text>
              </View>

              <View className="mt-4 bg-white border border-gray-200 rounded-2xl p-4">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-base font-semibold text-gray-900">
                    Product Views
                  </Text>
                  <TouchableOpacity className="px-3 py-1.5 rounded-full bg-gray-100">
                    <Text className="text-[11px] text-gray-600">This week</Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-end justify-between h-24">
                  {[
                    usagePercent * 0.55,
                    usagePercent * 0.7,
                    usagePercent * 0.45,
                    usagePercent * 0.85,
                    usagePercent * 0.6,
                    usagePercent * 0.9,
                  ].map((bar, idx) => (
                    <View key={idx} className="items-center">
                      <View className="w-4 h-20 rounded-md bg-gray-100 justify-end overflow-hidden">
                        <View
                          className={`${idx % 2 === 0 ? "bg-[#0EA5E9]" : "bg-[#FB923C]"} rounded-md`}
                          style={{
                            height: `${Math.max(8, Math.min(100, bar))}%`,
                          }}
                        />
                      </View>
                    </View>
                  ))}
                </View>

                <View className="flex-row items-center mt-3">
                  <View className="w-3 h-3 rounded-sm bg-[#0EA5E9]" />
                  <Text className="text-xs text-gray-500 ml-1.5">
                    Lifetime Value
                  </Text>
                  <View className="w-3 h-3 rounded-sm bg-[#FB923C] ml-4" />
                  <Text className="text-xs text-gray-500 ml-1.5">
                    Customer Cost
                  </Text>
                </View>
              </View>

              <View className="mt-4 bg-white border border-gray-200 rounded-2xl p-4">
                <Text className="text-base font-semibold text-gray-900 mb-3">
                  Notifications
                </Text>
                {recentProducts.length === 0 ? (
                  <Text className="text-sm text-gray-500">
                    No recent product activity.
                  </Text>
                ) : (
                  recentProducts.map((item) => (
                    <View
                      key={item.id}
                      className="flex-row items-center justify-between py-2 border-b border-gray-100"
                    >
                      <View className="flex-1 pr-3">
                        <Text
                          className="text-sm font-medium text-gray-900"
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>
                        <Text
                          className="text-xs text-gray-500 mt-0.5"
                          numberOfLines={1}
                        >
                          {item.submissionStatus === "PENDING_APPROVAL"
                            ? "Submitted and waiting for admin review"
                            : item.submissionStatus === "APPROVED"
                              ? "Live in marketplace"
                              : item.submissionStatus === "REJECTED"
                                ? "Requires changes"
                                : "Saved as draft"}
                        </Text>
                      </View>
                      <Feather name="chevron-right" size={16} color="#9CA3AF" />
                    </View>
                  ))
                )}
              </View>

              <View className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
                <Text className="text-sm font-semibold text-gray-900 mb-3">
                  Quick Actions
                </Text>
                <View className="flex-row flex-wrap -mx-1.5">
                  {[
                    {
                      title: "All Products",
                      note: "Manage catalog",
                      icon: "grid",
                      bg: "bg-[#EEF6FF]",
                      onPress: () =>
                        router.push("/vendor/products?tab=all" as any),
                    },
                    {
                      title: "Subscription",
                      note: "Plans and billing",
                      icon: "credit-card",
                      bg: "bg-[#FFF4E8]",
                      onPress: () => router.push("/vendor/subscription" as any),
                    },
                    {
                      title: "Draft Queue",
                      note: "Unpublished items",
                      icon: "file-text",
                      bg: "bg-[#F5F3FF]",
                      onPress: () =>
                        router.push("/vendor/products?tab=drafts" as any),
                    },
                    {
                      title: "Released",
                      note: "Live in market",
                      icon: "check-circle",
                      bg: "bg-[#ECFDF3]",
                      onPress: () =>
                        router.push("/vendor/products?tab=released" as any),
                    },
                  ].map((action) => (
                    <TouchableOpacity
                      key={action.title}
                      onPress={action.onPress}
                      activeOpacity={0.85}
                      className="w-1/2 px-1.5 mb-3"
                    >
                      <View
                        className={`${action.bg} rounded-2xl border border-gray-200 px-3 py-3`}
                      >
                        <View className="w-8 h-8 rounded-xl bg-white items-center justify-center border border-gray-200">
                          <Feather
                            name={action.icon as any}
                            size={15}
                            color="#111827"
                          />
                        </View>
                        <Text className="text-sm font-semibold text-gray-900 mt-2.5">
                          {action.title}
                        </Text>
                        <Text className="text-[11px] text-gray-600 mt-0.5">
                          {action.note}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
