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
        const { data } = await api.post("/api/v1/auth/refresh");
        const newToken = data?.data?.accessToken as string | undefined;
        if (cancelled) return;
        if (newToken) {
          setAccessToken(newToken);
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
  }, [accessToken, setAccessToken, setUser, hasBootstrapped]);

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
            staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh longer
            gcTime: 10 * 60 * 1000, // 10 minutes - cache cleanup time
            refetchOnWindowFocus: false, // Don't refetch when user returns to tab
            refetchOnReconnect: false, // Don't refetch on reconnect
          },
        },
      })
  );

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
