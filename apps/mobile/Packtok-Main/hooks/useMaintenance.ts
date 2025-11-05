import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";
import { MaintenanceFormData } from "../schemas/maintenance-schema";

export const useMaintenanceSubmission = () => {
  return useMutation({
    mutationFn: async (data: MaintenanceFormData) => {
      console.log("📤 Submitting maintenance form...");
      try {
        const { data: response } = await api.post(
          "/api/v1/services/maintenance",
          data
        );
        console.log("✅ Maintenance submitted successfully:", response);
        return response.data;
      } catch (error: any) {
        console.error("❌ Maintenance submission failed:", {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          data: error.response?.data,
        });
        throw error;
      }
    },
  });
};
