import { prisma } from "@packtok/db";
import { ApiError } from "../utils/apiError";

export const listAllUsersForAdmin = async () => {
  return await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone_number: true,
      role: true,
      createdAt: true,
      profile_image: true,
    },
  });
};

export const getUserByIdForAdmin = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      addresses: true,
      orders: {
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          totalAmount: true,
          createdAt: true,
        }
      },
      vendorApplication: true,
      _count: {
        select: {
          orders: true,
          quoteRequests: true,
          auctionEnrollments: true,
          auctionBids: true,
          serviceRequests: true,
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};
