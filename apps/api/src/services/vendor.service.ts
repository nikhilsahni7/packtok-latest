import {
  OrderStatus,
  prisma,
  Role,
  VendorApplicationStatus,
  VendorSubscriptionStatus,
} from "@packtok/db";
import { ApiError } from "../utils/apiError";

const SALES_ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.PAID,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
];

export type VendorDashboardRange = "all" | "30d" | "90d";

type TrendPoint = {
  label: string;
  revenue: number;
  currency: string | null;
  orders: number;
  views: number;
};

type CurrencyTotal = {
  currency: string;
  amount: number;
};

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const getRangeKey = (range?: string): VendorDashboardRange => {
  if (range === "all" || range === "30d" || range === "90d") {
    return range;
  }
  return "30d";
};

const buildTrendBuckets = (range: VendorDashboardRange) => {
  const now = new Date();

  if (range === "all") {
    const buckets: Array<{ label: string; start: Date; end: Date }> = [];
    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      buckets.push({
        label: start.toLocaleString("en-US", { month: "short" }),
        start,
        end,
      });
    }

    return {
      buckets,
      rangeStart: null as Date | null,
      rangeEnd: now,
      comparisonLabel: "all time",
    };
  }

  const days = range === "30d" ? 30 : 90;
  const bucketSize = range === "30d" ? 5 : 10;
  const rangeStart = addDays(startOfDay(now), -(days - 1));
  const rangeEnd = now;

  const buckets: Array<{ label: string; start: Date; end: Date }> = [];
  for (let offset = 0; offset < days; offset += bucketSize) {
    const start = addDays(rangeStart, offset);
    const end = addDays(rangeStart, Math.min(days, offset + bucketSize));
    buckets.push({
      label: start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      start,
      end,
    });
  }

  return {
    buckets,
    rangeStart,
    rangeEnd,
    comparisonLabel: range === "30d" ? "last 30 days" : "last 90 days",
  };
};

const calculateChangePercent = (current: number, previous: number) => {
  if (previous === 0) return current === 0 ? 0 : null;
  return Number((((current - previous) / previous) * 100).toFixed(2));
};

export const applyForVendor = async (
  userId: string,
  companyName?: string,
  notes?: string
) => {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) throw new ApiError(404, "User not found");

  const existingApp = await prisma.vendorApplication.findUnique({
    where: { userId },
  });
  if (existingApp) {
    // idempotent: if already approved, reject reapply; if pending, return; if rejected, allow reapply by updating to pending
    if (existingApp.status === VendorApplicationStatus.APPROVED) {
      throw new ApiError(400, "You are already approved as a vendor");
    }
    // update the application back to PENDING with new details
    return prisma.vendorApplication.update({
      where: { userId },
      data: { status: VendorApplicationStatus.PENDING, companyName, notes },
    });
  }

  return prisma.vendorApplication.create({
    data: { userId, companyName, notes },
  });
};

export const listVendorApplications = async () => {
  return prisma.vendorApplication.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone_number: true,
          country: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const approveVendorApplication = async (applicationId: string) => {
  const app = await prisma.vendorApplication.findUnique({
    where: { id: applicationId },
  });
  if (!app) throw new ApiError(404, "Application not found");

  // Look up the free plan to auto-assign
  const freePlan = await prisma.vendorPlan.findFirst({
    where: { slug: "free", isActive: true },
  });

  await prisma.$transaction(async (tx) => {
    await tx.vendorApplication.update({
      where: { id: applicationId },
      data: { status: VendorApplicationStatus.APPROVED },
    });
    await tx.user.update({
      where: { id: app.userId },
      data: { role: Role.VENDOR },
    });

    // Auto-assign free plan if one exists and vendor has no subscription
    if (freePlan) {
      const existingSub = await tx.vendorSubscription.findFirst({
        where: {
          userId: app.userId,
          status: VendorSubscriptionStatus.ACTIVE,
        },
      });
      if (!existingSub) {
        await tx.vendorSubscription.create({
          data: {
            userId: app.userId,
            planId: freePlan.id,
            status: VendorSubscriptionStatus.ACTIVE,
            startDate: new Date(),
            endDate: null, // Free plan doesn't expire
            planNameSnapshot: freePlan.name,
            maxProductsSnapshot: freePlan.maxProducts,
            priceUsdSnapshot: freePlan.priceUsd,
          },
        });
      }
    }
  });

  return prisma.vendorApplication.findUnique({ where: { id: applicationId } });
};

export const rejectVendorApplication = async (
  applicationId: string,
  reason?: string
) => {
  const app = await prisma.vendorApplication.findUnique({
    where: { id: applicationId },
  });
  if (!app) throw new ApiError(404, "Application not found");

  return prisma.vendorApplication.update({
    where: { id: applicationId },
    data: {
      status: VendorApplicationStatus.REJECTED,
      notes: reason ?? app.notes,
    },
  });
};

export const getVendorDashboardAnalytics = async (
  userId: string,
  rangeInput?: string
) => {
  const range = getRangeKey(rangeInput);
  const { buckets, rangeStart, rangeEnd, comparisonLabel } =
    buildTrendBuckets(range);

  const [
    revenueByCurrencyRows,
    totalOrders,
    totalViews,
    customerOrders,
    topProductRows,
  ] = await Promise.all([
    prisma.orderItem.groupBy({
      by: ["currency"],
      where: {
        product: { createdById: userId },
        order: {
          status: { in: SALES_ORDER_STATUSES },
          ...(rangeStart
            ? { createdAt: { gte: rangeStart, lte: rangeEnd } }
            : {}),
        },
      },
      _sum: { totalPrice: true },
      orderBy: { _sum: { totalPrice: "desc" } },
    }),
    prisma.order.count({
      where: {
        status: { in: SALES_ORDER_STATUSES },
        ...(rangeStart
          ? { createdAt: { gte: rangeStart, lte: rangeEnd } }
          : {}),
        items: { some: { product: { createdById: userId } } },
      },
    }),
    prisma.productView.count({
      where: {
        product: { createdById: userId },
        ...(rangeStart ? { viewedAt: { gte: rangeStart, lte: rangeEnd } } : {}),
      },
    }),
    prisma.order.findMany({
      where: {
        status: { in: SALES_ORDER_STATUSES },
        ...(rangeStart
          ? { createdAt: { gte: rangeStart, lte: rangeEnd } }
          : {}),
        items: { some: { product: { createdById: userId } } },
      },
      select: { userId: true },
    }),
    prisma.orderItem.groupBy({
      by: ["productId", "currency"],
      where: {
        product: { createdById: userId },
        order: {
          status: { in: SALES_ORDER_STATUSES },
          ...(rangeStart
            ? { createdAt: { gte: rangeStart, lte: rangeEnd } }
            : {}),
        },
      },
      _sum: { totalPrice: true, quantity: true },
      orderBy: { _sum: { totalPrice: "desc" } },
      take: 30,
    }),
  ]);

  const revenueByCurrency: CurrencyTotal[] = revenueByCurrencyRows
    .map((row) => ({
      currency: row.currency,
      amount: Number(row._sum.totalPrice ?? 0),
    }))
    .sort((a, b) => b.amount - a.amount);

  const primaryCurrency = revenueByCurrency[0]?.currency ?? null;
  const primaryRevenue = revenueByCurrency[0]?.amount ?? 0;

  const trend: TrendPoint[] = await Promise.all(
    buckets.map(async (bucket) => {
      const [revenueAgg, ordersCount, viewsCount] = await Promise.all([
        prisma.orderItem.aggregate({
          where: {
            product: { createdById: userId },
            ...(primaryCurrency ? { currency: primaryCurrency } : {}),
            order: {
              status: { in: SALES_ORDER_STATUSES },
              createdAt: { gte: bucket.start, lt: bucket.end },
            },
          },
          _sum: { totalPrice: true },
        }),
        prisma.order.count({
          where: {
            status: { in: SALES_ORDER_STATUSES },
            createdAt: { gte: bucket.start, lt: bucket.end },
            items: { some: { product: { createdById: userId } } },
          },
        }),
        prisma.productView.count({
          where: {
            product: { createdById: userId },
            viewedAt: { gte: bucket.start, lt: bucket.end },
          },
        }),
      ]);

      return {
        label: bucket.label,
        revenue: Number(revenueAgg._sum.totalPrice ?? 0),
        currency: primaryCurrency,
        orders: ordersCount,
        views: viewsCount,
      };
    })
  );

  let salesChangePercent: number | null = null;
  let ordersChangePercent: number | null = null;

  if (rangeStart) {
    const windowMs = rangeEnd.getTime() - rangeStart.getTime();
    const previousStart = new Date(rangeStart.getTime() - windowMs);
    const previousEnd = rangeStart;

    const [prevRevenueAgg, prevOrdersCount] = await Promise.all([
      prisma.orderItem.aggregate({
        where: {
          product: { createdById: userId },
          ...(primaryCurrency ? { currency: primaryCurrency } : {}),
          order: {
            status: { in: SALES_ORDER_STATUSES },
            createdAt: { gte: previousStart, lt: previousEnd },
          },
        },
        _sum: { totalPrice: true },
      }),
      prisma.order.count({
        where: {
          status: { in: SALES_ORDER_STATUSES },
          createdAt: { gte: previousStart, lt: previousEnd },
          items: { some: { product: { createdById: userId } } },
        },
      }),
    ]);

    const totalRevenue = primaryRevenue;
    const previousRevenue = Number(prevRevenueAgg._sum.totalPrice ?? 0);
    salesChangePercent = calculateChangePercent(totalRevenue, previousRevenue);
    ordersChangePercent = calculateChangePercent(totalOrders, prevOrdersCount);
  }

  const customerCounts = customerOrders.reduce<Record<string, number>>(
    (acc, row) => {
      acc[row.userId] = (acc[row.userId] ?? 0) + 1;
      return acc;
    },
    {}
  );
  const customerOrderCounts = Object.values(customerCounts);
  const totalCustomers = customerOrderCounts.length;
  const newCustomers = customerOrderCounts.filter(
    (count) => count === 1
  ).length;
  const returningCustomers = customerOrderCounts.filter(
    (count) => count > 1
  ).length;

  const topProductMap = new Map<
    string,
    { currency: string; totalPrice: number; quantity: number }
  >();

  for (const row of topProductRows) {
    if (!topProductMap.has(row.productId)) {
      topProductMap.set(row.productId, {
        currency: row.currency,
        totalPrice: Number(row._sum.totalPrice ?? 0),
        quantity: Number(row._sum.quantity ?? 0),
      });
    }
    if (topProductMap.size >= 5) {
      break;
    }
  }

  const productIds = Array.from(topProductMap.keys());
  const products = productIds.length
    ? await prisma.marketplaceProduct.findMany({
        where: { id: { in: productIds } },
        select: { id: true, title: true, imagesThumbnail: true },
      })
    : [];

  const productMap = new Map(products.map((p) => [p.id, p]));
  const popularProducts = productIds
    .map((productId) => {
      const metrics = topProductMap.get(productId);
      if (!metrics) {
        return null;
      }

      const product = productMap.get(productId);
      return {
        productId,
        title: product?.title ?? "Product",
        image: product?.imagesThumbnail ?? null,
        revenue: metrics.totalPrice,
        currency: metrics.currency,
        unitsSold: metrics.quantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return {
    range,
    overview: {
      totalRevenue: primaryRevenue,
      primaryCurrency,
      revenueByCurrency,
      totalOrders,
      totalViews,
      salesChangePercent,
      ordersChangePercent,
      comparisonLabel,
    },
    trend,
    customerDistribution: {
      totalCustomers,
      newCustomers,
      returningCustomers,
      newCustomerPercent:
        totalCustomers > 0
          ? Number(((newCustomers / totalCustomers) * 100).toFixed(2))
          : 0,
    },
    popularProducts,
  };
};
