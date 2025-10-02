import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import api, { TokenStorage } from "../lib/api";
import { useAuthStore, User } from "../store/auth-store";

interface LoginPayload {
  email: string;
  password: string;
}

interface ApiLoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      try {
        const { data } = await api.post("/api/v1/auth/login", payload);

        // Handle both possible response formats
        let responseData: ApiLoginResponse;
        if (data.data) {
          responseData = data.data;
        } else if (data.accessToken) {
          responseData = data;
        } else {
          throw new Error("Unexpected API response format");
        }

        return responseData;
      } catch (error: any) {
        console.error("Login error:", error);
        throw error;
      }
    },
    onSuccess: async ({ accessToken, refreshToken, user }) => {
      try {
        // Store tokens securely
        await TokenStorage.setAccessToken(accessToken);
        if (refreshToken) {
          await TokenStorage.setRefreshToken(refreshToken);
        }

        // Update auth state
        setUser(user);

        // Show success message
        Toast.show({
          type: "success",
          text1: "Welcome Back!",
          text2: `Logged in as ${user.name}`,
          position: "top",
          visibilityTime: 3000,
        });

        // Navigate to home
        router.replace("/(tabs)");
      } catch (error) {
        console.error("Error saving auth data:", error);
        Toast.show({
          type: "error",
          text1: "Login Error",
          text2: "Failed to save login data. Please try again.",
          position: "top",
          visibilityTime: 4000,
        });
      }
    },
    onError: (error: any) => {
      console.error("Login failed:", error);

      let errorMessage = "Login failed. Please try again.";
      let errorTitle = "Login Failed";

      // Handle specific error cases
      if (error?.response?.status === 401) {
        errorTitle = "Invalid Credentials";
        errorMessage = "Email or password is incorrect.";
      } else if (error?.response?.status === 403) {
        errorTitle = "Access Denied";
        errorMessage =
          error?.response?.data?.message ||
          "Invalid role for these credentials.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message === "Network Error") {
        errorTitle = "Network Error";
        errorMessage = "Please check your internet connection.";
      }

      Toast.show({
        type: "error",
        text1: errorTitle,
        text2: errorMessage,
        position: "top",
        visibilityTime: 4000,
        topOffset: 60,
      });
    },
  });
}
