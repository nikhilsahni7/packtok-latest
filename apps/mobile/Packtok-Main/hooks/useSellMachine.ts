import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Alert } from "react-native";

import api from "../lib/api";

interface SellMachineSubmissionData {
  title: string;
  email: string;
  phoneNumber: string;
  price: string;
  productType: string;
  machineType?: string;
  categoryName: string;
  condition: string;
  manufacturer?: string;
  model?: string;
  year?: string;
  description: string;
  additionalInfo?: string;
  legalBusinessName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcodeZip: string;
  country: string;
  state: string;
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
      console.log("=== MUTATION START ===");
      console.log("🚀 Submitting sell machine data");
      console.log("📊 Data summary:", {
        title: data.title,
        email: data.email,
        phoneNumber: data.phoneNumber,
        price: data.price,
        productType: data.productType,
        categoryName: data.categoryName,
        condition: data.condition,
        imagesCount: data.images?.length || 0,
        hasThumbnail: !!data.thumbnail,
        hasVideo: !!data.video,
        hasVideoThumbnail: !!data.videoThumbnail,
        hasPdf: !!data.pdf,
        specifications: data.specifications,
      });

      // Create FormData for file uploads
      const formData = new FormData();

      // Add ONLY the fields that web sends (no email/phone/address)
      // These fields are collected for validation but NOT sent to backend
      console.log("📝 Adding text fields to FormData...");
      formData.append("title", data.title);
      formData.append("price", data.price);
      formData.append("productType", data.productType);
      formData.append("categoryName", data.categoryName);
      formData.append("condition", data.condition);
      formData.append("description", data.description);

      if (data.machineType) {
        console.log("  + machineType:", data.machineType);
        formData.append("machineType", data.machineType);
      }
      if (data.manufacturer) {
        console.log("  + manufacturer:", data.manufacturer);
        formData.append("manufacturer", data.manufacturer);
      }
      if (data.model) {
        console.log("  + model:", data.model);
        formData.append("model", data.model);
      }
      if (data.year) {
        console.log("  + year:", data.year);
        formData.append("year", data.year);
      }
      if (data.additionalInfo) {
        console.log("  + additionalInfo:", data.additionalInfo);
        formData.append("additionalInfo", data.additionalInfo);
      }
      if (data.specifications) {
        console.log("  + specifications:", data.specifications);
        formData.append("specifications", data.specifications);
      }

      // Add images
      console.log("🖼️ Adding images to FormData...");
      data.images.forEach((image, index) => {
        console.log(`  Image ${index}:`, {
          uri: image.uri,
          type: image.type,
          mimeType: image.mimeType,
          fileName: image.fileName,
        });
        const imageFile = {
          uri: image.uri,
          type: image.mimeType || image.type || "image/jpeg",
          name: image.fileName || `image_${index}.jpg`,
        };
        formData.append("images", imageFile as any);
      });

      // Add thumbnail
      if (data.thumbnail) {
        console.log("📸 Adding thumbnail:", {
          uri: data.thumbnail.uri,
          type: data.thumbnail.type,
          mimeType: data.thumbnail.mimeType,
          fileName: data.thumbnail.fileName,
        });
        const thumbnailFile = {
          uri: data.thumbnail.uri,
          type: data.thumbnail.mimeType || data.thumbnail.type || "image/jpeg",
          name: data.thumbnail.fileName || "thumbnail.jpg",
        };
        formData.append("thumbnail", thumbnailFile as any);
      }

      // Add video
      if (data.video) {
        console.log("🎥 Adding video:", {
          uri: data.video.uri,
          type: data.video.type,
          mimeType: data.video.mimeType,
          fileName: data.video.fileName,
        });
        const videoFile = {
          uri: data.video.uri,
          type: data.video.mimeType || data.video.type || "video/mp4",
          name: data.video.fileName || "video.mp4",
        };
        formData.append("video", videoFile as any);
      }

      // Add video thumbnail
      if (data.videoThumbnail) {
        console.log("🖼️ Adding video thumbnail:", {
          uri: data.videoThumbnail.uri,
          type: data.videoThumbnail.type,
          mimeType: data.videoThumbnail.mimeType,
          fileName: data.videoThumbnail.fileName,
        });
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
        console.log("📄 Adding PDF:", {
          uri: data.pdf.uri,
          type: data.pdf.type,
          mimeType: data.pdf.mimeType,
          name: data.pdf.name,
          fileName: data.pdf.fileName,
        });
        // DocumentPicker returns 'name' and 'mimeType', not 'fileName' and 'type'
        const pdfFile = {
          uri: data.pdf.uri,
          type: data.pdf.mimeType || data.pdf.type || "application/pdf",
          name: data.pdf.name || data.pdf.fileName || "document.pdf",
        };
        console.log("📄 PDF file object:", pdfFile);
        formData.append("pdf", pdfFile as any);
      }

      console.log("📤 Making API request to /api/v1/products/submit");
      console.log("🔑 Headers: Content-Type: multipart/form-data");

      try {
        const response = await api.post("/api/v1/products/submit", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("✅ API Response received");
        console.log("Response status:", response.status);
        console.log("Response data:", response.data);
        console.log("=== MUTATION END ===");

        return response.data;
      } catch (error: any) {
        console.error("❌ API Request failed");
        console.error("Error:", error);
        console.error("Error message:", error?.message);
        console.error("Error response:", error?.response);
        console.error("Error response data:", error?.response?.data);
        console.error("Error response status:", error?.response?.status);
        console.error("Error request:", error?.request);
        console.error("Error config:", error?.config);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("✅ Product submitted successfully!");
      Alert.alert(
        "Success",
        "Your product has been submitted for review. We'll notify you once it's approved.",
        [{ text: "OK" }]
      );
    },
    onError: (error: any) => {
      console.error("❌ Product submission error:", error);
      console.error("Error response:", error?.response?.data);

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
