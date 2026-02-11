import {
  PaymentIntentStatus,
  Prisma,
  VendorSubscriptionStatus,
  prisma,
} from "@packtok/db";
import { ApiError } from "../utils/apiError";
import {
  createOrder as createRazorpayOrder,
  verifyPaymentSignature,
  getRazorpayPublishableKey,
} from "./payments/razorpay.service";

// ─── Plan CRUD (Admin) ──────────────────────────────────────────────────────

export const listAllPlans = async (includeInactive = false) => {
  return prisma.vendorPlan.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
};

export const getPlanById = async (id: string) => {
  const plan = await prisma.vendorPlan.findUnique({ where: { id } });
  if (!plan) throw new ApiError(404, "Plan not found");
  return plan;
};

export const createPlan = async (
  data: Prisma.VendorPlanCreateInput
) => {
  return prisma.vendorPlan.create({ data });
};

export const updatePlan = async (
  id: string,
  data: Prisma.VendorPlanUpdateInput
) => {
  const plan = await prisma.vendorPlan.findUnique({ where: { id } });
  if (!plan) throw new ApiError(404, "Plan not found");
  return prisma.vendorPlan.update({ where: { id }, data });
};

export const deletePlan = async (id: string) => {
  const plan = await prisma.vendorPlan.findUnique({
    where: { id },
    include: { _count: { select: { subscriptions: true } } },
  });
  if (!plan) throw new ApiError(404, "Plan not found");
  if (plan._count.subscriptions > 0) {
    throw new ApiError(
      400,
      "Cannot delete plan with active subscriptions. Deactivate it instead."
    );
  }
  return prisma.vendorPlan.delete({ where: { id } });
};

// ─── Seed default plans (idempotent) ────────────────────────────────────────

const DEFAULT_PLANS = [
  {
    name: "Free",
    slug: "free",
    description: "Get started with up to 2 product listings",
    maxProducts: 2,
    priceUsd: 0,
    isContactSales: false,
    sortOrder: 0,
    features: ["2 Product Listings", "Basic Dashboard", "Standard Support"],
  },
  {
    name: "Basic",
    slug: "basic",
    description: "Grow your business with up to 12 product listings",
    maxProducts: 12,
    priceUsd: 750,
    isContactSales: false,
    sortOrder: 1,
    features: [
      "12 Product Listings",
      "Advanced Dashboard",
      "Priority Support",
      "Analytics",
    ],
  },
  {
    name: "Premium",
    slug: "premium",
    description: "Scale up with 25 product listings and premium features",
    maxProducts: 25,
    priceUsd: 1250,
    isContactSales: false,
    sortOrder: 2,
    features: [
      "25 Product Listings",
      "Advanced Dashboard",
      "Priority Support",
      "Full Analytics",
      "Featured Placement",
    ],
  },
  {
    name: "Super Premium",
    slug: "super-premium",
    description: "Maximum visibility with 40 product listings",
    maxProducts: 40,
    priceUsd: 2000,
    isContactSales: false,
    sortOrder: 3,
    features: [
      "40 Product Listings",
      "Advanced Dashboard",
      "Dedicated Support",
      "Full Analytics",
      "Featured Placement",
      "Custom Branding",
    ],
  },
  {
    name: "Long Term Business",
    slug: "long-term-business",
    description: "Enterprise solution – contact our sales team",
    maxProducts: 9999,
    priceUsd: 0,
    isContactSales: true,
    sortOrder: 4,
    features: [
      "Unlimited Product Listings",
      "Dedicated Account Manager",
      "Custom Integrations",
      "SLA Guarantee",
      "White-glove Onboarding",
    ],
  },
];

export const seedDefaultPlans = async () => {
  for (const plan of DEFAULT_PLANS) {
    await prisma.vendorPlan.upsert({
      where: { slug: plan.slug },
      create: {
        name: plan.name,
        slug: plan.slug,
        description: plan.description,
        maxProducts: plan.maxProducts,
        priceUsd: new Prisma.Decimal(plan.priceUsd),
        isContactSales: plan.isContactSales,
        sortOrder: plan.sortOrder,
        features: plan.features,
      },
      update: {
        // Don't overwrite admin edits – only update non-price fields on re-seed
        description: plan.description,
        sortOrder: plan.sortOrder,
      },
    });
  }
};

// ─── Public plan listing ────────────────────────────────────────────────────

export const getActivePlans = async () => {
  return prisma.vendorPlan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      maxProducts: true,
      priceUsd: true,
      interval: true,
      isContactSales: true,
      sortOrder: true,
      features: true,
    },
  });
};

// ─── Vendor subscription helpers ────────────────────────────────────────────

/**
 * Returns the vendor's currently active subscription, or null.
 * A subscription is "active" if status=ACTIVE and (endDate is null OR endDate > now).
 */
export const getActiveSubscription = async (userId: string) => {
  const sub = await prisma.vendorSubscription.findFirst({
    where: {
      userId,
      status: VendorSubscriptionStatus.ACTIVE,
      OR: [{ endDate: null }, { endDate: { gt: new Date() } }],
    },
    include: {
      plan: {
        select: {
          id: true,
          name: true,
          slug: true,
          maxProducts: true,
          priceUsd: true,
          isContactSales: true,
          features: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return sub;
};

/**
 * Returns the product limit for a vendor.
 * If they have an active subscription, use that; otherwise default to 2 (free).
 */
export const getVendorProductLimit = async (userId: string): Promise<number> => {
  const sub = await getActiveSubscription(userId);
  if (sub) return sub.maxProductsSnapshot;

  // Check if user has a free plan subscription (even if there's no explicit one)
  const freePlan = await prisma.vendorPlan.findFirst({
    where: { slug: "free", isActive: true },
  });
  return freePlan?.maxProducts ?? 2;
};

/**
 * Returns the current product count for a vendor (non-deleted products).
 */
export const getVendorProductCount = async (userId: string): Promise<number> => {
  return prisma.marketplaceProduct.count({
    where: { createdById: userId },
  });
};

/**
 * Check if vendor can create more products.
 */
export const canVendorCreateProduct = async (
  userId: string
): Promise<{ allowed: boolean; currentCount: number; limit: number }> => {
  const [limit, currentCount] = await Promise.all([
    getVendorProductLimit(userId),
    getVendorProductCount(userId),
  ]);
  return { allowed: currentCount < limit, currentCount, limit };
};

// ─── Subscription purchase flow ─────────────────────────────────────────────

/**
 * Subscribe to the free plan (no payment needed).
 */
export const subscribeToFreePlan = async (userId: string) => {
  const freePlan = await prisma.vendorPlan.findFirst({
    where: { slug: "free", isActive: true },
  });
  if (!freePlan) throw new ApiError(404, "Free plan not available");

  // Check if already has an active subscription
  const existing = await getActiveSubscription(userId);
  if (existing) {
    throw new ApiError(400, "You already have an active subscription");
  }

  return prisma.vendorSubscription.create({
    data: {
      userId,
      planId: freePlan.id,
      status: VendorSubscriptionStatus.ACTIVE,
      startDate: new Date(),
      endDate: null, // Free plan doesn't expire
      planNameSnapshot: freePlan.name,
      maxProductsSnapshot: freePlan.maxProducts,
      priceUsdSnapshot: freePlan.priceUsd,
    },
    include: { plan: true },
  });
};

/**
 * Initiate a paid subscription. Creates Razorpay order and returns checkout details.
 */
export const initiateSubscription = async (userId: string, planId: string) => {
  const plan = await prisma.vendorPlan.findUnique({ where: { id: planId } });
  if (!plan) throw new ApiError(404, "Plan not found");
  if (!plan.isActive) throw new ApiError(400, "This plan is no longer available");
  if (plan.isContactSales) {
    throw new ApiError(400, "Please contact sales for this plan");
  }

  const priceUsd = Number(plan.priceUsd);
  if (priceUsd <= 0) {
    // Free plan – subscribe directly
    return { type: "free" as const, subscription: await subscribeToFreePlan(userId) };
  }

  // Check if already has an active paid subscription
  const existing = await getActiveSubscription(userId);
  if (existing && existing.plan.slug !== "free") {
    throw new ApiError(
      400,
      "You already have an active paid subscription. Wait for it to expire or cancel it first."
    );
  }

  // Create subscription record with PAYMENT_PENDING
  const subscription = await prisma.vendorSubscription.create({
    data: {
      userId,
      planId: plan.id,
      status: VendorSubscriptionStatus.PAYMENT_PENDING,
      planNameSnapshot: plan.name,
      maxProductsSnapshot: plan.maxProducts,
      priceUsdSnapshot: plan.priceUsd,
    },
  });

  // Razorpay uses paise/cents – convert USD to cents (×100)
  const amountInCents = Math.round(priceUsd * 100);

  const razorpayOrder = await createRazorpayOrder({
    amountInPaise: amountInCents,
    currency: "USD",
    receipt: `sub_${subscription.id}`,
    notes: {
      subscriptionId: subscription.id,
      planId: plan.id,
      planName: plan.name,
      userId,
    },
  });

  // Create payment record
  await prisma.subscriptionPayment.create({
    data: {
      subscriptionId: subscription.id,
      amount: plan.priceUsd,
      currency: "USD",
      status: PaymentIntentStatus.CREATED,
      razorpayOrderId: razorpayOrder.id,
    },
  });

  const razorpayKey = getRazorpayPublishableKey();

  return {
    type: "payment" as const,
    subscriptionId: subscription.id,
    razorpayOrderId: razorpayOrder.id,
    razorpayKey,
    amount: amountInCents,
    currency: "USD",
    planName: plan.name,
  };
};

/**
 * Verify Razorpay payment and activate subscription.
 */
export const verifySubscriptionPayment = async (
  userId: string,
  data: {
    subscriptionId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }
) => {
  // Validate signature
  const isValid = verifyPaymentSignature(
    data.razorpayOrderId,
    data.razorpayPaymentId,
    data.razorpaySignature
  );
  if (!isValid) throw new ApiError(400, "Invalid payment signature");

  // Find the payment record
  const payment = await prisma.subscriptionPayment.findUnique({
    where: { razorpayOrderId: data.razorpayOrderId },
    include: { subscription: true },
  });
  if (!payment) throw new ApiError(404, "Payment not found");
  if (payment.subscription.userId !== userId) {
    throw new ApiError(403, "Unauthorized");
  }
  if (payment.status === PaymentIntentStatus.CAPTURED) {
    // Already processed – return existing subscription
    return prisma.vendorSubscription.findUnique({
      where: { id: payment.subscriptionId },
      include: { plan: true },
    });
  }

  const now = new Date();
  const oneYearLater = new Date(now);
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  // Transaction: update payment + activate subscription + cancel old free sub
  const result = await prisma.$transaction(async (tx) => {
    // Update payment
    await tx.subscriptionPayment.update({
      where: { id: payment.id },
      data: {
        status: PaymentIntentStatus.CAPTURED,
        razorpayPaymentId: data.razorpayPaymentId,
        razorpaySignature: data.razorpaySignature,
      },
    });

    // Cancel any existing active subscription for this user (e.g., free plan)
    await tx.vendorSubscription.updateMany({
      where: {
        userId,
        status: VendorSubscriptionStatus.ACTIVE,
        id: { not: payment.subscriptionId },
      },
      data: { status: VendorSubscriptionStatus.CANCELLED },
    });

    // Activate the new subscription
    const activated = await tx.vendorSubscription.update({
      where: { id: payment.subscriptionId },
      data: {
        status: VendorSubscriptionStatus.ACTIVE,
        startDate: now,
        endDate: oneYearLater,
      },
      include: { plan: true },
    });

    return activated;
  });

  return result;
};

/**
 * Cancel a subscription (vendor action). Only active paid subscriptions can be cancelled.
 * The subscription remains active until endDate – we just mark autoRenew=false.
 */
export const cancelSubscription = async (userId: string) => {
  const sub = await getActiveSubscription(userId);
  if (!sub) throw new ApiError(404, "No active subscription found");
  if (sub.plan.slug === "free") {
    throw new ApiError(400, "Cannot cancel the free plan");
  }

  return prisma.vendorSubscription.update({
    where: { id: sub.id },
    data: { autoRenew: false },
    include: { plan: true },
  });
};

/**
 * Get full subscription history for a vendor.
 */
export const getSubscriptionHistory = async (userId: string) => {
  return prisma.vendorSubscription.findMany({
    where: { userId },
    include: {
      plan: {
        select: { id: true, name: true, slug: true, maxProducts: true },
      },
      payments: {
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          razorpayPaymentId: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

// ─── Admin subscription management ─────────────────────────────────────────

export const getAllSubscriptions = async (status?: VendorSubscriptionStatus) => {
  return prisma.vendorSubscription.findMany({
    where: status ? { status } : {},
    include: {
      user: { select: { id: true, name: true, email: true } },
      plan: { select: { id: true, name: true, slug: true } },
      payments: {
        select: { id: true, amount: true, currency: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Expire subscriptions that have passed their endDate.
 * Can be called by a cron job or admin action.
 */
export const expireOverdueSubscriptions = async () => {
  const result = await prisma.vendorSubscription.updateMany({
    where: {
      status: VendorSubscriptionStatus.ACTIVE,
      endDate: { not: null, lt: new Date() },
    },
    data: { status: VendorSubscriptionStatus.EXPIRED },
  });
  return result.count;
};
