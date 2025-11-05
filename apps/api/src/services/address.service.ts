import { Prisma, prisma } from "@packtok/db";
import { ApiError } from "../utils/apiError";

export const createAddress = async (
  userId: string,
  data: Omit<Prisma.AddressUncheckedCreateInput, "userId">
) => {
  // If this is set as default, unset other default addresses
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  return prisma.address.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const getUserAddresses = async (userId: string) => {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
};

export const getAddressById = async (addressId: string, userId: string) => {
  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  if (address.userId !== userId) {
    throw new ApiError(403, "You don't have permission to access this address");
  }

  return address;
};

export const updateAddress = async (
  addressId: string,
  userId: string,
  data: Partial<Omit<Prisma.AddressUncheckedCreateInput, "userId">>
) => {
  // Verify ownership
  await getAddressById(addressId, userId);

  // If setting as default, unset other default addresses
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true, id: { not: addressId } },
      data: { isDefault: false },
    });
  }

  return prisma.address.update({
    where: { id: addressId },
    data,
  });
};

export const deleteAddress = async (addressId: string, userId: string) => {
  // Verify ownership
  await getAddressById(addressId, userId);

  return prisma.address.delete({
    where: { id: addressId },
  });
};

export const setDefaultAddress = async (addressId: string, userId: string) => {
  // Verify ownership
  await getAddressById(addressId, userId);

  // Unset all other default addresses
  await prisma.address.updateMany({
    where: { userId, isDefault: true },
    data: { isDefault: false },
  });

  // Set this address as default
  return prisma.address.update({
    where: { id: addressId },
    data: { isDefault: true },
  });
};
