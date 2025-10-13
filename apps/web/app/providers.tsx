"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
// @ts-ignore - only imported in dev
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function AuthBootstrap() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (accessToken) return;
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
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [accessToken, setAccessToken, setUser]);


  useEffect(() => {
    const allowContextMenu = (e:any) => e.stopPropagation();
    document.addEventListener('contextmenu', allowContextMenu);
  
    const allowKeyboard = (e:any) => e.stopPropagation();
    document.addEventListener('keydown', allowKeyboard);
  
    return () => {
      document.removeEventListener('contextmenu', allowContextMenu);
      document.removeEventListener('keydown', allowKeyboard);
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
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap />
      {children}
      <Toaster position="top-right" />
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
