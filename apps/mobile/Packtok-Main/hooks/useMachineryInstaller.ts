import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import api from "../lib/api";

export interface MachineryInstallerFormData {
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  companyAddress: string;
  installationTypeRequired: string;
  expectedTimeline: string;
  specificInstructions?: string;
  machineImages?: any[];
  machineVideos?: any[];
  machineTypeModel: string;
  capacitySpecifications: string;
  fromLocation: string;
  preferredInstallationDateTime: string;
  whereLocation: string;
  additionalDescription?: string;
  teamMembersRequired: number;
  skillsExpertiseNeeded: string;
  onSiteSupportProvidedByClient: string;
  agreeToTerms?: boolean; // Not sent to backend
}

export function useSubmitMachineryInstaller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MachineryInstallerFormData) => {
      // It includes file uploads, so we need to use FormData
      const formData = new FormData();

      // Append text fields
      Object.entries(data).forEach(([key, value]) => {
        if (
          key !== "machineImages" &&
          key !== "machineVideos" &&
          key !== "agreeToTerms" &&
          value !== undefined &&
          value !== null
        ) {
          formData.append(key, String(value));
        }
      });

      // Append images
      if (data.machineImages && data.machineImages.length > 0) {
        data.machineImages.forEach((image) => {
          formData.append("machineImages", {
            uri: image.uri,
            type: image.mimeType || "image/jpeg",
            name: image.fileName || `image-${Date.now()}.jpg`,
          } as any);
        });
      }

      // Append videos
      if (data.machineVideos && data.machineVideos.length > 0) {
        data.machineVideos.forEach((video) => {
          formData.append("machineVideos", {
            uri: video.uri,
            type: video.mimeType || "video/mp4",
            name: video.fileName || `video-${Date.now()}.mp4`,
          } as any);
        });
      }

      // Setting content-type to multipart/form-data is explicitly required by axios for RN
      const response = await api.post("/api/v1/services/machinery-installer", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-service-requests"] });
    },
    onError: (error: any) => {
      console.error("Submit machinery installer error:", error);
      Toast.show({
        type: "error",
        text1: "Submission Failed",
        text2:
          error?.response?.data?.message ||
          "Failed to submit machinery installer request. Please try again.",
      });
    },
  });
}
