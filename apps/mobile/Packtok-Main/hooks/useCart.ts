import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

// Types matching the API response
export interface CartProduct {
  id: string;
  title: string;
  price: string;
  currency: string;
  imagesThumbnail?: string | null;
  quantity: number; // available stock
  status: string;
  cartEnabled: boolean;
  productType: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  productId: string;
  product: CartProduct;
}

export interface Cart {
  cartId: string;
  itemCount: number;
  uniqueProducts: number;
  currencyTotals: Record<string, { count: number; total: number }>;
  items: CartItem[];
}

// ===== Queries =====

export const useCartQuery = () => {
  return useQuery<Cart | null>({
    queryKey: ["cart"],
    queryFn: async () => {
      try {
        const res = await api.get("/api/v1/cart");
        if (res.data?.statusCode === 200 && res.data?.data) {
          return res.data.data as Cart;
        }
        return null;
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 30,
    refetchOnMount: "always",
  });
};

// Derived values
export const useCartItemCount = () => {
  const { data: cart } = useCartQuery();
  return cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
};

export const useCartTotalsByCurrency = () => {
  const { data: cart } = useCartQuery();
  if (!cart?.items?.length) return {};
  return cart.items.reduce((acc, item) => {
    const cur = item.product.currency || "INR";
    const price = parseFloat(item.product.price);
    acc[cur] = (acc[cur] || 0) + price * item.quantity;
    return acc;
  }, {} as Record<string, number>);
};

// ===== Mutations =====

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      quantity = 1,
    }: {
      productId: string;
      quantity?: number;
    }) => {
      const res = await api.post("/api/v1/cart/items", {
        productId,
        quantity,
      });
      return res.data;
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Added to Cart!",
        text2: "Product has been added to your cart.",
        position: "top",
        visibilityTime: 2000,
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to add to cart";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
        position: "top",
        visibilityTime: 3000,
      });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      const res = await api.patch(`/api/v1/cart/items/${productId}`, {
        quantity,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update quantity";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
        position: "top",
      });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.delete(`/api/v1/cart/items/${productId}`);
      return res.data;
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Removed from Cart",
        position: "top",
        visibilityTime: 1500,
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to remove item";
      Toast.show({ type: "error", text1: "Error", text2: message, position: "top" });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await api.delete("/api/v1/cart");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
