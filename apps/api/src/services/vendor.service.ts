import { prisma, Role, VendorApplicationStatus } from "@packtok/db";
import { ApiError } from "../utils/apiError";

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

  await prisma.$transaction([
    prisma.vendorApplication.update({
      where: { id: applicationId },
      data: { status: VendorApplicationStatus.APPROVED },
    }),
    prisma.user.update({
      where: { id: app.userId },
      data: { role: Role.VENDOR },
    }),
  ]);

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
