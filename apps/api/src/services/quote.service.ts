import { Prisma, QuoteStatus, prisma } from "@packtok/db";
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
  });
  if (!quote) {
    throw new ApiError(404, "Quote request not found");
  }
  return prisma.quoteRequest.update({
    where: { id: quoteId },
    data: { status },
  });
};
