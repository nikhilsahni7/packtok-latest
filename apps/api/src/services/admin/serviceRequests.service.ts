import { prisma, Role, ServiceStatus } from "@packtok/db";
import { ApiError } from "../../utils/apiError";

const includeBlock = {
  maintenanceRequest: true,
  consultancyRequest: true,
  turnkeyProjectInquiry: true,
  companyAcquisitionInquiry: true,
  manpowerHiringRequest: true,
  jobSeekerProfile: true,
  machineryInstallerRequest: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone_number: true,
      country: true,
    },
  },
  assignedTo: {
    select: { id: true, name: true, email: true },
  },
  actionLogs: {
    include: {
      actor: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" as const },
  },
};

export const listAllServiceRequests = async () => {
  return prisma.serviceRequest.findMany({
    include: includeBlock,
    orderBy: { createdAt: "desc" },
  });
};

export const getRequestById = async (id: string) => {
  const req = await prisma.serviceRequest.findUnique({
    where: { id },
    include: includeBlock,
  });
  if (!req) throw new ApiError(404, "Service request not found");
  return req;
};

const logAction = async (
  requestId: string,
  actorId: string,
  action: string,
  notes?: string
) => {
  await prisma.serviceActionLog.create({
    data: { requestId, actorId, action, notes },
  });
};

export const updateServiceRequestStatus = async (
  requestId: string,
  newStatus: ServiceStatus,
  actorId: string
) => {
  const updated = await prisma.serviceRequest.update({
    where: { id: requestId },
    data: { status: newStatus },
    include: includeBlock,
  });
  await logAction(requestId, actorId, `Status changed to ${newStatus}`);
  return updated;
};

export const assignServiceRequest = async (
  requestId: string,
  adminId: string,
  actorId: string
) => {
  const updated = await prisma.serviceRequest.update({
    where: { id: requestId },
    data: { assignedToId: adminId },
    include: includeBlock,
  });
  await logAction(requestId, actorId, `Assigned to admin ${adminId}`);
  return updated;
};

export const deleteServiceRequest = async (
  requestId: string,
  actorRole: Role
) => {
  if (actorRole !== Role.SUPER_ADMIN) {
    throw new ApiError(403, "Only Super Admin can delete service requests");
  }
  return prisma.serviceRequest.delete({ where: { id: requestId } });
};
