/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rcppgcrtnawltqbdpwsz.supabase.co",
        port: "",
        pathname: "/storage/v1/object/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
  // Enable experimental features if needed
  experimental: {
    // serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  output: 'standalone',
};

module.exports = nextConfig;
