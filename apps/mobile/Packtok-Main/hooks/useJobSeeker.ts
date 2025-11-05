import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";

import api from "../lib/api";
import type { JobSeekerFormData } from "../schemas/job-seeker-schema";

interface JobSeekerSubmissionData extends Omit<JobSeekerFormData, "cv"> {
  cv?: {
    uri: string;
    type: string;
    name: string;
  };
}

export const useJobSeekerSubmission = () => {
  return useMutation({
    mutationFn: async (data: JobSeekerSubmissionData) => {
      const formData = new FormData();

      // Add all text fields
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("postalCode", data.postalCode);
      formData.append("stateOfResidence", data.stateOfResidence);
      formData.append("phone", data.phone);
      if (data.alternatePhone) {
        formData.append("alternatePhone", data.alternatePhone);
      }
      formData.append("positionSought", data.positionSought);
      if (data.otherPosition) {
        formData.append("otherPosition", data.otherPosition);
      }
      formData.append("preferredWorkingMode", data.preferredWorkingMode);
      formData.append(
        "hasPreviouslyWorkedWithUs",
        data.hasPreviouslyWorkedWithUs ? "true" : "false"
      );
      if (data.previousWorkEndDate) {
        formData.append(
          "previousWorkEndDate",
          data.previousWorkEndDate.toISOString()
        );
      }

      // Add CV file if present
      if (data.cv) {
        formData.append("cv", {
          uri: data.cv.uri,
          type: data.cv.type,
          name: data.cv.name,
        } as any);
      }

      const response = await api.post("/api/v1/services/jobseeker", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    },
    onSuccess: () => {
      Alert.alert(
        "Success",
        "Your job application has been submitted successfully! We'll review your CV and contact you soon.",
        [{ text: "OK" }]
      );
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to submit application. Please try again.";
      Alert.alert("Error", errorMessage, [{ text: "OK" }]);
    },
  });
};
