"use client";

import {
  useCancelSubscription,
  useMySubscription,
  usePlans,
  useSubscribe,
  useVerifySubscriptionPayment,
  type SubscribeResult,
  type VendorPlan,
} from "@/hooks";
import { loadRazorpayCheckout } from "@/lib/razorpay";
import { useAuthStore } from "@/store/auth-store";
import { Button, Card } from "@packtok/ui";
import {
  AlertCircle,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Crown,
  Loader2,
  Package,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useCallback, useState } from "react";

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatPrice = (price: string | number) => {
  const n = Number(price);
  if (n === 0) return "Free";
  return `$${n.toLocaleString("en-US")}`;
};

const formatDate = (iso: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const planIcons: Record<string, React.ReactNode> = {
  free: <Package className="h-6 w-6" />,
  basic: <Zap className="h-6 w-6" />,
  premium: <Star className="h-6 w-6" />,
  "super-premium": <Crown className="h-6 w-6" />,
  "long-term-business": <Sparkles className="h-6 w-6" />,
};

const planColors: Record<string, string> = {
  free: "border-gray-200 bg-white",
  basic: "border-blue-200 bg-blue-50/30",
  premium: "border-orange-200 bg-orange-50/30",
  "super-premium": "border-purple-200 bg-purple-50/30",
  "long-term-business": "border-emerald-200 bg-emerald-50/30",
};

const planButtonColors: Record<string, string> = {
  free: "bg-gray-900 hover:bg-gray-800 text-white",
  basic: "bg-blue-600 hover:bg-blue-700 text-white",
  premium: "bg-orange-600 hover:bg-orange-700 text-white",
  "super-premium": "bg-purple-600 hover:bg-purple-700 text-white",
  "long-term-business": "bg-emerald-600 hover:bg-emerald-700 text-white",
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function VendorSubscriptionPage() {
  const user = useAuthStore((s) => s.user);
  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: subInfo, isLoading: subLoading } = useMySubscription();
  const subscribeMutation = useSubscribe();
  const verifyMutation = useVerifySubscriptionPayment();
  const cancelMutation = useCancelSubscription();

  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const currentPlanSlug = subInfo?.subscription?.plan?.slug ?? null;
  const isActive = subInfo?.subscription?.status === "ACTIVE";

  // ── Handle Razorpay Checkout ─────────────────────────────────────────────
  const openRazorpayCheckout = useCallback(
    async (result: Extract<SubscribeResult, { type: "payment" }>) => {
      await loadRazorpayCheckout();

      return new Promise<void>((resolve, reject) => {
        const options = {
          key: result.razorpayKey,
          amount: result.amount,
          currency: result.currency,
          name: "Packtok",
          description: `${result.planName} Plan – Yearly Subscription`,
          order_id: result.razorpayOrderId,
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
          },
          theme: { color: "#F97316" },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            try {
              await verifyMutation.mutateAsync({
                subscriptionId: result.subscriptionId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              setSuccess(
                `Successfully subscribed to ${result.planName}! Your subscription is now active.`
              );
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => {
              setError("Payment was cancelled. Please try again.");
              resolve();
            },
          },
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rzp = new (window as any).Razorpay(options);
        rzp.on(
          "payment.failed",
          (resp: { error: { description: string } }) => {
            setError(resp.error.description || "Payment failed");
            resolve();
          }
        );
        rzp.open();
      });
    },
    [user, verifyMutation]
  );

  // ── Subscribe Handler ────────────────────────────────────────────────────
  const handleSubscribe = async (plan: VendorPlan) => {
    setError(null);
    setSuccess(null);
    setProcessingPlanId(plan.id);

    try {
      if (plan.isContactSales) {
        window.open(
          `mailto:sales@packtok.io?subject=Long%20Term%20Business%20Plan%20Inquiry&body=Hi%2C%20I%20am%20interested%20in%20the%20Long%20Term%20Business%20plan.`,
          "_blank"
        );
        return;
      }

      const result = await subscribeMutation.mutateAsync(plan.id);

      if (result.type === "free") {
        setSuccess("Free plan activated successfully!");
      } else {
        await openRazorpayCheckout(result);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      // Parse API error from response if available
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiMsg = (err as any)?.response?.data?.message;
      setError(apiMsg || message);
    } finally {
      setProcessingPlanId(null);
    }
  };

  // ── Cancel Handler ───────────────────────────────────────────────────────
  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel auto-renewal? Your subscription will remain active until the end date.")) return;
    setError(null);
    setSuccess(null);
    try {
      await cancelMutation.mutateAsync();
      setSuccess("Auto-renewal has been cancelled.");
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiMsg = (err as any)?.response?.data?.message;
      setError(apiMsg || "Failed to cancel subscription");
    }
  };

  if (plansLoading || subLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Subscription Plans
        </h1>
        <p className="text-gray-500 mt-1">
          Choose a plan that fits your business needs
        </p>
      </div>

      {/* Status alerts */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <div className="text-sm">{error}</div>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
          <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
          <div className="text-sm">{success}</div>
        </div>
      )}

      {/* Current subscription card */}
      {subInfo?.subscription && isActive && (
        <Card className="p-6 border-orange-200 bg-orange-50/40">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Current Plan:{" "}
                  <span className="text-orange-600">
                    {subInfo.subscription.planNameSnapshot}
                  </span>
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Package className="h-4 w-4" />
                  Products: {subInfo.productCount} /{" "}
                  {subInfo.subscription.maxProductsSnapshot}
                </span>
                {subInfo.subscription.startDate && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" />
                    Started: {formatDate(subInfo.subscription.startDate)}
                  </span>
                )}
                {subInfo.subscription.endDate && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" />
                    Expires: {formatDate(subInfo.subscription.endDate)}
                  </span>
                )}
              </div>
            </div>
            {subInfo.subscription.plan.slug !== "free" && (
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
                className="shrink-0"
              >
                {cancelMutation.isPending ? "Cancelling..." : "Cancel Renewal"}
              </Button>
            )}
          </div>
          {/* Usage bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Product Usage</span>
              <span>
                {subInfo.productCount} / {subInfo.subscription.maxProductsSnapshot}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    (subInfo.productCount / subInfo.subscription.maxProductsSnapshot) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
        {(plans ?? []).map((plan) => {
          const isCurrent = currentPlanSlug === plan.slug && isActive;
          const isProcessing = processingPlanId === plan.id;
          const isUpgrade =
            isActive &&
            currentPlanSlug &&
            plan.sortOrder >
              (plans?.find((p) => p.slug === currentPlanSlug)?.sortOrder ?? -1);
          const isDowngrade =
            isActive &&
            currentPlanSlug &&
            plan.sortOrder <
              (plans?.find((p) => p.slug === currentPlanSlug)?.sortOrder ?? 999);
          const priceNum = Number(plan.priceUsd);

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col p-5 transition-all duration-200 hover:shadow-lg ${
                planColors[plan.slug] ?? "border-gray-200 bg-white"
              } ${isCurrent ? "ring-2 ring-orange-500 shadow-md" : ""}`}
            >
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Current Plan
                </div>
              )}

              {/* Plan header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-2 rounded-lg ${
                    isCurrent
                      ? "bg-orange-100 text-orange-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {planIcons[plan.slug] ?? <Package className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                  <p className="text-xs text-gray-500">
                    {plan.maxProducts >= 9999
                      ? "Unlimited"
                      : `${plan.maxProducts} products`}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                {plan.isContactSales ? (
                  <div className="text-lg font-bold text-gray-900">
                    Contact Sales
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(plan.priceUsd)}
                    </span>
                    {priceNum > 0 && (
                      <span className="text-sm text-gray-500">/year</span>
                    )}
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-6 flex-1">
                {(plan.features as string[]).map((feat, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <div className="mt-auto">
                {isCurrent ? (
                  <Button disabled className="w-full opacity-60">
                    Current Plan
                  </Button>
                ) : isDowngrade ? (
                  <Button disabled variant="secondary" className="w-full opacity-50">
                    Downgrade N/A
                  </Button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={
                      isProcessing ||
                      subscribeMutation.isPending ||
                      verifyMutation.isPending
                    }
                    className={`w-full py-2.5 px-4 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      planButtonColors[plan.slug] ??
                      "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing…
                      </span>
                    ) : plan.isContactSales ? (
                      "Contact Sales"
                    ) : isUpgrade ? (
                      `Upgrade – ${formatPrice(plan.priceUsd)}/yr`
                    ) : priceNum === 0 ? (
                      "Get Started Free"
                    ) : (
                      `Subscribe – ${formatPrice(plan.priceUsd)}/yr`
                    )}
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Info section */}
      <div className="text-center text-sm text-gray-500 space-y-1 pt-4">
        <p>All paid plans are billed annually in USD via Razorpay.</p>
        <p>
          Your subscription renews automatically. You can cancel anytime —
          access continues until the billing period ends.
        </p>
      </div>
    </div>
  );
}
