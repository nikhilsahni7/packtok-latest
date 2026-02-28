import { prisma, Role } from "@packtok/db";
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
      country: true,
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
          bookmarks: true,
          searchHistory: true,
          viewHistory: true,
          productReviews: true,
          createdProducts: true,
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const updateUserForAdmin = async (
  userId: string,
  data: {
    name?: string;
    phone_number?: string | null;
    role?: Role;
    country?: string | null;
  }
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Prevent changing SUPER_ADMIN role
  if (user.role === Role.SUPER_ADMIN) {
    throw new ApiError(403, "Cannot modify a Super Admin user");
  }

  return await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone_number: true,
      role: true,
      country: true,
      createdAt: true,
      updatedAt: true,
      profile_image: true,
    },
  });
};

export const deleteUserForAdmin = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Prevent deleting SUPER_ADMIN
  if (user.role === Role.SUPER_ADMIN) {
    throw new ApiError(403, "Cannot delete a Super Admin user");
  }

  // Delete user — cascade will handle all related records
  await prisma.user.delete({ where: { id: userId } });

  return { message: "User deleted successfully" };
};
