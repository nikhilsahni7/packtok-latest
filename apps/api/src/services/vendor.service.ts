import { VendorSubscriptionStatus, prisma, Role, VendorApplicationStatus } from "@packtok/db";
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
