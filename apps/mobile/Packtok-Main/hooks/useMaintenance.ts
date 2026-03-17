import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";
import { MaintenanceFormData } from "../schemas/maintenance-schema";

export const useMaintenanceSubmission = () => {
  return useMutation({
    mutationFn: async (data: MaintenanceFormData) => {
      const { data: response } = await api.post(
        "/api/v1/services/maintenance",
        data,
      );
      return response.data;
    },
  });
};
