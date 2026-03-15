import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import api from "../lib/api";

export type ServiceType =
  | "MAINTENANCE"
  | "CONSULTANCY"
  | "TURNKEY_PROJECT"
  | "COMPANY_ACQUISITION"
  | "MANPOWER_HIRING"
  | "JOB_SEEKER_SUBMISSION"
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
  machineryInstallerRequest?: any;
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

// Cancel / Withdraw a Service Request
export function useCancelServiceRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data } = await api.put(`/api/v1/services/${id}/cancel`, {
        reason,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      Toast.show({
        type: "success",
        text1: "Request Withdrawn",
        text2: "Your service request was successfully cancelled.",
      });
      // Invalidate both list and detail caches
      queryClient.invalidateQueries({ queryKey: ["myServiceRequests"] });
      queryClient.invalidateQueries({
        queryKey: ["serviceRequest", variables.id],
      });
    },
    onError: (error: any) => {
      console.error("Cancel service request error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.message ||
          "Failed to withdraw request. Please try again.",
      });
    },
  });
}
