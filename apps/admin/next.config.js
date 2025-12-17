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
  },
  output: 'standalone',
};

module.exports = nextConfig;
