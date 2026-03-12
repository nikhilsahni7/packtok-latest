import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { MaintenanceFormData } from "@/schemas/maintenance-schema";
import { ConsultancyFormData } from "@/schemas/consultancy-schema";
import { TurnkeyProjectFormData } from "@/schemas/turnkey-project-schema";
import { CompanyAcquisitionFormData } from "@/schemas/company-acquisition-schema";
import { ManpowerHiringFormData } from "@/schemas/manpower-hiring-schema";
import { JobSeekerFormData } from "@/schemas/job-seeker-schema";
import { MachineryInstallerFormData } from "@/schemas/machinery-installer-schema";

// Service Types
export type ServiceType =
  | "MAINTENANCE"
  | "CONSULTANCY"
  | "TURNKEY_PROJECT"
  | "COMPANY_ACQUISITION"
  | "MANPOWER_HIRING"
  | "JOB_SEEKER"
  | "MACHINERY_INSTALLER";

export type ServiceStatus =
  | "SUBMITTED"
  | "AWAITING_ASSIGNMENT"
  | "IN_REVIEW"
  | "ACTION_REQUIRED"
  | "APPROVED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CLOSED"
  | "CANCELLED";

export interface ServiceRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  serviceType: ServiceType;
  status: ServiceStatus;
  userId: string;
  assignedToId?: string;

  // Service-specific data (one of these will be populated)
  maintenanceRequest?: any;
  consultancyRequest?: any;
  turnkeyProjectInquiry?: any;
  companyAcquisitionInquiry?: any;
  manpowerHiringRequest?: any;
  jobSeekerProfile?: any;
  machineryInstallerRequest?: any;
}

// Maintenance Service Hook
export const useMaintenanceSubmission = () => {
  return useMutation({
    mutationFn: async (data: MaintenanceFormData) => {
      const { data: response } = await api.post(
        "/api/v1/services/maintenance",
        data
      );
      return response.data;
    },
  });
};

// Consultancy Service Hook
export const useConsultancySubmission = () => {
  return useMutation({
    mutationFn: async (data: ConsultancyFormData) => {
      const { data: response } = await api.post(
        "/api/v1/services/consultancy",
        data
      );
      return response.data;
    },
  });
};

// Turnkey Project Hook
export const useTurnkeyProjectSubmission = () => {
  return useMutation({
    mutationFn: async (data: TurnkeyProjectFormData) => {
      const { data: response } = await api.post(
        "/api/v1/services/turnkey-project",
        data
      );
      return response.data;
    },
  });
};

// Company Acquisition Hook
export const useCompanyAcquisitionSubmission = () => {
  return useMutation({
    mutationFn: async (data: CompanyAcquisitionFormData) => {
      const { data: response } = await api.post(
        "/api/v1/services/company-acquisition",
        data
      );
      return response.data;
    },
  });
};

// Manpower Hiring Hook
export const useManpowerHiringSubmission = () => {
  return useMutation({
    mutationFn: async (data: ManpowerHiringFormData) => {
      const { data: response } = await api.post(
        "/api/v1/services/manpower-hiring",
        data
      );
      return response.data;
    },
  });
};

// Job Seeker Hook (with file upload)
export const useJobSeekerSubmission = () => {
  return useMutation({
    mutationFn: async (data: JobSeekerFormData) => {
      const formData = new FormData();

      // Add all text fields
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("postalCode", data.postalCode);
      formData.append("stateOfResidence", data.stateOfResidence);
      formData.append("phone", data.phone);
      if (data.alternatePhone)
        formData.append("alternatePhone", data.alternatePhone);
      formData.append("positionSought", data.positionSought);
      if (data.otherPosition)
        formData.append("otherPosition", data.otherPosition);
      formData.append("preferredWorkingMode", data.preferredWorkingMode);
      formData.append(
        "hasPreviouslyWorkedWithUs",
        data.hasPreviouslyWorkedWithUs ? "true" : "false"
      );
      if (data.previousWorkEndDate)
        formData.append("previousWorkEndDate", data.previousWorkEndDate);

      // Add CV file
      if (data.cv) {
        formData.append("cv", data.cv);
      }

      const { data: response } = await api.post(
        "/api/v1/services/jobseeker",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
  });
};

export const useMachineryInstallerSubmission = () => {
  return useMutation({
    mutationFn: async (data: MachineryInstallerFormData) => {
      const formData = new FormData();

      formData.append("companyName", data.companyName);
      formData.append("contactPerson", data.contactPerson);
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      formData.append("companyAddress", data.companyAddress);
      formData.append("installationTypeRequired", data.installationTypeRequired);
      formData.append("expectedTimeline", data.expectedTimeline);
      if (data.specificInstructions) {
        formData.append("specificInstructions", data.specificInstructions);
      }
      formData.append("machineTypeModel", data.machineTypeModel);
      formData.append("capacitySpecifications", data.capacitySpecifications);
      formData.append("fromLocation", data.fromLocation);
      if (data.preferredInstallationDateTime) {
        formData.append(
          "preferredInstallationDateTime",
          data.preferredInstallationDateTime
        );
      }
      formData.append("whereLocation", data.whereLocation);
      if (data.additionalDescription) {
        formData.append("additionalDescription", data.additionalDescription);
      }
      formData.append("teamMembersRequired", String(data.teamMembersRequired));
      formData.append("skillsExpertiseNeeded", data.skillsExpertiseNeeded);
      if (data.onSiteSupportProvidedByClient) {
        formData.append(
          "onSiteSupportProvidedByClient",
          data.onSiteSupportProvidedByClient
        );
      }

      data.machineImages.forEach((file) => {
        formData.append("machineImages", file);
      });
      data.machineVideos.forEach((file) => {
        formData.append("machineVideos", file);
      });

      const { data: response } = await api.post(
        "/api/v1/services/machinery-installer",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
  });
};

// Get My Service Requests Hook
export const useMyServiceRequests = () => {
  return useQuery({
    queryKey: ["myServiceRequests"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/services/my");
      return data.data as ServiceRequest[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
