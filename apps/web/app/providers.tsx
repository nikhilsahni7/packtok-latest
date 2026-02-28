"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
// @ts-ignore - only imported in dev
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { FloatingCartBar } from "@/components/cart/floating-cart-bar";
import { CartProvider } from "@/contexts/cart-context";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function AuthBootstrap() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setRefreshToken = useAuthStore((s) => s.setRefreshToken);
  const setUser = useAuthStore((s) => s.setUser);
  const [hasBootstrapped, setHasBootstrapped] = useState(false);

  useEffect(() => {
    // Only bootstrap once per session
    if (hasBootstrapped) return;

    let cancelled = false;

    async function bootstrap() {
      if (accessToken) {
        setHasBootstrapped(true);
        return;
      }
      try {
        const storedRefreshToken = useAuthStore.getState().refreshToken;
        const { data } = await api.post("/api/v1/auth/refresh", {
          refreshToken: storedRefreshToken,
        });
        const newToken = data?.data?.accessToken as string | undefined;
        const newRefreshToken = data?.data?.refreshToken as string | undefined;
        if (cancelled) return;
        if (newToken) {
          setAccessToken(newToken);
          if (newRefreshToken) {
            setRefreshToken(newRefreshToken);
          }
          try {
            const me = await api.get("/api/v1/auth/me");
            if (!cancelled) setUser(me?.data?.data ?? null);
          } catch (_) {
            // ignore user fetch errors; token is set and future calls can hydrate
          }
        }
      } catch (_) {
        // No valid refresh cookie; do nothing
      } finally {
        if (!cancelled) setHasBootstrapped(true);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [accessToken, setAccessToken, setRefreshToken, setUser, hasBootstrapped]);

  useEffect(() => {
    const allowContextMenu = (e: Event) => e.stopPropagation();
    document.addEventListener("contextmenu", allowContextMenu);

    const allowKeyboard = (e: KeyboardEvent) => e.stopPropagation();
    document.addEventListener("keydown", allowKeyboard);

    return () => {
      document.removeEventListener("contextmenu", allowContextMenu);
      document.removeEventListener("keydown", allowKeyboard);
    };
  }, []);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      })
  );

  // Optional: Add specific staleTime for auction queries after hydration
  useEffect(() => {
    queryClient.setQueryDefaults(["auction"], {
      staleTime: 5000, // 5 seconds for auctions
    });
    queryClient.setQueryDefaults(["auctions"], {
      staleTime: 20000, // 20 seconds for lists
    });
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <AuthBootstrap />
        {children}
        <CartSidebar />
        <FloatingCartBar />
        <Toaster position="top-right" />
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </CartProvider>
    </QueryClientProvider>
  );
}
