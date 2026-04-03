import {
  MarketplaceProductStatus,
  OrderStatus,
  Prisma,
  ProductCondition,
  ProductType,
  QuoteStatus,
  Role,
  StockMovementReason,
  UserSubmissionStatus,
  prisma,
} from "@packtok/db";
import { ApiError } from "../utils/apiError";
import { canVendorCreateProduct } from "./subscription.service";

type ListFilters = {
  status?: MarketplaceProductStatus;
  submissionStatus?: UserSubmissionStatus;
};

type VendorAnalyticsRange = "all" | "30d" | "90d";

const SALES_ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.PAID,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
];

const getAnalyticsRange = (range?: string): VendorAnalyticsRange => {
  if (range === "all" || range === "30d" || range === "90d") {
    return range;
  }
  return "30d";
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

const getRangeDateFilter = (range: VendorAnalyticsRange) => {
  if (range === "all") {
    return undefined;
  }
  const days = range === "30d" ? 30 : 90;
  const start = addDays(startOfDay(new Date()), -(days - 1));
  return { gte: start, lte: new Date() };
};

const ensureOwnership = async (userId: string, productId: string) => {
  const product = await prisma.marketplaceProduct.findUnique({
    where: { id: productId },
    select: {
      id: true,
      createdById: true,
      submissionStatus: true,
      status: true,
      createdByUser: { select: { role: true } },
    },
  });
  if (!product) throw new ApiError(404, "Product not found");
  if (product.createdById !== userId) {
    throw new ApiError(403, "You do not own this product");
  }
  // Ensure vendor endpoints act only on products created by vendor accounts
  if (product.createdByUser?.role !== Role.VENDOR) {
    throw new ApiError(403, "Only vendor products can be managed here");
  }
  return product;
};

export const listOwnProducts = async (userId: string, filters: ListFilters) => {
  return prisma.marketplaceProduct.findMany({
    where: {
      createdById: userId,
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.submissionStatus
        ? { submissionStatus: filters.submissionStatus }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getOwnProduct = async (userId: string, productId: string) => {
  const product = await ensureOwnership(userId, productId);
  return prisma.marketplaceProduct.findUnique({
    where: { id: product.id },
    include: {
      category: { select: { id: true, name: true } },
    },
  });
};

export const updateOwnProduct = async (
  userId: string,
  productId: string,
  data: Prisma.MarketplaceProductUpdateInput
) => {
  const product = await ensureOwnership(userId, productId);
  // Only allow direct edits for DRAFT or REJECTED; otherwise flip to draft & pending
  const isEditable =
    product.submissionStatus === UserSubmissionStatus.REJECTED ||
    product.status === MarketplaceProductStatus.DRAFT;

  const updateData: Prisma.MarketplaceProductUpdateInput = { ...data };

  // If categoryName provided, resolve to categoryId
  if ((data as unknown as { categoryName?: string }).categoryName) {
    const categoryName = (data as unknown as { categoryName?: string })
      .categoryName as string;
    const existing = await prisma.category.findFirst({
      where: { name: categoryName },
    });
    const categoryId = existing
      ? existing.id
      : (
          await prisma.category.create({
            data: { name: categoryName },
            select: { id: true },
          })
        ).id;
    // Attach relation update
    (updateData as Prisma.MarketplaceProductUpdateInput).category = {
      connect: { id: categoryId },
    } as unknown as Prisma.CategoryUpdateOneRequiredWithoutProductsNestedInput;
    // Remove any accidental categoryName leftover
    delete (updateData as unknown as { categoryName?: string }).categoryName;
  }
  if (!isEditable) {
    updateData.submissionStatus = UserSubmissionStatus.PENDING_APPROVAL;
    updateData.status = MarketplaceProductStatus.DRAFT;
  }

  return prisma.marketplaceProduct.update({
    where: { id: productId },
    data: updateData,
  });
};

export const submitOwnProductForReview = async (
  userId: string,
  productId: string
) => {
  const product = await ensureOwnership(userId, productId);
  if (
    product.submissionStatus === UserSubmissionStatus.PENDING_APPROVAL &&
    product.status === MarketplaceProductStatus.DRAFT
  ) {
    return prisma.marketplaceProduct.findUnique({ where: { id: productId } });
  }
  return prisma.marketplaceProduct.update({
    where: { id: productId },
    data: {
      submissionStatus: UserSubmissionStatus.PENDING_APPROVAL,
      status: MarketplaceProductStatus.DRAFT,
    },
  });
};

export const deleteOwnProduct = async (userId: string, productId: string) => {
  const product = await ensureOwnership(userId, productId);
  // Vendors can only delete products that are NOT approved/live
  const isApproved = product.submissionStatus === UserSubmissionStatus.APPROVED;
  if (isApproved) {
    throw new ApiError(
      403,
      "Approved products cannot be deleted by vendors. Please contact an admin to remove a live product."
    );
  }
  return prisma.marketplaceProduct.delete({ where: { id: productId } });
};

// Inventory
export const getInventory = async (userId: string, productId: string) => {
  await ensureOwnership(userId, productId);
  const inv = await prisma.productInventory.findUnique({
    where: { productId },
  });
  return inv ?? { productId, stockOnHand: 0 };
};

export const upsertInventory = async (
  userId: string,
  productId: string,
  data: {
    lowStockThreshold?: number;
    warehouseLocation?: string;
    stockOnHand?: number;
  }
) => {
  await ensureOwnership(userId, productId);
  // If stockOnHand provided, set; else keep existing
  const existing = await prisma.productInventory.findUnique({
    where: { productId },
  });
  const stockOnHand =
    typeof data.stockOnHand === "number"
      ? data.stockOnHand
      : (existing?.stockOnHand ?? 0);
  if (stockOnHand < 0)
    throw new ApiError(400, "stockOnHand cannot be negative");

  // Sync product.quantity to match stockOnHand (single source of truth)
  const productUpdate: Prisma.MarketplaceProductUpdateInput = {
    quantity: stockOnHand,
  };
  // Auto-update product status based on stock level
  if (stockOnHand <= 0) {
    productUpdate.status = MarketplaceProductStatus.OUT_OF_STOCK;
  }

  const [inventory] = await prisma.$transaction([
    prisma.productInventory.upsert({
      where: { productId },
      create: {
        productId,
        stockOnHand,
        lowStockThreshold: data.lowStockThreshold,
        warehouseLocation: data.warehouseLocation,
      },
      update: {
        stockOnHand,
        lowStockThreshold: data.lowStockThreshold,
        warehouseLocation: data.warehouseLocation,
      },
    }),
    prisma.marketplaceProduct.update({
      where: { id: productId },
      data: productUpdate,
    }),
  ]);
  return inventory;
};

export const adjustInventory = async (
  userId: string,
  productId: string,
  delta: number,
  reason: StockMovementReason,
  meta?: unknown
) => {
  await ensureOwnership(userId, productId);
  if (!Number.isInteger(delta))
    throw new ApiError(400, "delta must be integer");
  return prisma.$transaction(async (tx) => {
    const inv = await tx.productInventory.upsert({
      where: { productId },
      create: { productId, stockOnHand: 0 },
      update: {},
    });
    const newStock = inv.stockOnHand + delta;
    if (newStock < 0) throw new ApiError(400, "Insufficient stock");
    const updated = await tx.productInventory.update({
      where: { productId },
      data: { stockOnHand: newStock },
    });

    // Sync product.quantity to match
    const updatedProduct = await tx.marketplaceProduct.update({
      where: { id: productId },
      data: { quantity: { increment: delta } },
    });

    // Auto-update product status based on stock level
    if (updatedProduct.quantity <= 0) {
      await tx.marketplaceProduct.update({
        where: { id: productId },
        data: { status: MarketplaceProductStatus.OUT_OF_STOCK },
      });
    } else if (
      updatedProduct.status === MarketplaceProductStatus.OUT_OF_STOCK
    ) {
      await tx.marketplaceProduct.update({
        where: { id: productId },
        data: { status: MarketplaceProductStatus.AVAILABLE },
      });
    }

    await tx.stockMovement.create({
      data: {
        productId,
        delta,
        reason,
        meta: meta as Prisma.InputJsonValue,
        createdById: userId,
      },
    });
    return updated;
  });
};

// Media services
export const uploadMediaForOwnProduct = async (
  userId: string,
  productId: string,
  media: {
    images?: string[];
    videoUrl?: string;
    pdfUrl?: string;
    imagesThumbnail?: string;
    videoThumbnail?: string;
  }
) => {
  await ensureOwnership(userId, productId);
  // Append new images to existing up to max 5
  const product = await prisma.marketplaceProduct.findUnique({
    where: { id: productId },
    select: { images: true },
  });
  const nextImages = [
    ...(product?.images ?? []),
    ...(media.images ?? []),
  ].slice(0, 5);
  return prisma.marketplaceProduct.update({
    where: { id: productId },
    data: {
      images: nextImages,
      ...(media.videoUrl ? { videoUrl: media.videoUrl } : {}),
      ...(media.pdfUrl ? { pdfUrl: media.pdfUrl } : {}),
      ...(media.imagesThumbnail
        ? { imagesThumbnail: media.imagesThumbnail }
        : {}),
      ...(media.videoThumbnail ? { videoThumbnail: media.videoThumbnail } : {}),
    },
  });
};

export const removeGalleryImageForOwnProduct = async (
  userId: string,
  productId: string,
  url: string
) => {
  await ensureOwnership(userId, productId);
  const product = await prisma.marketplaceProduct.findUnique({
    where: { id: productId },
    select: { images: true },
  });
  if (!product) throw new ApiError(404, "Product not found");
  const filtered = (product.images ?? []).filter((u) => u !== url);
  return prisma.marketplaceProduct.update({
    where: { id: productId },
    data: { images: filtered },
  });
};

export const createVendorDraft = async (
  userId: string,
  data: {
    title: string;
    description: string;
    price: number;
    productType: string;
    condition: string;
    categoryId?: string;
    categoryName?: string;
    currency?: string;
    subCategory?: string;
    manufacturer?: string;
    model?: string;
    year?: number;
    quantity?: number;
    machineType?: string;
  }
) => {
  // ── Enforce vendor approval ──
  const vendorApp = await prisma.vendorApplication.findUnique({
    where: { userId },
  });
  if (vendorApp?.status !== "APPROVED") {
    throw new ApiError(
      403,
      "Your vendor account is not yet approved. Please wait for admin approval before adding products."
    );
  }

  // ── Enforce subscription product limit ──
  const { allowed, currentCount, limit } = await canVendorCreateProduct(userId);
  if (!allowed) {
    throw new ApiError(
      403,
      `Product limit reached (${currentCount}/${limit}). Please upgrade your subscription plan to add more products.`
    );
  }

  // Resolve category by name or id
  let categoryId = data.categoryId;
  if (!categoryId && data.categoryName) {
    const existing = await prisma.category.findFirst({
      where: { name: data.categoryName },
    });
    if (existing) categoryId = existing.id;
    else {
      const created = await prisma.category.create({
        data: { name: data.categoryName },
      });
      categoryId = created.id;
    }
  }
  if (!categoryId) throw new ApiError(400, "Category is required");

  const product = await prisma.marketplaceProduct.create({
    data: {
      title: data.title,
      description: data.description,
      price: new Prisma.Decimal(data.price),
      productType: data.productType as ProductType,
      condition: data.condition as ProductCondition,
      categoryId,
      createdById: userId,
      images: [],
      specifications: {},
      status: MarketplaceProductStatus.DRAFT,
      submissionStatus: UserSubmissionStatus.PENDING_APPROVAL,
      ...(data.currency ? { currency: data.currency } : {}),
      ...(data.subCategory ? { subCategory: data.subCategory } : {}),
      ...(data.manufacturer ? { manufacturer: data.manufacturer } : {}),
      ...(data.model ? { model: data.model } : {}),
      ...(data.year ? { year: data.year } : {}),
      ...(data.quantity ? { quantity: data.quantity } : {}),
      ...(data.machineType
        ? { machineType: data.machineType as import("@packtok/db").MachineType }
        : {}),
    },
    select: { id: true },
  });
  return product;
};

export const getVendorProductAnalytics = async (
  userId: string,
  rangeInput?: string
) => {
  const range = getAnalyticsRange(rangeInput);
  const dateFilter = getRangeDateFilter(range);

  const [
    totalProducts,
    statusCounts,
    submissionCounts,
    totalViews,
    topViewedRows,
    cartRevenueByCurrencyRows,
    cartOrdersCount,
    cartUnitsAgg,
    quoteCompletedRows,
  ] = await Promise.all([
    prisma.marketplaceProduct.count({ where: { createdById: userId } }),
    prisma.marketplaceProduct.groupBy({
      by: ["status"],
      where: { createdById: userId },
      _count: { _all: true },
    }),
    prisma.marketplaceProduct.groupBy({
      by: ["submissionStatus"],
      where: { createdById: userId },
      _count: { _all: true },
    }),
    prisma.productView.count({
      where: {
        product: { createdById: userId },
        ...(dateFilter ? { viewedAt: dateFilter } : {}),
      },
    }),
    prisma.productView.groupBy({
      by: ["productId"],
      where: {
        product: { createdById: userId },
        ...(dateFilter ? { viewedAt: dateFilter } : {}),
      },
      _count: { _all: true },
      orderBy: { _count: { productId: "desc" } },
      take: 5,
    }),
    prisma.orderItem.groupBy({
      by: ["currency"],
      where: {
        product: { createdById: userId },
        order: {
          status: { in: SALES_ORDER_STATUSES },
          ...(dateFilter ? { createdAt: dateFilter } : {}),
        },
      },
      _sum: { totalPrice: true },
    }),
    prisma.order.count({
      where: {
        status: { in: SALES_ORDER_STATUSES },
        ...(dateFilter ? { createdAt: dateFilter } : {}),
        items: { some: { product: { createdById: userId } } },
      },
    }),
    prisma.orderItem.aggregate({
      where: {
        product: { createdById: userId },
        order: {
          status: { in: SALES_ORDER_STATUSES },
          ...(dateFilter ? { createdAt: dateFilter } : {}),
        },
      },
      _sum: { quantity: true },
    }),
    prisma.quoteRequest.findMany({
      where: {
        status: QuoteStatus.COMPLETED,
        product: { createdById: userId },
        ...(dateFilter ? { updatedAt: dateFilter } : {}),
      },
      select: {
        id: true,
        productId: true,
        product: {
          select: {
            id: true,
            title: true,
            currency: true,
            price: true,
            imagesThumbnail: true,
          },
        },
      },
    }),
  ]);

  const cartRevenueByCurrency = cartRevenueByCurrencyRows.map((row) => ({
    currency: row.currency,
    amount: Number(row._sum.totalPrice ?? 0),
  }));

  const quoteRevenueMap = new Map<string, number>();
  for (const row of quoteCompletedRows) {
    const currency = row.product.currency;
    const amount = Number(row.product.price ?? 0);
    quoteRevenueMap.set(
      currency,
      (quoteRevenueMap.get(currency) ?? 0) + amount
    );
  }
  const quoteRevenueByCurrency = Array.from(quoteRevenueMap.entries()).map(
    ([currency, amount]) => ({ currency, amount })
  );

  const combinedRevenueMap = new Map<string, number>();
  for (const row of cartRevenueByCurrency) {
    combinedRevenueMap.set(
      row.currency,
      (combinedRevenueMap.get(row.currency) ?? 0) + row.amount
    );
  }
  for (const row of quoteRevenueByCurrency) {
    combinedRevenueMap.set(
      row.currency,
      (combinedRevenueMap.get(row.currency) ?? 0) + row.amount
    );
  }
  const totalRevenueByCurrency = Array.from(combinedRevenueMap.entries())
    .map(([currency, amount]) => ({ currency, amount }))
    .sort((a, b) => b.amount - a.amount);

  const topViewedProductIds = topViewedRows.map((row) => row.productId);
  const topViewedProducts = topViewedProductIds.length
    ? await prisma.marketplaceProduct.findMany({
        where: { id: { in: topViewedProductIds } },
        select: {
          id: true,
          title: true,
          currency: true,
          price: true,
          imagesThumbnail: true,
        },
      })
    : [];

  const topViewedMap = new Map(topViewedProducts.map((p) => [p.id, p]));
  const topViewed = topViewedRows.map((row) => {
    const product = topViewedMap.get(row.productId);
    return {
      productId: row.productId,
      title: product?.title ?? "Product",
      image: product?.imagesThumbnail ?? null,
      currency: product?.currency ?? "INR",
      price: Number(product?.price ?? 0),
      views: row._count._all,
    };
  });

  const orderSalesRows = await prisma.orderItem.groupBy({
    by: ["productId", "currency"],
    where: {
      product: { createdById: userId },
      order: {
        status: { in: SALES_ORDER_STATUSES },
        ...(dateFilter ? { createdAt: dateFilter } : {}),
      },
    },
    _sum: { quantity: true, totalPrice: true },
  });

  const quoteSalesByProduct = new Map<
    string,
    { count: number; revenue: number; currency: string }
  >();
  for (const row of quoteCompletedRows) {
    const existing = quoteSalesByProduct.get(row.productId) ?? {
      count: 0,
      revenue: 0,
      currency: row.product.currency,
    };
    quoteSalesByProduct.set(row.productId, {
      count: existing.count + 1,
      revenue: existing.revenue + Number(row.product.price ?? 0),
      currency: existing.currency,
    });
  }

  const salesByProduct = new Map<
    string,
    {
      unitsSold: number;
      cartUnitsSold: number;
      quoteUnitsSold: number;
      revenue: number;
      currency: string;
    }
  >();

  for (const row of orderSalesRows) {
    const current = salesByProduct.get(row.productId) ?? {
      unitsSold: 0,
      cartUnitsSold: 0,
      quoteUnitsSold: 0,
      revenue: 0,
      currency: row.currency,
    };
    const units = Number(row._sum.quantity ?? 0);
    const revenue = Number(row._sum.totalPrice ?? 0);
    salesByProduct.set(row.productId, {
      unitsSold: current.unitsSold + units,
      cartUnitsSold: current.cartUnitsSold + units,
      quoteUnitsSold: current.quoteUnitsSold,
      revenue: current.revenue + revenue,
      currency: current.currency,
    });
  }

  for (const [productId, quoteData] of quoteSalesByProduct.entries()) {
    const current = salesByProduct.get(productId) ?? {
      unitsSold: 0,
      cartUnitsSold: 0,
      quoteUnitsSold: 0,
      revenue: 0,
      currency: quoteData.currency,
    };
    salesByProduct.set(productId, {
      unitsSold: current.unitsSold + quoteData.count,
      cartUnitsSold: current.cartUnitsSold,
      quoteUnitsSold: current.quoteUnitsSold + quoteData.count,
      revenue: current.revenue + quoteData.revenue,
      currency: current.currency,
    });
  }

  const topSellingIds = Array.from(salesByProduct.entries())
    .sort((a, b) => b[1].unitsSold - a[1].unitsSold)
    .slice(0, 5)
    .map(([productId]) => productId);

  const topSellingProducts = topSellingIds.length
    ? await prisma.marketplaceProduct.findMany({
        where: { id: { in: topSellingIds } },
        select: {
          id: true,
          title: true,
          imagesThumbnail: true,
        },
      })
    : [];
  const topSellingProductMap = new Map(
    topSellingProducts.map((p) => [p.id, p])
  );
  const topSelling = topSellingIds.map((id) => {
    const metrics = salesByProduct.get(id)!;
    const product = topSellingProductMap.get(id);
    return {
      productId: id,
      title: product?.title ?? "Product",
      image: product?.imagesThumbnail ?? null,
      ...metrics,
    };
  });

  const statusBreakdown = statusCounts.reduce<Record<string, number>>(
    (acc, row) => {
      acc[row.status] = row._count._all;
      return acc;
    },
    {}
  );

  const submissionBreakdown = submissionCounts.reduce<Record<string, number>>(
    (acc, row) => {
      acc[String(row.submissionStatus)] = row._count._all;
      return acc;
    },
    {}
  );

  return {
    range,
    overview: {
      totalProducts,
      totalViews,
      cartOrdersCount,
      quoteCompletedCount: quoteCompletedRows.length,
      totalUnitsSold:
        Number(cartUnitsAgg._sum.quantity ?? 0) + quoteCompletedRows.length,
      cartUnitsSold: Number(cartUnitsAgg._sum.quantity ?? 0),
      quoteUnitsSold: quoteCompletedRows.length,
      totalRevenueByCurrency,
      cartRevenueByCurrency,
      quoteRevenueByCurrency,
    },
    breakdown: {
      status: {
        available: statusBreakdown[MarketplaceProductStatus.AVAILABLE] ?? 0,
        outOfStock: statusBreakdown[MarketplaceProductStatus.OUT_OF_STOCK] ?? 0,
        draft: statusBreakdown[MarketplaceProductStatus.DRAFT] ?? 0,
        sold: statusBreakdown[MarketplaceProductStatus.SOLD] ?? 0,
      },
      submission: {
        pending:
          submissionBreakdown[UserSubmissionStatus.PENDING_APPROVAL] ?? 0,
        approved: submissionBreakdown[UserSubmissionStatus.APPROVED] ?? 0,
        rejected: submissionBreakdown[UserSubmissionStatus.REJECTED] ?? 0,
      },
    },
    topViewed,
    topSelling,
  };
};
