"use client";

import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

// Types
export interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: string;
    currency: string;
    imagesThumbnail?: string;
    quantity: number; // available stock
  };
}

export interface Cart {
  id: string;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  totalAmount: number;
  currency: string;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const prevUserRef = useRef(user);

  const refreshCart = useCallback(async () => {
    try {
      const response = await api.get<{ data: Cart }>("/api/v1/cart");
      setCart(response.data.data);
    } catch (error) {
      // User might not be logged in
      setCart(null);
    }
  }, []);

  // React to auth state changes (login/logout)
  useEffect(() => {
    const prevUser = prevUserRef.current;
    prevUserRef.current = user;

    if (!user && prevUser) {
      // User logged out — clear cart immediately
      setCart(null);
      setIsOpen(false);
    } else if (user && !prevUser) {
      // User logged in — fetch their cart
      refreshCart();
    }
  }, [user, refreshCart]);

  // Initial cart fetch (only when user is already logged in on mount)
  useEffect(() => {
    if (user) {
      refreshCart();
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const totalAmount =
    cart?.items.reduce(
      (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
      0
    ) || 0;

  const currency = cart?.items[0]?.product.currency || "INR";

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = async (productId: string, quantity = 1) => {
    // Optimistic update would require product details which we don't have here
    // but we can at least open the cart immediately
    setIsOpen(true);
    setIsLoading(true);
    try {
      await api.post("/api/v1/cart/items", { productId, quantity });
      await refreshCart();
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const previousCart = cart;
    if (cart) {
      setCart({
        ...cart,
        items: cart.items.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      });
    }

    try {
      await api.patch(`/api/v1/cart/items/${productId}`, { quantity });
      // No need to refresh immediately if we are confident, but better to be safe
      await refreshCart();
    } catch (error) {
      setCart(previousCart); // Rollback
    }
  };

  const removeFromCart = async (productId: string) => {
    const previousCart = cart;
    if (cart) {
      setCart({
        ...cart,
        items: cart.items.filter((item) => item.product.id !== productId),
      });
    }

    try {
      await api.delete(`/api/v1/cart/items/${productId}`);
      await refreshCart();
    } catch (error) {
      setCart(previousCart); // Rollback
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      await api.delete("/api/v1/cart");
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        itemCount,
        totalAmount,
        currency,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
