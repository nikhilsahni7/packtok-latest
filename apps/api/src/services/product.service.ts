/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MarketplaceProductStatus,
  Prisma,
  prisma,
  ProductType,
  Role,
  UserSubmissionStatus,
} from "@packtok/db";
import { ApiError } from "../utils/apiError";
import { notifyProductLive } from "./notification.service";

/**
 * Helper function to build Prisma where clause for public visibility rule
 */
const publicVisibilityWhere: Prisma.MarketplaceProductWhereInput = {
  status: MarketplaceProductStatus.AVAILABLE,
  OR: [
    { submissionStatus: null },
    { submissionStatus: UserSubmissionStatus.APPROVED },
  ],
};

/**
 * Removes the price field for products that are of type MACHINERY (Price Secrecy Rule)
 */
const sanitizePriceForPublic = (product: any) => {
  const copy: any = { ...product };
  if (copy.productType === ProductType.MACHINERY && !copy.cartEnabled) {
    delete copy.price;
  }
  // Parse specifications JSON string if present
  if (copy.specifications && typeof copy.specifications === "string") {
    try {
      copy.specifications = JSON.parse(copy.specifications);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // leave as-is if parsing fails
    }
  }
  return copy;
};

const ensureCategory = async (
  categoryId: string | undefined,
  categoryName: string | undefined
): Promise<string> => {
  if (categoryId) return categoryId;
  if (categoryName) {
    const existing = await prisma.category.findFirst({
      where: { name: categoryName },
    });
    if (existing) return existing.id;
    const created = await prisma.category.create({
      data: { name: categoryName },
    });
    return created.id;
  }
  throw new ApiError(400, "Category id or name is required");
};

/**
 * Parse product data from form submission.
 * Form data sends booleans as strings, so we need to convert them.
 */
const parseProductData = (data: any) => {
  const parsed = { ...data };

  // Parse boolean fields (form data sends "true"/"false" as strings)
  if (typeof parsed.cartEnabled === "string") {
    parsed.cartEnabled = parsed.cartEnabled === "true";
  }
  if (typeof parsed.displayPrice === "string") {
    parsed.displayPrice = parsed.displayPrice === "true";
  }

  return parsed;
};

export const createProductAsAdmin = async (adminId: string, data: any) => {
  const { categoryId, categoryName, category, ...rest } =
    parseProductData(data);
  const resolvedCategoryId = await ensureCategory(
    categoryId,
    categoryName ?? category
  );
  return prisma.marketplaceProduct.create({
    data: {
      ...rest,
      categoryId: resolvedCategoryId,
      createdById: adminId,
      submissionStatus: null,
    },
  });
};

export const createProductSubmission = async (userId: string, data: any) => {
  const { categoryId, categoryName, category, ...rest } =
    parseProductData(data);
  const resolvedCategoryId = await ensureCategory(
    categoryId,
    categoryName ?? category
  );
  return prisma.marketplaceProduct.create({
    data: {
      ...rest,
      categoryId: resolvedCategoryId,
      createdById: userId,
      submissionStatus: UserSubmissionStatus.PENDING_APPROVAL,
      status: MarketplaceProductStatus.DRAFT,
    },
  });
};

export const updateProduct = async (
  productId: string,
  data: Prisma.MarketplaceProductUpdateInput
) => {
  const existing = await prisma.marketplaceProduct.findUnique({
    where: { id: productId },
  });
  if (!existing) {
    throw new ApiError(404, "Product not found");
  }

  const parsedData = parseProductData(data);
  const { categoryId, categoryName, category, ...rest } = parsedData as any;
  let updatedCategoryId: string | undefined = undefined;

  const possibleCategoryName = categoryName ?? category;
  if (categoryId || possibleCategoryName) {
    updatedCategoryId = await ensureCategory(
      categoryId as any,
      possibleCategoryName as any
    );
  }

  const updateData: Prisma.MarketplaceProductUpdateInput = {
    ...rest,
    ...(updatedCategoryId ? { categoryId: updatedCategoryId } : {}),
  };

  return prisma.marketplaceProduct.update({
    where: { id: productId },
    data: updateData,
  });
};

export const changeProductStatus = async (
  productId: string,
  newStatus: MarketplaceProductStatus
) => {
  const existing = await prisma.marketplaceProduct.findUnique({
    where: { id: productId },
    select: {
      id: true,
      title: true,
      productType: true,
      status: true,
      category: { select: { name: true } },
      submissionStatus: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Product not found");
  }

  // Guard: cannot set AVAILABLE unless the product has been approved (or is admin-created with null submissionStatus)
  if (newStatus === MarketplaceProductStatus.AVAILABLE) {
    if (
      existing.submissionStatus !== null &&
      existing.submissionStatus !== UserSubmissionStatus.APPROVED
    ) {
      throw new Error(
        "Cannot mark product as AVAILABLE — it must be approved first. Please approve the submission before changing status."
      );
    }
  }

  const updated = await prisma.marketplaceProduct.update({
    where: { id: productId },
    data: { status: newStatus },
  });

  if (
    newStatus === MarketplaceProductStatus.AVAILABLE &&
    existing.status !== MarketplaceProductStatus.AVAILABLE
  ) {
    await notifyProductLive({
      productId: existing.id,
      title: existing.title,
      productType: existing.productType,
      categoryName: existing.category?.name,
    });
  }

  return updated;
};

export const listAllProductsForAdmin = async () => {
  return prisma.marketplaceProduct.findMany({
    include: {
      createdByUser: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getPendingSubmissions = async () => {
  return prisma.marketplaceProduct.findMany({
    where: {
      submissionStatus: {
        in: [
          UserSubmissionStatus.PENDING_APPROVAL,
          UserSubmissionStatus.APPROVED,
          UserSubmissionStatus.REJECTED,
        ],
      },
    },
    include: {
      createdByUser: {
        select: {
          id: true,
          name: true,
          email: true,
          phone_number: true,
          country: true,
        },
      },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const listMyProductSubmissions = async (userId: string) => {
  return prisma.marketplaceProduct.findMany({
    where: {
      createdById: userId,
      submissionStatus: {
        in: [
          UserSubmissionStatus.PENDING_APPROVAL,
          UserSubmissionStatus.APPROVED,
          UserSubmissionStatus.REJECTED,
        ],
      },
    },
    select: {
      id: true,
      title: true,
      productType: true,
      status: true,
      submissionStatus: true,
      imagesThumbnail: true,
      price: true,
      currency: true,
      createdAt: true,
      updatedAt: true,
      reviewedAt: true,
      reviewNotes: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const approveSubmission = async (
  productId: string,
  reviewerId?: string,
  notes?: string
) => {
  const existing = await prisma.marketplaceProduct.findUnique({
    where: { id: productId },
    select: {
      submissionStatus: true,
      status: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Product not found");
  }

  const updated = await prisma.marketplaceProduct.update({
    where: { id: productId },
    data: {
      submissionStatus: UserSubmissionStatus.APPROVED,
      status: MarketplaceProductStatus.AVAILABLE,
      reviewedById: reviewerId,
      reviewedAt: new Date(),
      reviewNotes: notes,
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  const becameLive =
    existing.status !== MarketplaceProductStatus.AVAILABLE ||
    existing.submissionStatus !== UserSubmissionStatus.APPROVED;

  if (becameLive) {
    await notifyProductLive({
      productId: updated.id,
      title: updated.title,
      productType: updated.productType,
      categoryName: updated.category?.name,
    });
  }

  return updated;
};

export const rejectSubmission = async (
  productId: string,
  reviewerId?: string,
  notes?: string
) => {
  return prisma.marketplaceProduct.update({
    where: { id: productId },
    data: {
      submissionStatus: UserSubmissionStatus.REJECTED,
      status: MarketplaceProductStatus.DRAFT, // Revert to draft so it's no longer available
      reviewedById: reviewerId,
      reviewedAt: new Date(),
      reviewNotes: notes,
    },
  });
};

export type PublicProductQueryOptions = {
  categoryId?: string | string[]; // Support multiple categories
  subCategory?: string | string[]; // Support multiple subcategories
  condition?: string | string[]; // Support multiple conditions
  machineType?: string | string[]; // Support multiple machine types
  productType?: string | string[]; // Support multiple product types
  priceMin?: number; // Minimum price filter
  priceMax?: number; // Maximum price filter
  searchTerm?: string; // Text search across products
  page?: number;
  limit?: number;
};

export const getPublicProducts = async (options: PublicProductQueryOptions) => {
  const page = options.page && options.page > 0 ? options.page : 1;
  const limit = options.limit && options.limit > 0 ? options.limit : 10;
  const skip = (page - 1) * limit;

  const where: Prisma.MarketplaceProductWhereInput = {
    ...publicVisibilityWhere,
  };

  // Handle multiple category IDs
  if (options.categoryId) {
    if (Array.isArray(options.categoryId)) {
      where.categoryId = { in: options.categoryId };
    } else {
      where.categoryId = options.categoryId;
    }
  }

  // Handle multiple subcategories
  if (options.subCategory) {
    if (Array.isArray(options.subCategory)) {
      where.subCategory = { in: options.subCategory };
    } else {
      where.subCategory = options.subCategory;
    }
  }

  // Handle multiple conditions
  if (options.condition) {
    if (Array.isArray(options.condition)) {
      (where as any).condition = { in: options.condition };
    } else {
      (where as any).condition = options.condition;
    }
  }

  // Handle multiple machine types
  if (options.machineType) {
    if (Array.isArray(options.machineType)) {
      (where as any).machineType = { in: options.machineType };
    } else {
      (where as any).machineType = options.machineType;
    }
  }

  // Handle multiple product types
  if (options.productType) {
    if (Array.isArray(options.productType)) {
      (where as any).productType = { in: options.productType };
    } else {
      (where as any).productType = options.productType;
    }
  }

  // Handle price range filtering
  if (options.priceMin !== undefined || options.priceMax !== undefined) {
    where.price = {};
    if (options.priceMin !== undefined) {
      (where.price as any).gte = options.priceMin;
    }
    if (options.priceMax !== undefined) {
      (where.price as any).lte = options.priceMax;
    }
  }

  // Handle search term
  if (options.searchTerm) {
    where.OR = [
      { title: { contains: options.searchTerm, mode: "insensitive" } },
      { description: { contains: options.searchTerm, mode: "insensitive" } },
      { manufacturer: { contains: options.searchTerm, mode: "insensitive" } },
      { model: { contains: options.searchTerm, mode: "insensitive" } },
      { subCategory: { contains: options.searchTerm, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.marketplaceProduct.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        displayPrice: true,
        productType: true,
        status: true,
        submissionStatus: true,
        imagesThumbnail: true,
        categoryId: true,
        subCategory: true,
        condition: true,
        machineType: true,
        cartEnabled: true,
        currency: true,
        quantity: true,
        manufacturer: true,
        model: true,
        year: true,
        additionalInfo: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        reviews: {
          select: { rating: true },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.marketplaceProduct.count({ where }),
  ]);

  // Compute average rating from reviews and sanitize
  const sanitized = items.map((item) => {
    const { reviews, ...rest } = item;
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
    return {
      ...sanitizePriceForPublic(rest),
      averageRating,
      reviewCount: reviews.length,
    };
  });
  return { items: sanitized, total, page, limit };
};

export const getPublicProductById = async (id: string) => {
  const product = await prisma.marketplaceProduct.findFirst({
    where: { id, ...publicVisibilityWhere },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      displayPrice: true,
      productType: true,
      status: true,
      submissionStatus: true,
      images: true,
      imagesThumbnail: true,
      videoUrl: true,
      videoThumbnail: true,
      pdfUrl: true,
      specifications: true,
      categoryId: true,
      subCategory: true,
      condition: true,
      machineType: true,
      cartEnabled: true,
      currency: true,
      quantity: true,
      manufacturer: true,
      model: true,
      year: true,
      additionalInfo: true,
      faqs: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return sanitizePriceForPublic(product);
};

export const getProductByIdForAdmin = async (id: string) => {
  const product = await prisma.marketplaceProduct.findUnique({
    where: { id },
    include: {
      category: true,
      createdByUser: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

export const deleteProduct = async (
  productId: string,
  requesterId: string,
  requesterRole: Role
) => {
  const product = await prisma.marketplaceProduct.findUnique({
    where: { id: productId },
  });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  // Only SUPER_ADMIN can delete any product. Other admins may delete their own.
  if (
    requesterRole !== Role.SUPER_ADMIN &&
    product.createdById !== requesterId
  ) {
    throw new ApiError(
      403,
      "You do not have permission to delete this product"
    );
  }
  // Deleting the product will cascade delete QuoteRequests via FK constraint.
  return prisma.marketplaceProduct.delete({ where: { id: productId } });
};
