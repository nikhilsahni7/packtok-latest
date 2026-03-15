import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

// Types
export interface RazorpayOrderInfo {
  id: string;
  amount: number;
  currency: string;
  receipt?: string | null;
  status: string;
}

export interface CreateOrderResult {
  order: {
    id: string;
    orderNumber: string;
    totalAmount: string;
    currency: string;
    status: string;
  };
  razorpayOrder: RazorpayOrderInfo;
  razorpayKey: string;
}

export interface VerifyPaymentPayload {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface OrderItem {
  id: string;
  productTitle: string;
  productPrice: string;
  quantity: number;
  totalPrice: string;
  currency: string;
  productSnapshot: {
    id: string;
    title: string;
    price: string;
    imagesThumbnail?: string | null;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: string;
  tax: string;
  shippingCost: string;
  totalAmount: string;
  currency: string;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  shippingPhone?: string;
  customerNotes?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  invoiceUrl?: string;
  statusHistory?: {
    id: string;
    status: string;
    notes?: string;
    createdAt: string;
  }[];
  createdAt: string;
  items: OrderItem[];
}

// ===== Create Order (from cart) =====
export const useCreateOrder = () => {
  return useMutation<CreateOrderResult, Error, { addressId: string; customerNotes?: string }>({
    mutationFn: async ({ addressId, customerNotes }) => {
      const res = await api.post("/api/v1/orders", {
        addressId,
        customerNotes,
      });
      return res.data.data as CreateOrderResult;
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to create order";
      Toast.show({
        type: "error",
        text1: "Checkout Failed",
        text2: message,
        position: "top",
        visibilityTime: 3000,
      });
    },
  });
};

// ===== Verify Razorpay Payment =====
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: VerifyPaymentPayload) => {
      const res = await api.post("/api/v1/orders/verify-payment", payload);
      return res.data.data;
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Payment Successful! 🎉",
        text2: "Your order has been placed successfully.",
        position: "top",
        visibilityTime: 4000,
      });
      // Clear cart cache and refresh orders
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Payment verification failed";
      Toast.show({
        type: "error",
        text1: "Payment Failed",
        text2: message,
        position: "top",
        visibilityTime: 3000,
      });
    },
  });
};

// ===== Get User Orders =====
export const useMyOrders = () => {
  return useQuery<{ orders: Order[]; total: number }>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get("/api/v1/orders");
      if (res.data?.statusCode === 200 && res.data?.data) {
        return res.data.data;
      }
      return { orders: [], total: 0 };
    },
    staleTime: 1000 * 60,
  });
};

// ===== Cancel Order =====
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, reason }: { orderId: string; reason: string }) => {
      const res = await api.post(`/api/v1/orders/${orderId}/cancel`, {
        reason,
      });
      return res.data.data;
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Order Cancelled",
        position: "top",
        visibilityTime: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to cancel order";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
        position: "top",
      });
    },
  });
};
