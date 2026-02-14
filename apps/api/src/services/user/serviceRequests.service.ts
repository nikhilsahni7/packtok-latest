import { prisma, Prisma, ServiceStatus, ServiceType } from "@packtok/db";

/*
 * Generic helper to attach the common include block so that frontend always
 * receives the specialised request details along with parent data.
 */
const requestInclude = {
  maintenanceRequest: true,
  consultancyRequest: true,
  turnkeyProjectInquiry: true,
  companyAcquisitionInquiry: true,
  manpowerHiringRequest: true,
  jobSeekerProfile: true,
  actionLogs: {
    orderBy: { createdAt: "desc" as const },
  },
};

export const createMaintenanceRequest = async (
  userId: string,
  data: Prisma.MaintenanceRequestUncheckedCreateWithoutServiceRequestInput
) => {
  const { agreeToTerms, ...dbData } = data as any;
  return prisma.serviceRequest.create({
    data: {
      userId,
      serviceType: ServiceType.MAINTENANCE,
      status: ServiceStatus.SUBMITTED,
      maintenanceRequest: { create: dbData },
    },
    include: requestInclude,
  });
};

export const createConsultancyRequest = async (
  userId: string,
  data: Prisma.ConsultancyRequestUncheckedCreateWithoutServiceRequestInput
) => {
  const { agreeToTerms, ...dbData } = data as any;
  return prisma.serviceRequest.create({
    data: {
      userId,
      serviceType: ServiceType.CONSULTANCY,
      status: ServiceStatus.SUBMITTED,
      consultancyRequest: { create: dbData },
    },
    include: requestInclude,
  });
};

export const createTurnkeyProjectInquiry = async (
  userId: string,
  data: Prisma.TurnkeyProjectInquiryUncheckedCreateWithoutServiceRequestInput
) => {
  const { agreeToTerms, ...dbData } = data as any;
  return prisma.serviceRequest.create({
    data: {
      userId,
      serviceType: ServiceType.TURNKEY_PROJECT,
      status: ServiceStatus.SUBMITTED,
      turnkeyProjectInquiry: { create: dbData },
    },
    include: requestInclude,
  });
};

export const createCompanyAcquisitionInquiry = async (
  userId: string,
  data: Prisma.CompanyAcquisitionInquiryUncheckedCreateWithoutServiceRequestInput
) => {
  const { agreeToTerms, ...dbData } = data as any;
  return prisma.serviceRequest.create({
    data: {
      userId,
      serviceType: ServiceType.COMPANY_ACQUISITION,
      status: ServiceStatus.SUBMITTED,
      companyAcquisitionInquiry: { create: dbData },
    },
    include: requestInclude,
  });
};

export const createManpowerHiringRequest = async (
  userId: string,
  data: Prisma.ManpowerHiringRequestUncheckedCreateWithoutServiceRequestInput
) => {
  const { agreeToTerms, ...dbData } = data as any;
  return prisma.serviceRequest.create({
    data: {
      userId,
      serviceType: ServiceType.MANPOWER_HIRING,
      status: ServiceStatus.SUBMITTED,
      manpowerHiringRequest: { create: dbData },
    },
    include: requestInclude,
  });
};

export const createJobSeekerProfile = async (
  userId: string,
  data: Prisma.JobSeekerProfileUncheckedCreateWithoutServiceRequestInput
) => {
  const { agreeToTerms, ...dbData } = data as any;
  return prisma.serviceRequest.create({
    data: {
      userId,
      serviceType: ServiceType.JOB_SEEKER_SUBMISSION,
      status: ServiceStatus.SUBMITTED,
      jobSeekerProfile: { create: dbData },
    },
    include: requestInclude,
  });
};

export const getUserServiceRequests = async (userId: string) => {
  return prisma.serviceRequest.findMany({
    where: { userId },
    include: requestInclude,
    orderBy: { createdAt: "desc" },
  });
};

export const cancelUserServiceRequest = async (
  userId: string,
  requestId: string,
  reason: string
) => {
  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
  });
  if (!request) throw new Error("Service request not found");
  if (request.userId !== userId) throw new Error("Unauthorized");

  const nonCancellable: string[] = [
    ServiceStatus.COMPLETED,
    ServiceStatus.CLOSED,
    ServiceStatus.CANCELLED,
  ];
  if (nonCancellable.includes(request.status)) {
    throw new Error("This request cannot be cancelled");
  }

  const updated = await prisma.serviceRequest.update({
    where: { id: requestId },
    data: { status: ServiceStatus.CANCELLED },
    include: requestInclude,
  });

  // Log the cancellation with the user's reason
  await prisma.serviceActionLog.create({
    data: {
      requestId,
      actorId: userId,
      action: "Cancelled by user",
      notes: reason,
    },
  });

  return updated;
};
