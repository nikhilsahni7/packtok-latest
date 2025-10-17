import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";
import { TurnkeyProjectFormData } from "../schemas/turnkey-project-schema";

export const useTurnkeyProjectSubmission = () => {
  return useMutation({
    mutationFn: async (data: TurnkeyProjectFormData) => {
      console.log("📤 Submitting turnkey project form...");
      try {
        const { data: response } = await api.post(
          "/api/v1/services/turnkey-project",
          data
        );
        console.log("✅ Turnkey project submitted successfully:", response);
        return response.data;
      } catch (error: any) {
        console.error("❌ Turnkey project submission failed:", {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          data: error.response?.data,
        });
        throw error;
      }
    },
  });
};
