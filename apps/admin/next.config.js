/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@packtok/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "rcppgcrtnawltqbdpwsz.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
  },
  output: 'standalone',
  // Reduce bundle size in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },
};

module.exports = nextConfig;
