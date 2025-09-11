/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ["@packtok/ui"],
  images: {
    domains: ["localhost", "rcppgcrtnawltqbdpwsz.supabase.co"],
    unoptimized: false,
  },
  output: 'standalone',
};

module.exports = nextConfig;
