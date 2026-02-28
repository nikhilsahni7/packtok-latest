"use client";

import { User } from "@/types/auth";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      setUser: (user) => set({ user }),
      logout: async () => {
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/logout`,
            {
              method: "POST",
              credentials: "include",
            }
          );
        } catch (_) {
          // ignore
        }
        set({ accessToken: null, refreshToken: null, user: null });
        // Invalidate persisted storage
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-store");
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);

// Helper: know when Zustand has rehydrated after persistence (for SSR)
export function useHasHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
