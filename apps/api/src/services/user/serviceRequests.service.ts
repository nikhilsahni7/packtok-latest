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
