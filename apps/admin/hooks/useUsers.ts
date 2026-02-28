"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import api from "../lib/axios";
import { QK } from "../utils/queryKeys";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone_number: string | null;
  role: string;
  createdAt: string;
  profile_image: string | null;
  country: string | null;
}

export interface AdminUserDetail extends AdminUser {
  updatedAt: string;
  addresses: any[];
  orders: any[];
  vendorApplication?: any;
  _count: {
    orders: number;
    quoteRequests: number;
    auctionEnrollments: number;
    auctionBids: number;
    serviceRequests: number;
    bookmarks: number;
    searchHistory: number;
    viewHistory: number;
    productReviews: number;
    createdProducts: number;
  };
}

export const useAdminUsers = () => {
  return useQuery({
    queryKey: QK.customers,
    queryFn: async (): Promise<AdminUser[]> => {
      const { data } = await api.get("/api/v1/admins/users");
      return data.data ?? data;
    },
  });
};

export const useAdminUser = (userId: string | null | undefined) => {
  return useQuery({
    queryKey: [...QK.customers, userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<AdminUserDetail> => {
      const { data } = await api.get(`/api/v1/admins/users/${userId}`);
      return data.data ?? data;
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        phone_number?: string | null;
        role?: string;
        country?: string | null;
      };
    }) => {
      const res = await api.put(`/api/v1/admins/users/${id}`, data);
      return res.data.data ?? res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.customers });
      toast.success("User updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update user"
      );
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/admins/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.customers });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete user"
      );
    },
  });
};
