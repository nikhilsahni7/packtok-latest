import {
  MarketplaceProductStatus,
  Prisma,
  QuoteStatus,
  StockMovementReason,
  
  prisma,
} from "@packtok/db";
import { ApiError } from "../utils/apiError";

export const createQuoteRequest = async (
  userId: string,
  data: Omit<Prisma.QuoteRequestUncheckedCreateInput, "userId" | "status"> & {
    productId: string;
  }
) => {
  return prisma.quoteRequest.create({
    data: {
      ...data,
      userId,
      status: QuoteStatus.PENDING,
    },
  });
};

export const getMyQuoteRequests = async (userId: string) => {
  return prisma.quoteRequest.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          description: true,
          images: true,
          price: true,
          manufacturer: true,
          productType: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getQuoteRequestById = async (quoteId: string, userId: string) => {
  const quote = await prisma.quoteRequest.findUnique({
    where: { id: quoteId },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          description: true,
          images: true,
          price: true,
          manufacturer: true,
          productType: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!quote) {
    throw new ApiError(404, "Quote request not found");
  }

  // Verify the quote belongs to the user
  if (quote.userId !== userId) {
    throw new ApiError(403, "You don't have permission to view this quote");
  }

  return quote;
};

export const cancelUserQuoteRequest = async (
  quoteId: string,
  userId: string,
  reason: string
) => {
  const quote = await prisma.quoteRequest.findUnique({
    where: { id: quoteId },
  });

  if (!quote) {
    throw new ApiError(404, "Quote request not found");
  }

  if (quote.userId !== userId) {
    throw new ApiError(403, "Unauthorized");
  }

  if (quote.status !== QuoteStatus.PENDING) {
    throw new ApiError(400, "Only pending quote requests can be cancelled");
  }

  return prisma.quoteRequest.update({
    where: { id: quoteId },
    data: {
      status: QuoteStatus.CANCELLED,
      cancellationReason: reason,
    },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          images: true,
          price: true,
        },
      },
    },
  });
};

export const getAllQuoteRequests = async () => {
  return prisma.quoteRequest.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone_number: true,
          country: true,
        },
      },
      product: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateQuoteStatus = async (
  quoteId: string,
  status: QuoteStatus
) => {
  const quote = await prisma.quoteRequest.findUnique({
    where: { id: quoteId },
    include: { product: { select: { id: true, quantity: true, status: true } } },
  });
  if (!quote) {
    throw new ApiError(404, "Quote request not found");
  }

  const previousStatus = quote.status;

  // ── COMPLETED: decrement product quantity ──────────────────────────
  if (status === QuoteStatus.COMPLETED && previousStatus !== QuoteStatus.COMPLETED) {
    return prisma.$transaction(async (tx) => {
      // Decrement product quantity by 1
      const updatedProduct = await tx.marketplaceProduct.update({
        where: { id: quote.productId },
        data: { quantity: { decrement: 1 } },
      });

      // Auto-set OUT_OF_STOCK when quantity reaches 0
      if (updatedProduct.quantity <= 0) {
        await tx.marketplaceProduct.update({
          where: { id: quote.productId },
          data: { status: MarketplaceProductStatus.OUT_OF_STOCK },
        });
      }

      // Record stock movement
      await tx.stockMovement.create({
        data: {
          productId: quote.productId,
          delta: -1,
          reason: StockMovementReason.SALE,
          createdById: quote.userId,
          meta: { quoteId: quote.id, reason: "Quote completed" },
        },
      });

      // Update quote status
      return tx.quoteRequest.update({
        where: { id: quoteId },
        data: { status },
      });
    });
  }

  // ── CANCELLED from COMPLETED: restore product quantity ─────────────
  if (status === QuoteStatus.CANCELLED && previousStatus === QuoteStatus.COMPLETED) {
    return prisma.$transaction(async (tx) => {
      // Restore product quantity by 1
      const updatedProduct = await tx.marketplaceProduct.update({
        where: { id: quote.productId },
        data: { quantity: { increment: 1 } },
      });

      // Auto-restore to AVAILABLE if was OUT_OF_STOCK
      if (
        updatedProduct.quantity > 0 &&
        updatedProduct.status === MarketplaceProductStatus.OUT_OF_STOCK
      ) {
        await tx.marketplaceProduct.update({
          where: { id: quote.productId },
          data: { status: MarketplaceProductStatus.AVAILABLE },
        });
      }

      // Record stock movement
      await tx.stockMovement.create({
        data: {
          productId: quote.productId,
          delta: 1,
          reason: StockMovementReason.CANCELLATION,
          createdById: quote.userId,
          meta: { quoteId: quote.id, reason: "Completed quote cancelled" },
        },
      });

      // Update quote status
      return tx.quoteRequest.update({
        where: { id: quoteId },
        data: { status },
      });
    });
  }

  // ── All other status transitions: just update the status ──────────
  return prisma.quoteRequest.update({
    where: { id: quoteId },
    data: { status },
  });
};
