import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../store/auth-store";

export function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const { isAuthenticated, hasHydrated, user } = useAuthStore();

  useEffect(() => {
    // Wait for both hydration and navigation state to be ready
    if (!hasHydrated || !navigationState?.key) return;

    const currentSegment = segments[segments.length - 1];

    // Define auth-only pages (logged out users only)
    const authOnlyPages = [
      "login",
      "signup-user",
      "signup-vendor",
      "auth-selection",
      "welcome",
      "welcome2",
      "welcome3",
    ];

    // Define protected pages (logged in users only)
    const protectedPages = ["(tabs)", "modal"];
    const isProtectedPage = protectedPages.includes(segments[0] as string);
    const isVendorPage = segments[0] === "vendor";
    const vendorPublicPages = ["signin"];
    const isVendorPublicPage =
      isVendorPage && vendorPublicPages.includes(currentSegment as string);
    const isAuthPage = authOnlyPages.includes(currentSegment as string);

    // Logged out user trying to access protected pages
    if (!isAuthenticated && isProtectedPage) {
      console.log("🔒 Unauthenticated user blocked from:", segments.join("/"));
      router.replace("/auth-selection");
      return;
    }

    // Logged out user trying to access vendor pages
    if (!isAuthenticated && isVendorPage && !isVendorPublicPage) {
      console.log("🔒 Unauthenticated user blocked from:", segments.join("/"));
      router.replace("/auth-selection");
      return;
    }

    // Authenticated non-vendor user trying to access vendor pages
    if (isAuthenticated && isVendorPage && user?.role !== "VENDOR") {
      router.replace("/(tabs)");
      return;
    }

    // Logged in user trying to access auth-only pages
    if (isAuthenticated && isAuthPage) {
      console.log("✅ Authenticated user redirected from:", segments.join("/"));
      router.replace("/(tabs)");
      return;
    }
  }, [
    isAuthenticated,
    segments,
    hasHydrated,
    navigationState?.key,
    router,
    user?.role,
  ]);
}
