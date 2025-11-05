import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";
import { ConsultancyFormData } from "../schemas/consultancy-schema";

export const useConsultancySubmission = () => {
  return useMutation({
    mutationFn: async (data: ConsultancyFormData) => {
      console.log("📤 Submitting consultancy form...");
      try {
        const { data: response } = await api.post(
          "/api/v1/services/consultancy",
          data
        );
        console.log("✅ Consultancy submitted successfully:", response);
        return response.data;
      } catch (error: any) {
        console.error("❌ Consultancy submission failed:", {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          data: error.response?.data,
        });
        throw error;
      }
    },
  });
};
