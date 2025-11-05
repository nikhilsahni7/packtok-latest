import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import api from "../lib/api";
import { useAuthStore } from "../store/auth-store";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone_number?: string;
  country?: string;
  profile_image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserInput {
  name?: string;
  phone_number?: string;
  country?: string;
  profile_image?: {
    uri: string;
    type: string;
    name: string;
  };
}

export function useCurrentUser() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const query = useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/auth/me");
      return data.data as User;
    },
    enabled: Boolean(user),
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Sync with auth store when data changes
  if (query.data && query.data !== user) {
    setUser(query.data);
  }

  return query;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (input: UpdateUserInput) => {
      // Create FormData for multipart upload
      const formData = new FormData();

      if (input.name) formData.append("name", input.name);
      if (input.phone_number)
        formData.append("phone_number", input.phone_number);
      if (input.country) formData.append("country", input.country);

      // Add profile image if provided
      if (input.profile_image) {
        formData.append("profile_image", {
          uri: input.profile_image.uri,
          type: input.profile_image.type,
          name: input.profile_image.name,
        } as any);
      }

      const { data } = await api.patch("/api/v1/auth/me", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data.data as User;
    },
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(["me"], data);
      // Update auth store
      setUser(data);
      Alert.alert("Success", "Profile updated successfully");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update profile"
      );
    },
  });
}
