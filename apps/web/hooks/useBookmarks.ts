"use client";

import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export interface BookmarkProduct {
  id: string;
  title: string;
  price: string;
  currency: string;
  images: string[];
  imagesThumbnail?: string;
  productType: string;
  condition: string;
  manufacturer?: string;
  model?: string;
  quantity: number;
  displayPrice?: boolean;
  cartEnabled?: boolean;
  category: {
    id: string;
    name: string;
  };
  subCategory?: string;
}

export interface Bookmark {
  id: string;
  createdAt: string;
  productId: string;
  product: BookmarkProduct;
}

interface BookmarksResponse {
  bookmarks: Bookmark[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Hook to manage the user's wishlist/bookmarks list (fetching, pagination)
 */
export function useBookmarks(page = 1, limit = 20) {
  const [data, setData] = useState<BookmarksResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);

  const fetchBookmarks = useCallback(async () => {
    if (!user) {
      setData(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<{ data: BookmarksResponse }>(
        `/api/v1/user-tracking/bookmarks?page=${page}&limit=${limit}`
      );
      setData(res.data.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch wishlist");
    } finally {
      setIsLoading(false);
    }
  }, [user, page, limit]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return { data, isLoading, error, refetch: fetchBookmarks };
}

/**
 * Hook to toggle bookmark status for a single product
 */
export function useBookmarkToggle(productId: string) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const user = useAuthStore((s) => s.user);

  // Check initial bookmark status
  useEffect(() => {
    if (!user || !productId) {
      setIsBookmarked(false);
      setIsChecking(false);
      return;
    }

    let cancelled = false;
    const checkStatus = async () => {
      try {
        const res = await api.get<{ data: { isBookmarked: boolean } }>(
          `/api/v1/user-tracking/bookmarks/check/${productId}`
        );
        if (!cancelled) {
          setIsBookmarked(res.data.data.isBookmarked);
        }
      } catch {
        // Silently fail - assume not bookmarked
      } finally {
        if (!cancelled) setIsChecking(false);
      }
    };
    checkStatus();

    return () => {
      cancelled = true;
    };
  }, [user, productId]);

  const toggle = useCallback(async () => {
    if (!user) {
      toast.error("Please sign in to add to wishlist");
      return;
    }
    if (isLoading) return;

    const wasBookmarked = isBookmarked;
    // Optimistic update
    setIsBookmarked(!wasBookmarked);
    setIsLoading(true);

    try {
      if (wasBookmarked) {
        await api.delete(`/api/v1/user-tracking/bookmarks/${productId}`);
        toast.success("Removed from wishlist");
      } else {
        await api.post("/api/v1/user-tracking/bookmarks", { productId });
        toast.success("Added to wishlist");
      }
    } catch (err: any) {
      // Rollback on error
      setIsBookmarked(wasBookmarked);
      toast.error(err?.response?.data?.message || "Failed to update wishlist");
    } finally {
      setIsLoading(false);
    }
  }, [user, productId, isBookmarked, isLoading]);

  return { isBookmarked, isLoading: isLoading || isChecking, toggle };
}
