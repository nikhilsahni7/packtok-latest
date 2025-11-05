import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";

import api from "../lib/api";
import type { ManpowerHiringFormData } from "../schemas/manpower-hiring-schema";

export const useManpowerHiringSubmission = () => {
  return useMutation({
    mutationFn: async (data: ManpowerHiringFormData) => {
      // Convert data to the format expected by the backend
      const formattedData = {
        ...data,
        expectedJoiningDate: data.expectedJoiningDate.toISOString(),
        skilledWorkersRequired: parseInt(data.skilledWorkersRequired, 10) || 0,
        semiSkilledWorkersRequired:
          parseInt(data.semiSkilledWorkersRequired, 10) || 0,
        unskilledWorkersRequired:
          parseInt(data.unskilledWorkersRequired, 10) || 0,
      };

      const response = await api.post(
        "/api/v1/services/manpower-hiring",
        formattedData
      );
      return response.data.data;
    },
    onSuccess: () => {
      Alert.alert(
        "Success",
        "Your manpower hiring request has been submitted successfully! We'll contact you soon.",
        [{ text: "OK" }]
      );
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to submit request. Please try again.";
      Alert.alert("Error", errorMessage, [{ text: "OK" }]);
    },
  });
};
