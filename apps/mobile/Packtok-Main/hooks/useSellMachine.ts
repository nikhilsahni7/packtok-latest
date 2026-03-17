import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Alert } from "react-native";

import api from "../lib/api";

interface SellMachineSubmissionData {
  title: string;
  price: string;
  currency: string;
  productType: string;
  machineType?: string;
  categoryName: string;
  condition: string;
  manufacturer?: string;
  model?: string;
  year?: string;
  description: string;
  additionalInfo?: string;
  images: any[]; // Image URIs or File objects
  thumbnail?: any;
  video?: any;
  videoThumbnail?: any;
  pdf?: any;
  specifications?: string; // JSON string
}

export const useSellMachineSubmission = () => {
  return useMutation({
    mutationFn: async (data: SellMachineSubmissionData) => {
      // Create FormData for file uploads
      const formData = new FormData();

      // Add ONLY the fields that web sends (no email/phone/address)
      // These fields are collected for validation but NOT sent to backend
      formData.append("title", data.title);
      formData.append("price", data.price);
      formData.append("currency", (data.currency || "INR").toUpperCase());
      formData.append("productType", data.productType);
      formData.append("categoryName", data.categoryName);
      formData.append("condition", data.condition);
      formData.append("description", data.description);

      if (data.machineType) {
        formData.append("machineType", data.machineType);
      }
      if (data.manufacturer) {
        formData.append("manufacturer", data.manufacturer);
      }
      if (data.model) {
        formData.append("model", data.model);
      }
      if (data.year) {
        formData.append("year", data.year);
      }
      if (data.additionalInfo) {
        formData.append("additionalInfo", data.additionalInfo);
      }
      const normalizedSpecifications =
        data.specifications && data.specifications.trim().length > 0
          ? data.specifications
          : "{}";
      formData.append("specifications", normalizedSpecifications);

      // Add images
      data.images.forEach((image, index) => {
        const imageFile = {
          uri: image.uri,
          type: image.mimeType || image.type || "image/jpeg",
          name: image.fileName || `image_${index}.jpg`,
        };
        formData.append("images", imageFile as any);
      });

      // Add thumbnail
      if (data.thumbnail) {
        const thumbnailFile = {
          uri: data.thumbnail.uri,
          type: data.thumbnail.mimeType || data.thumbnail.type || "image/jpeg",
          name: data.thumbnail.fileName || "thumbnail.jpg",
        };
        formData.append("thumbnail", thumbnailFile as any);
      }

      // Add video
      if (data.video) {
        const videoFile = {
          uri: data.video.uri,
          type: data.video.mimeType || data.video.type || "video/mp4",
          name: data.video.fileName || "video.mp4",
        };
        formData.append("video", videoFile as any);
      }

      // Add video thumbnail
      if (data.videoThumbnail) {
        const videoThumbnailFile = {
          uri: data.videoThumbnail.uri,
          type:
            data.videoThumbnail.mimeType ||
            data.videoThumbnail.type ||
            "image/jpeg",
          name: data.videoThumbnail.fileName || "video_thumbnail.jpg",
        };
        formData.append("videoThumbnail", videoThumbnailFile as any);
      }

      // Add PDF
      if (data.pdf) {
        // DocumentPicker returns 'name' and 'mimeType', not 'fileName' and 'type'
        const pdfFile = {
          uri: data.pdf.uri,
          type: data.pdf.mimeType || data.pdf.type || "application/pdf",
          name: data.pdf.name || data.pdf.fileName || "document.pdf",
        };
        formData.append("pdf", pdfFile as any);
      }

      const response = await api.post("/api/v1/products/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onSuccess: () => {
      Alert.alert(
        "Success",
        "Your product has been submitted for review. We'll notify you once it's approved.",
        [{ text: "OK" }],
      );
    },
    onError: (error: any) => {
      let errorMessage = "Failed to submit product. Please try again.";

      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = "Please login to submit a product.";
        } else if (error.response?.status === 400) {
          errorMessage =
            error.response?.data?.message ||
            "Invalid data. Please check all fields.";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      Alert.alert("Submission Error", errorMessage);
    },
  });
};
