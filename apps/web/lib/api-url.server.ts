// Server-only API origin (Server Components, server auth helpers).
// API_BASE_URL has no NEXT_PUBLIC_ prefix, so it is never sent to the
// browser. Falls back to the public var, then to local dev.
export function getServerApiBaseUrl(): string {
  return (
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:3001"
  );
}
