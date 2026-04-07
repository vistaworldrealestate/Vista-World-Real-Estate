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
      {
        protocol: "https",
        hostname: "*.gstatic.com",
      },
    ],
  },


};

export default nextConfig;
