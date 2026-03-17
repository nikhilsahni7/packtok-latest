import api, { TokenStorage } from "@/lib/api";
import { useAuthStore, User } from "@/store/auth-store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

interface VendorLoginPayload {
  email: string;
  password: string;
}

interface VendorLoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export function useVendorLogin() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (payload: VendorLoginPayload) => {
      const normalizedPayload = {
        ...payload,
        email: payload.email.trim().toLowerCase(),
      };
      const { data } = await api.post(
        "/api/v1/auth/login-vendor",
        normalizedPayload,
      );

      if (data?.data) {
        return data.data as VendorLoginResponse;
      }

      return data as VendorLoginResponse;
    },
    onSuccess: async ({ accessToken, refreshToken, user }) => {
      await TokenStorage.setAccessToken(accessToken);
      if (refreshToken) {
        await TokenStorage.setRefreshToken(refreshToken);
      }
      setUser(user);
      Toast.show({
        type: "success",
        text1: "Vendor Login Successful",
        text2: `Welcome back, ${user.name}`,
        position: "top",
        visibilityTime: 3000,
      });
      router.replace("/vendor/dashboard" as any);
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Vendor Login Failed",
        text2:
          error?.response?.data?.message ||
          "Please check your credentials and try again.",
        position: "top",
        visibilityTime: 3500,
      });
    },
  });
}
