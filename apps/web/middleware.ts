import { NextRequest, NextResponse } from "next/server";

// Paths
const VENDOR_PREFIX = "/vendor";
const VENDOR_AUTH_PREFIX = "/auth/vendor";
const VENDOR_DEFAULT = "/vendor/dashboard";
const USER_DEFAULT = "/";

// Helper to detect asset/internal paths to skip
function isPublicAssetOrInternalPath(pathname: string): boolean {
  // Skip next internals and common static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap")
  ) {
    return true;
  }
  // Skip file-like requests (extensions)
  if (/\.(?:css|js|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|map)$/.test(pathname)) {
    return true;
  }
  return false;
}

async function fetchUserAndToken(
  req: NextRequest
): Promise<{ role?: string; accessToken?: string } | null> {
  const cookie = req.cookies.get("refreshToken");
  if (!cookie?.value) return null;

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBase) return null;

  try {
    // 1) Exchange refresh cookie for an access token
    const refreshUrl = `${apiBase}/api/v1/auth/refresh`;
    const refreshRes = await fetch(refreshUrl, {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${cookie.value}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!refreshRes.ok) return null;
    const refreshJson = await refreshRes.json();
    const accessToken: string | undefined = refreshJson?.data?.accessToken;
    if (!accessToken) return null;

    // 2) Fetch the current user using the access token
    const meUrl = `${apiBase}/api/v1/auth/me`;
    const res = await fetch(meUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    // Expect shape: { data: { role: string, ... } }
    const user = json?.data;
    if (!user) return null;
    return { role: user.role, accessToken };
  } catch (_) {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static assets and internal paths
  if (isPublicAssetOrInternalPath(pathname)) {
    return NextResponse.next();
  }

  const userInfo = await fetchUserAndToken(req);
  const isVendorPath = pathname.startsWith(VENDOR_PREFIX);
  const isVendorAuthPath = pathname.startsWith(VENDOR_AUTH_PREFIX);

  // Unauthenticated
  if (!userInfo?.role) {
    if (isVendorPath) {
      const url = req.nextUrl.clone();
      url.pathname = `${VENDOR_AUTH_PREFIX}/signin`;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const role = userInfo.role;

  // Authenticated as Vendor
  if (role === "VENDOR" || role === "vendor") {
    // Vendors can access both vendor and normal routes; only redirect from vendor auth pages
    if (isVendorAuthPath) {
      const url = req.nextUrl.clone();
      url.pathname = VENDOR_DEFAULT;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Authenticated as Normal User (non-vendor)
  if (isVendorPath) {
    const url = req.nextUrl.clone();
    url.pathname = USER_DEFAULT;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except next internals and static assets; fine-tuned again in code
  matcher: [
    "/((?!_next|.*\\.(?:css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|map)$).*)",
  ],
};
