// Browser-side API origin.
//
// NEXT_PUBLIC_* values are inlined into the client bundle at build time by
// design — this is a public URL, not a secret (it is equally visible in the
// browser's network tab). Never put real secrets in NEXT_PUBLIC_* variables.
//
// Set NEXT_PUBLIC_API_BASE_URL in Vercel (e.g. https://api.packtok.com) and
// redeploy after changing it: the value is baked in at build time.
export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
