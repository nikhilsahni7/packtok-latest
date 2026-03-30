"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import api from "../lib/axios";
import { QK } from "../utils/queryKeys";

type NotificationAudience =
  | "ALL_USERS"
  | "NORMAL_USERS"
  | "VENDORS"
  | "ADMINS"
  | "CUSTOM_USERS";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  audience: NotificationAudience;
  targetUserIds: string[];
  actionUrl?: string | null;
  createdAt: string;
  _count?: { reads: number };
};

type NotificationListResponse = {
  data: NotificationItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
};

const parseErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message ?? fallback;

export const useAdminNotifications = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: [...QK.adminNotifications, page, limit],
    queryFn: async (): Promise<NotificationListResponse> => {
      const { data } = await api.get("/api/v1/admins/notifications", {
        params: { page, limit },
      });
      return data.data;
    },
    staleTime: 1000 * 30,
  });
};

export const useSendAdminNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      title: string;
      message: string;
      audience: "ALL_USERS" | "CUSTOM_USERS";
      targetUserIds?: string[];
      actionUrl?: string;
    }) => {
      const { data } = await api.post(
        "/api/v1/admins/notifications/custom",
        payload,
      );
      return data.data ?? data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.adminNotifications });
      toast.success("Notification sent");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error, "Failed to send notification"));
    },
  });
};
