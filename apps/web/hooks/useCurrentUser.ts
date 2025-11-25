"use client";

import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import { User } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser);
  // Use reactive selector instead of getState() to properly re-enable query after hydration
  const accessToken = useAuthStore((s) => s.accessToken);

  const query = useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/auth/me");
      return data.data as User;
    },
    enabled: Boolean(accessToken),
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Sync Zustand on data change
  useEffect(() => {
    if (query.data) setUser(query.data);
  }, [query.data, setUser]);

  return query;
}
