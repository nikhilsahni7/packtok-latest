import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";
import { TurnkeyProjectFormData } from "../schemas/turnkey-project-schema";

export const useTurnkeyProjectSubmission = () => {
  return useMutation({
    mutationFn: async (data: TurnkeyProjectFormData) => {
      const { data: response } = await api.post(
        "/api/v1/services/turnkey-project",
        data,
      );
      return response.data;
    },
  });
};
