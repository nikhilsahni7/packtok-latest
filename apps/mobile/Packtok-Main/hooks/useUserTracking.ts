import api, { TokenStorage } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

// Hook to check authentication status
export const useIsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await TokenStorage.getAccessToken();
        setIsAuthenticated(!!token);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, isChecking };
};

// ===== TYPES =====

export interface Bookmark {
  id: string;
  createdAt: string;
  updatedAt: string;
  productId: string;
  product: {
    id: string;
    title: string;
    description: string;
    price?: number;
    condition: string;
    images: string[];
    imagesThumbnail?: string;
    category: {
      id: string;
      name: string;
    };
  };
}

export interface SearchHistoryItem {
  id: string;
  createdAt: string;
  searchTerm: string;
  filters?: any;
  resultsCount?: number;
}

export interface ProductView {
  id: string;
  createdAt: string;
  viewedAt: string;
  durationSeconds?: number;
  productId: string;
  product: {
    id: string;
    title: string;
    description: string;
    price?: number;
    condition: string;
    images: string[];
    imagesThumbnail?: string;
    category: {
      id: string;
      name: string;
    };
  };
}

export interface ActivitySummary {
  bookmarks: number;
  searches: number;
  views: number;
  recentSearches: SearchHistoryItem[];
}

// ===== BOOKMARKS / WISHLIST =====

export const useBookmarks = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ["bookmarks", page, limit],
    queryFn: async () => {
      try {
        const response = await api.get(
          `/api/v1/user-tracking/bookmarks?page=${page}&limit=${limit}`
        );
        return response.data.data;
      } catch (error: any) {
        console.error(
          "Error fetching bookmarks:",
          error.response?.data || error.message
        );
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAddBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.post("/api/v1/user-tracking/bookmarks", {
        productId,
      });
      return response.data.data;
    },
    onMutate: async (productId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["bookmark-check", productId] });
      // Snapshot previous value
      const previousStatus = queryClient.getQueryData(["bookmark-check", productId]);
      // Optimistically update
      queryClient.setQueryData(["bookmark-check", productId], { isBookmarked: true });
      return { previousStatus, productId };
    },
    onError: (_err, productId, context) => {
      // Rollback on error
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(["bookmark-check", productId], context.previousStatus);
      }
    },
    onSettled: (_data, _err, productId) => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["bookmark-check", productId] });
      queryClient.invalidateQueries({ queryKey: ["activity-summary"] });
    },
  });
};

export const useRemoveBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.delete(
        `/api/v1/user-tracking/bookmarks/${productId}`
      );
      return response.data.data;
    },
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: ["bookmark-check", productId] });
      const previousStatus = queryClient.getQueryData(["bookmark-check", productId]);
      queryClient.setQueryData(["bookmark-check", productId], { isBookmarked: false });
      return { previousStatus, productId };
    },
    onError: (_err, productId, context) => {
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(["bookmark-check", productId], context.previousStatus);
      }
    },
    onSettled: (_data, _err, productId) => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["bookmark-check", productId] });
      queryClient.invalidateQueries({ queryKey: ["activity-summary"] });
    },
  });
};

export const useCheckBookmark = (productId: string) => {
  return useQuery({
    queryKey: ["bookmark-check", productId],
    queryFn: async () => {
      const response = await api.get(
        `/api/v1/user-tracking/bookmarks/check/${productId}`
      );
      return response.data.data;
    },
    enabled: !!productId,
  });
};

// ===== SEARCH HISTORY =====

export const useTrackSearch = () => {
  return useMutation({
    mutationFn: async ({
      searchTerm,
      filters,
      resultsCount,
    }: {
      searchTerm: string;
      filters?: any;
      resultsCount?: number;
    }) => {
      const response = await api.post("/api/v1/user-tracking/search-history", {
        searchTerm,
        filters,
        resultsCount,
      });
      return response.data.data;
    },
  });
};

export const useSearchHistory = (
  page: number = 1,
  limit: number = 20,
  unique: boolean = true
) => {
  return useQuery({
    queryKey: ["search-history", page, limit, unique],
    queryFn: async () => {
      const response = await api.get(
        `/api/v1/user-tracking/search-history?page=${page}&limit=${limit}&unique=${unique}`
      );
      return response.data.data;
    },
  });
};

export const usePopularSearches = (limit: number = 10) => {
  return useQuery({
    queryKey: ["popular-searches", limit],
    queryFn: async () => {
      const response = await api.get(
        `/api/v1/user-tracking/search-history/popular?limit=${limit}`
      );
      return response.data.data;
    },
  });
};

export const useClearSearchHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete("/api/v1/user-tracking/search-history");
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
      queryClient.invalidateQueries({ queryKey: ["popular-searches"] });
      queryClient.invalidateQueries({ queryKey: ["activity-summary"] });
    },
  });
};

// ===== PRODUCT VIEW HISTORY =====

export const useTrackProductView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      durationSeconds,
    }: {
      productId: string;
      durationSeconds?: number;
    }) => {
      const response = await api.post("/api/v1/user-tracking/views", {
        productId,
        durationSeconds,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recently-viewed"] });
      queryClient.invalidateQueries({ queryKey: ["activity-summary"] });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });
};

export const useRecentlyViewed = (
  page: number = 1,
  limit: number = 20,
  unique: boolean = true
) => {
  return useQuery({
    queryKey: ["recently-viewed", page, limit, unique],
    queryFn: async () => {
      const response = await api.get(
        `/api/v1/user-tracking/views?page=${page}&limit=${limit}&unique=${unique}`
      );
      return response.data.data;
    },
  });
};

export const useClearViewHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete("/api/v1/user-tracking/views");
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recently-viewed"] });
      queryClient.invalidateQueries({ queryKey: ["activity-summary"] });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });
};

// ===== RECOMMENDATIONS =====

export const useRecommendations = (limit: number = 10) => {
  return useQuery({
    queryKey: ["recommendations", limit],
    queryFn: async () => {
      const response = await api.get(
        `/api/v1/user-tracking/recommendations?limit=${limit}`
      );
      return response.data.data;
    },
  });
};

// ===== ANALYTICS / INSIGHTS =====

export const useActivitySummary = () => {
  return useQuery<ActivitySummary>({
    queryKey: ["activity-summary"],
    queryFn: async () => {
      const response = await api.get("/api/v1/user-tracking/activity-summary");
      return response.data.data;
    },
  });
};
