import { NextRequest, NextResponse } from "next/server";

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

/**
 * Next.js 16 proxy – light traffic routing only.
 *
 * Auth for vendor routes has been moved to the client-side vendor layout
 * because on production the API (api.packtok.com) sets the refreshToken
 * cookie on its own domain, which the browser does NOT send to the web-app
 * domain. Trying to read the cookie here always fails in cross-domain
 * deployments.
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static assets and internal paths
  if (isPublicAssetOrInternalPath(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/vendor/:path*", "/auth/vendor/:path*"],
};
