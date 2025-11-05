import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { TokenStorage } from "../lib/api";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone_number?: string;
  country?: string;
  profile_image?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  logout: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      hasHydrated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      setIsLoading: (isLoading) => set({ isLoading }),

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),

      logout: async () => {
        try {
          // Clear secure tokens
          await TokenStorage.clearTokens();

          // Clear async storage
          await AsyncStorage.removeItem("auth-storage");

          // Reset state
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error("Logout error:", error);
          // Still clear state even if there's an error
          set({ user: null, isAuthenticated: false });
        }
      },

      clearAuth: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setIsLoading(false);
        state?.setHasHydrated(true);
      },
    }
  )
);
