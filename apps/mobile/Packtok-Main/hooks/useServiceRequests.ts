import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export type ServiceType =
  | "MAINTENANCE"
  | "CONSULTANCY"
  | "TURNKEY_PROJECT"
  | "COMPANY_ACQUISITION"
  | "MANPOWER_HIRING"
  | "JOB_SEEKER_SUBMISSION";

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

export interface ServiceActionLog {
  id: string;
  createdAt: string;
  action: string;
  notes?: string;
  actorId: string;
}

export interface ServiceRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  serviceType: ServiceType;
  status: ServiceStatus;
  userId: string;
  assignedToId?: string;
  actionLogs?: ServiceActionLog[];

  // Service-specific data (one of these will be populated)
  maintenanceRequest?: any;
  consultancyRequest?: any;
  turnkeyProjectInquiry?: any;
  companyAcquisitionInquiry?: any;
  manpowerHiringRequest?: any;
  jobSeekerProfile?: any;
}

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

// Get Single Service Request Details
export const useServiceRequestDetails = (id: string) => {
  return useQuery({
    queryKey: ["serviceRequest", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/services/${id}`);
      return data.data as ServiceRequest;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
