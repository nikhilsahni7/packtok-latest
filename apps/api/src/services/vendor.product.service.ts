import {
  MarketplaceProductStatus,
  Prisma,
  ProductCondition,
  ProductType,
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
  const isApproved =
    product.submissionStatus === UserSubmissionStatus.APPROVED;
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
  return prisma.productInventory.upsert({
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
  });
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
      ...(data.machineType ? { machineType: data.machineType as import("@packtok/db").MachineType } : {}),
    },
    select: { id: true },
  });
  return product;
};
