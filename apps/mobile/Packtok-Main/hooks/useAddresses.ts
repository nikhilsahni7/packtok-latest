import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import api from "../lib/api";

export interface Address {
  id: string;
  label: string;
  isDefault: boolean;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressPayload {
  label: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  landmark?: string;
  isDefault?: boolean;
}

export function useMyAddresses() {
  return useQuery<Address[]>({
    queryKey: ["my-addresses"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/api/v1/addresses");
        return data.data as Address[];
      } catch (error: any) {
        console.error("Fetch addresses error:", error);
        throw error;
      }
    },
  });
}

export function useAddressDetails(addressId: string) {
  return useQuery<Address>({
    queryKey: ["address", addressId],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/api/v1/addresses/${addressId}`);
        return data.data as Address;
      } catch (error: any) {
        console.error("Fetch address details error:", error);
        throw error;
      }
    },
    enabled: !!addressId,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation<Address, Error, CreateAddressPayload>({
    mutationFn: async (payload: CreateAddressPayload) => {
      try {
        const { data } = await api.post("/api/v1/addresses", payload);
        return data.data as Address;
      } catch (error: any) {
        console.error("Create address error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Address Added!",
        text2: "Your address has been saved successfully.",
        position: "top",
        visibilityTime: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["my-addresses"] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to add address";
      Toast.show({
        type: "error",
        text1: "Failed to Add Address",
        text2: message,
        position: "top",
        visibilityTime: 3000,
      });
    },
  });
}

export function useUpdateAddress(addressId: string) {
  const queryClient = useQueryClient();

  return useMutation<Address, Error, Partial<CreateAddressPayload>>({
    mutationFn: async (payload: Partial<CreateAddressPayload>) => {
      try {
        const { data } = await api.put(
          `/api/v1/addresses/${addressId}`,
          payload
        );
        return data.data as Address;
      } catch (error: any) {
        console.error("Update address error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Address Updated!",
        text2: "Your address has been updated successfully.",
        position: "top",
        visibilityTime: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["my-addresses"] });
      queryClient.invalidateQueries({ queryKey: ["address", addressId] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update address";
      Toast.show({
        type: "error",
        text1: "Failed to Update Address",
        text2: message,
        position: "top",
        visibilityTime: 3000,
      });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (addressId: string) => {
      try {
        await api.delete(`/api/v1/addresses/${addressId}`);
      } catch (error: any) {
        console.error("Delete address error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Address Deleted!",
        text2: "Your address has been removed successfully.",
        position: "top",
        visibilityTime: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["my-addresses"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to delete address";
      Toast.show({
        type: "error",
        text1: "Failed to Delete Address",
        text2: message,
        position: "top",
        visibilityTime: 3000,
      });
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation<Address, Error, string>({
    mutationFn: async (addressId: string) => {
      try {
        const { data } = await api.patch(
          `/api/v1/addresses/${addressId}/set-default`
        );
        return data.data as Address;
      } catch (error: any) {
        console.error("Set default address error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Default Address Set!",
        text2: "This address is now your default shipping address.",
        position: "top",
        visibilityTime: 2000,
      });
      queryClient.invalidateQueries({ queryKey: ["my-addresses"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to set default address";
      Toast.show({
        type: "error",
        text1: "Failed",
        text2: message,
        position: "top",
        visibilityTime: 3000,
      });
    },
  });
}
