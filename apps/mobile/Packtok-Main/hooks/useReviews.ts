import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

// Types
export interface ReviewUser {
  id: string;
  name: string;
  profile_image?: string | null;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  isVerified: boolean;
  createdAt: string;
  user: ReviewUser;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

// Fetch review stats for a product
export const useReviewStats = (productId: string) => {
  return useQuery<ReviewStats | null>({
    queryKey: ["reviewStats", productId],
    queryFn: async () => {
      try {
        const res = await api.get(
          `/api/v1/products/${productId}/reviews/stats`
        );
        const data = res.data;
        if (
          data.statusCode === 200 &&
          data.data &&
          data.data.totalReviews > 0
        ) {
          return data.data;
        }
        return null;
      } catch {
        return null;
      }
    },
    enabled: !!productId,
    staleTime: 1000 * 30,
    refetchOnMount: "always",
  });
};

// Fetch all reviews for a product
export const useReviews = (productId: string) => {
  return useQuery<Review[]>({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const res = await api.get(`/api/v1/products/${productId}/reviews`);
      const data = res.data;
      if (data.statusCode === 200 && data.data) {
        return data.data.reviews || [];
      }
      return [];
    },
    enabled: !!productId,
    staleTime: 1000 * 30,
    refetchOnMount: "always",
  });
};

// Check if user can review this product
export const useCanReview = (productId: string) => {
  return useQuery<{
    canReview: boolean;
    existingReview: Review | null;
  }>({
    queryKey: ["canReview", productId],
    queryFn: async () => {
      try {
        const res = await api.get(
          `/api/v1/products/${productId}/reviews/can-review`
        );
        const data = res.data;
        if (data.statusCode === 200 && data.data) {
          return {
            canReview: data.data.canReview || false,
            existingReview: data.data.existingReview || null,
          };
        }
        return { canReview: false, existingReview: null };
      } catch {
        return { canReview: false, existingReview: null };
      }
    },
    enabled: !!productId,
    staleTime: 0,
    refetchOnMount: "always",
  });
};

// Submit a new review
export const useSubmitReview = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      rating,
      comment,
    }: {
      rating: number;
      comment: string;
    }) => {
      const res = await api.post(`/api/v1/products/${productId}/reviews`, {
        rating,
        comment,
      });
      return res.data;
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Review submitted!",
        position: "top",
      });
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["reviewStats", productId] });
      queryClient.invalidateQueries({ queryKey: ["canReview", productId] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to submit review";
      Toast.show({ type: "error", text1: "Error", text2: message, position: "top" });
    },
  });
};

// Edit an existing review
export const useEditReview = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reviewId,
      rating,
      comment,
    }: {
      reviewId: string;
      rating: number;
      comment: string;
    }) => {
      const res = await api.put(`/api/v1/reviews/${reviewId}`, {
        rating,
        comment,
      });
      return res.data;
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Review updated!",
        position: "top",
      });
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["reviewStats", productId] });
      queryClient.invalidateQueries({ queryKey: ["canReview", productId] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update review";
      Toast.show({ type: "error", text1: "Error", text2: message, position: "top" });
    },
  });
};

// Delete a review
export const useDeleteReview = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await api.delete(`/api/v1/reviews/${reviewId}`);
      return res.data;
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Review deleted",
        position: "top",
      });
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["reviewStats", productId] });
      queryClient.invalidateQueries({ queryKey: ["canReview", productId] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to delete review";
      Toast.show({ type: "error", text1: "Error", text2: message, position: "top" });
    },
  });
};
