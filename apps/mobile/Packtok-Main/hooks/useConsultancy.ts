import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";
import { ConsultancyFormData } from "../schemas/consultancy-schema";

export const useConsultancySubmission = () => {
  return useMutation({
    mutationFn: async (data: ConsultancyFormData) => {
      const { data: response } = await api.post(
        "/api/v1/services/consultancy",
        data,
      );
      return response.data;
    },
  });
};
