import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type NotificationType =
  | "PRODUCT_LIVE"
  | "PODCAST_LIVE"
  | "ARTICLE_PUBLISHED"
  | "AUCTION_PRODUCT_ADDED"
  | "AUCTION_LIVE"
  | "SYSTEM"
  | "CUSTOM";

export interface AppNotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  payload?: Record<string, unknown> | null;
  actionUrl?: string | null;
  createdAt: string;
  read: boolean;
  readAt?: string | null;
}

export interface NotificationsResponse {
  data: AppNotificationItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    unreadCount: number;
    hasNext: boolean;
  };
}

export const useNotifications = (tab: "all" | "unread") => {
  return useQuery<NotificationsResponse>({
    queryKey: ["notifications", tab],
    queryFn: async () => {
      const response = await api.get(
        `/api/v1/notifications?tab=${tab}&page=1&limit=50`
      );
      return response.data.data;
    },
    staleTime: 30 * 1000,
  });
};

export const useUnreadNotificationsCount = () => {
  return useQuery<number>({
    queryKey: ["notifications-unread-count"],
    queryFn: async () => {
      const response = await api.get("/api/v1/notifications/unread-count");
      return response.data.data.unreadCount || 0;
    },
    staleTime: 30 * 1000,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      await api.patch(`/api/v1/notifications/${notificationId}/read`);
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch("/api/v1/notifications/read-all");
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
  });
};
