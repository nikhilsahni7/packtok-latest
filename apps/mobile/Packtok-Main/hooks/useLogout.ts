import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/auth-store";

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await logout();
      // Clear all cached queries so stale data from the previous user
      // is not shown to the newly logged-in user
      queryClient.clear();
    },
    onSuccess: () => {
      // Navigate to auth selection after logout (not welcome screens)
      // This follows best practices - returning users go straight to login
      router.replace("/auth-selection");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Still navigate to auth selection even if there's an error
      router.replace("/auth-selection");
    },
  });
}
