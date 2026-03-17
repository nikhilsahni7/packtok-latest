import RazorpayCheckout from "@/components/RazorpayCheckout";
import VendorButton from "@/components/VendorButton";
import { useVendorApplication } from "@/hooks/useVendorApplication";
import {
  useCancelVendorSubscription,
  useMyVendorSubscription,
  useSubscribeVendorPlan,
  useVendorPlans,
  useVendorSubscriptionHistory,
  useVerifyVendorSubscriptionPayment,
} from "@/hooks/useVendorSubscription";
import { useAuthStore } from "@/store/auth-store";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function VendorSubscriptionScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { data: plans = [], isLoading, refetch, isFetching } = useVendorPlans();
  const { data: subscriptionInfo } = useMyVendorSubscription();
  const { mutateAsync: subscribePlan, isPending: isSubscribing } =
    useSubscribeVendorPlan();
  const { mutate: verifyPayment, isPending: isVerifying } =
    useVerifyVendorSubscriptionPayment();
  const { mutateAsync: cancelSubscription, isPending: isCancelling } =
    useCancelVendorSubscription();
  const { data: history = [] } = useVendorSubscriptionHistory();
  const { data: vendorApplication } = useVendorApplication();

  const [checkoutProps, setCheckoutProps] = useState<{
    visible: boolean;
    razorpayKey: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    subscriptionId: string;
  }>({
    visible: false,
    razorpayKey: "",
    razorpayOrderId: "",
    amount: 0,
    currency: "INR",
    subscriptionId: "",
  });
  const [autoRenewJustCancelled, setAutoRenewJustCancelled] = useState(false);

  const progress = useMemo(() => {
    const count = subscriptionInfo?.productCount ?? 0;
    const limit = Math.max(subscriptionInfo?.productLimit ?? 1, 1);
    return Math.min(100, (count / limit) * 100);
  }, [subscriptionInfo?.productCount, subscriptionInfo?.productLimit]);
  const activeSubscription = subscriptionInfo?.subscription;
  const isActive = activeSubscription?.status === "ACTIVE";
  const effectiveAutoRenew =
    Boolean(activeSubscription?.autoRenew) && !autoRenewJustCancelled;
  const statusLabel =
    activeSubscription?.status === "PAYMENT_PENDING"
      ? "Awaiting confirmation"
      : activeSubscription?.status || "N/A";
  const hasAutoRenewUpgradeBlock =
    activeSubscription?.status === "ACTIVE" && effectiveAutoRenew;
  const canShowRenewalControls = Boolean(
    activeSubscription &&
      (activeSubscription?.planNameSnapshot || "").toLowerCase() !== "free",
  );
  const vendorNotApproved =
    vendorApplication?.status === "PENDING" ||
    vendorApplication?.status === "REJECTED";
  const verifiedHistory = useMemo(
    () =>
      history.filter(
        (item) => item.status !== "PAYMENT_PENDING" && Boolean(item.startDate),
      ),
    [history],
  );

  useEffect(() => {
    setAutoRenewJustCancelled(false);
  }, [activeSubscription?.id]);

  const handleCancelAutoRenew = async () => {
    try {
      await cancelSubscription();
      setAutoRenewJustCancelled(true);
      Toast.show({
        type: "success",
        text1: "Auto-Renew Disabled",
        text2: "You can now choose a higher plan.",
        position: "top",
      });
      void refetch();
    } catch {
      // Hook-level toast already handles failures.
    }
  };

  const confirmCancelAutoRenew = () => {
    Alert.alert(
      "Cancel Auto-Renewal",
      "Are you sure you want to cancel auto-renewal? Your subscription will stay active until the current billing period ends.",
      [
        { text: "Keep Auto-Renew", style: "cancel" },
        {
          text: "Cancel Renewal",
          style: "destructive",
          onPress: () => {
            void handleCancelAutoRenew();
          },
        },
      ],
    );
  };

  const onSubscribe = async (planId: string) => {
    try {
      const res = await subscribePlan(planId);
      if (res.type === "free") {
        Toast.show({
          type: "success",
          text1: "Plan Activated",
          text2: "Your free vendor plan is active.",
          position: "top",
        });
        return;
      }

      setCheckoutProps({
        visible: true,
        razorpayKey: res.razorpayKey,
        razorpayOrderId: res.razorpayOrderId,
        amount: res.amount,
        currency: res.currency,
        subscriptionId: res.subscriptionId,
      });
    } catch {
      // Handled by hook toast.
    }
  };

  return (
    <View className="flex-1 bg-[#EEF2F6]">
      <StatusBar style="dark" />

      <View className="px-5 pt-12 pb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-gray-900">
              Subscription
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              Plans, usage and billing controls
            </Text>
          </View>
          <TouchableOpacity
            className="w-10 h-10 rounded-2xl bg-white border border-gray-200 items-center justify-center"
            onPress={() => router.push("/vendor/dashboard" as any)}
          >
            <Feather name="arrow-left" size={22} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor="#FF8C42"
          />
        }
      >
        <View className="px-5 py-5">
          {hasAutoRenewUpgradeBlock && (
            <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
              <View className="flex-row items-start">
                <View className="w-9 h-9 rounded-xl bg-amber-100 items-center justify-center mr-3">
                  <Feather name="alert-triangle" size={16} color="#B45309" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-amber-900">
                    Upgrade is blocked by auto-renew
                  </Text>
                  <Text className="text-xs text-amber-800 mt-1 leading-5">
                    You need to cancel auto-renew first to switch from Basic to
                    Premium or any higher plan.
                  </Text>
                </View>
              </View>

              <VendorButton
                onPress={confirmCancelAutoRenew}
                disabled={isCancelling}
                loading={isCancelling}
                label={
                  isCancelling
                    ? "Cancelling..."
                    : "Cancel Auto-Renew to Upgrade"
                }
                variant="danger"
                className="mt-3"
                fullWidth
              />
            </View>
          )}

          <View className="rounded-3xl p-4 mb-4 bg-white border border-gray-200">
            <Text className="text-[11px] uppercase tracking-widest text-gray-500">
              Current Plan
            </Text>
            <Text className="text-2xl font-bold text-gray-900 mt-1">
              {subscriptionInfo?.subscription?.planNameSnapshot || "Free"}
            </Text>
            <Text className="text-[11px] text-gray-600 mt-1">
              Status: {statusLabel}
            </Text>
            {activeSubscription?.endDate ? (
              <Text className="text-[11px] text-gray-600 mt-1">
                Expires:{" "}
                {new Date(activeSubscription.endDate).toLocaleDateString(
                  "en-IN",
                )}
              </Text>
            ) : null}
            <Text className="text-xs text-gray-600 mt-2">
              {subscriptionInfo?.productCount ?? 0}/
              {subscriptionInfo?.productLimit ?? 0} products used
            </Text>
            <View className="h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
              <View
                className={`h-full ${progress >= 100 ? "bg-red-500" : progress >= 80 ? "bg-amber-500" : "bg-blue-600"}`}
                style={{ width: `${progress}%` }}
              />
            </View>
            {progress >= 100 && (
              <View className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <Text className="text-xs text-red-700">
                  Product limit reached. Upgrade your plan to add more products.
                </Text>
              </View>
            )}

            {canShowRenewalControls && (
              <View className="mt-3 pt-3 border-t border-gray-100">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-sm font-semibold text-gray-900">
                      Renewal Settings
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      Disable auto-renew before upgrading to a higher plan.
                    </Text>
                  </View>
                  <VendorButton
                    onPress={confirmCancelAutoRenew}
                    disabled={isCancelling || !effectiveAutoRenew}
                    loading={isCancelling}
                    label={
                      isCancelling
                        ? "Cancelling..."
                        : effectiveAutoRenew
                          ? "Cancel Renewal"
                          : "Auto-Renew Off"
                    }
                    variant="secondary"
                    size="sm"
                  />
                </View>
              </View>
            )}
          </View>

          {activeSubscription && !isActive && (
            <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
              <Text className="text-sm font-semibold text-amber-900">
                Subscription Not Active
              </Text>
              <Text className="text-xs text-amber-700 mt-1">
                Your current subscription is not active yet. Choose a plan to
                continue publishing products.
              </Text>
            </View>
          )}

          {vendorNotApproved && (
            <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
              <Text className="text-sm font-semibold text-amber-900">
                Vendor Approval Required
              </Text>
              <Text className="text-xs text-amber-700 mt-1">
                {vendorApplication?.status === "PENDING"
                  ? "Your vendor application is pending admin approval."
                  : "Your vendor application was rejected. Re-apply from vendor dashboard."}
              </Text>
            </View>
          )}

          {isLoading ? (
            <View className="items-center py-10">
              <ActivityIndicator size="large" color="#FF8C42" />
            </View>
          ) : (
            plans.map((plan, index) => {
              const isCurrent =
                subscriptionInfo?.subscription?.plan?.id === plan.id ||
                subscriptionInfo?.subscription?.planNameSnapshot === plan.name;
              const isFeatured = !plan.isContactSales && index === 1;
              const disableUpgradeDueToAutoRenew =
                hasAutoRenewUpgradeBlock && !isCurrent && !plan.isContactSales;

              return (
                <View
                  key={plan.id}
                  className={`rounded-3xl p-4 mb-3 border ${
                    isCurrent
                      ? "bg-[#EAF3FF] border-[#BFDBFE]"
                      : isFeatured
                        ? "bg-[#FFF7ED] border-orange-200"
                        : "bg-white border-gray-200"
                  }`}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    {isCurrent ? (
                      <View className="px-2.5 py-1 rounded-full bg-blue-100">
                        <Text className="text-[10px] font-semibold text-blue-700">
                          CURRENT PLAN
                        </Text>
                      </View>
                    ) : isFeatured ? (
                      <View className="px-2.5 py-1 rounded-full bg-orange-100">
                        <Text className="text-[10px] font-semibold text-orange-700">
                          RECOMMENDED
                        </Text>
                      </View>
                    ) : (
                      <View />
                    )}
                  </View>

                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 pr-3">
                      <Text
                        className={`text-base font-semibold ${
                          isCurrent ? "text-gray-900" : "text-gray-900"
                        }`}
                      >
                        {plan.name}
                      </Text>
                      <Text
                        className={`text-xs mt-1 ${
                          isCurrent ? "text-gray-600" : "text-gray-500"
                        }`}
                      >
                        {plan.maxProducts === 0
                          ? "Unlimited products"
                          : `${plan.maxProducts} products`}{" "}
                        · {plan.interval}
                      </Text>
                    </View>
                    <Text
                      className={`text-base font-bold ${
                        isCurrent ? "text-gray-900" : "text-gray-900"
                      }`}
                    >
                      {plan.isContactSales ? "Contact" : `$${plan.priceUsd}`}
                    </Text>
                  </View>

                  {plan.description ? (
                    <Text
                      className={`text-xs mt-2 ${
                        isCurrent ? "text-gray-600" : "text-gray-500"
                      }`}
                    >
                      {plan.description}
                    </Text>
                  ) : null}

                  {(plan.features || []).slice(0, 3).map((feature) => (
                    <View key={feature} className="flex-row items-center mt-2">
                      <Feather name="check" size={14} color="#16A34A" />
                      <Text
                        className={`text-xs ml-2 ${
                          isCurrent ? "text-gray-700" : "text-gray-600"
                        }`}
                      >
                        {feature}
                      </Text>
                    </View>
                  ))}

                  <VendorButton
                    disabled={
                      isCurrent ||
                      isSubscribing ||
                      isVerifying ||
                      vendorNotApproved ||
                      disableUpgradeDueToAutoRenew
                    }
                    loading={isSubscribing || isVerifying}
                    onPress={() => {
                      if (plan.isContactSales) {
                        void Linking.openURL(
                          "mailto:sales@packtok.io?subject=Long%20Term%20Business%20Plan%20Inquiry",
                        );
                        return;
                      }
                      void onSubscribe(plan.id);
                    }}
                    label={
                      vendorNotApproved
                        ? "Approval Needed"
                        : disableUpgradeDueToAutoRenew
                          ? "Cancel Auto-Renew First"
                          : isCurrent
                            ? "Current Plan"
                            : plan.isContactSales
                              ? "Contact Sales"
                              : isSubscribing || isVerifying
                                ? "Processing..."
                                : "Choose Plan"
                    }
                    variant={
                      isCurrent
                        ? "secondary"
                        : plan.isContactSales
                          ? "success"
                          : "primary"
                    }
                    className="mt-4"
                  />
                </View>
              );
            })
          )}

          {verifiedHistory.length > 0 && (
            <View className="mt-2 mb-2">
              <Text className="text-base font-semibold text-gray-900 mb-2">
                Verified Purchases
              </Text>
              {verifiedHistory.slice(0, 4).map((item) => (
                <View
                  key={item.id}
                  className="mb-2 border border-gray-200 rounded-2xl p-3 bg-white"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-gray-900">
                      {item.planNameSnapshot}
                    </Text>
                    <View
                      className={`px-2 py-1 rounded-full ${
                        item.status === "ACTIVE"
                          ? "bg-green-100"
                          : item.status === "EXPIRED"
                            ? "bg-gray-200"
                            : item.status === "CANCELLED"
                              ? "bg-red-100"
                              : "bg-slate-100"
                      }`}
                    >
                      <Text className="text-[10px] font-semibold text-gray-700">
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs text-gray-500 mt-1">
                    {item.startDate
                      ? `Start: ${new Date(item.startDate).toLocaleDateString("en-IN")}`
                      : "Start: -"}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    {item.endDate
                      ? `End: ${new Date(item.endDate).toLocaleDateString("en-IN")}`
                      : "End: -"}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <RazorpayCheckout
        visible={checkoutProps.visible}
        razorpayKey={checkoutProps.razorpayKey}
        razorpayOrderId={checkoutProps.razorpayOrderId}
        amount={checkoutProps.amount}
        currency={checkoutProps.currency}
        orderId={checkoutProps.subscriptionId}
        userName={user?.name}
        userEmail={user?.email}
        userPhone={user?.phone_number}
        onClose={() => setCheckoutProps((s) => ({ ...s, visible: false }))}
        onFailure={(error) => {
          setCheckoutProps((s) => ({ ...s, visible: false }));
          Toast.show({
            type: "error",
            text1: "Payment Failed",
            text2: error,
            position: "top",
          });
        }}
        onSuccess={(data) => {
          setCheckoutProps((s) => ({ ...s, visible: false }));
          verifyPayment({
            subscriptionId: checkoutProps.subscriptionId,
            razorpayOrderId: data.razorpayOrderId,
            razorpayPaymentId: data.razorpayPaymentId,
            razorpaySignature: data.razorpaySignature,
          });
        }}
      />
    </View>
  );
}
