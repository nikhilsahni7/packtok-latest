"use client";

import { useQuery } from "@tanstack/react-query";
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
}

export interface AdminUserDetail extends AdminUser {
  addresses: any[];
  orders: any[];
  vendorApplication?: any;
  _count: {
    orders: number;
    quoteRequests: number;
    auctionEnrollments: number;
    auctionBids: number;
    serviceRequests: number;
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
