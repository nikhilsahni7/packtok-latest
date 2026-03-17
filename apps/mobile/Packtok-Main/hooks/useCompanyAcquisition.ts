import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";
import { CompanyAcquisitionFormData } from "../schemas/company-acquisition-schema";

export const useCompanyAcquisitionSubmission = () => {
  return useMutation({
    mutationFn: async (data: CompanyAcquisitionFormData) => {
      const { data: response } = await api.post(
        "/api/v1/services/company-acquisition",
        data,
      );
      return response.data;
    },
  });
};
