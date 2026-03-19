import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* your existing config */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
      },
    ],
  },

};

export default nextConfig;
