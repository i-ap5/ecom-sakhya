import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "dtcbackend-production-036b.up.railway.app",
      },
      {
        protocol: "https",
        hostname: "dtcbackend-production-4bfb.up.railway.app",
      },
      {
        protocol: "https",
        hostname: "t3.storageapi.dev",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
      },
    ],
  },
};

export default nextConfig;
