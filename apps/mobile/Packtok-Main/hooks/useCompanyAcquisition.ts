import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";
import { CompanyAcquisitionFormData } from "../schemas/company-acquisition-schema";

export const useCompanyAcquisitionSubmission = () => {
  return useMutation({
    mutationFn: async (data: CompanyAcquisitionFormData) => {
      console.log("📤 Submitting company acquisition form...");
      try {
        const { data: response } = await api.post(
          "/api/v1/services/company-acquisition",
          data
        );
        console.log("✅ Company acquisition submitted successfully:", response);
        return response.data;
      } catch (error: any) {
        console.error("❌ Company acquisition submission failed:", {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          data: error.response?.data,
        });
        throw error;
      }
    },
  });
};
