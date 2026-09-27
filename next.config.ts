import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "r2.thesportsdb.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "www.thesportsdb.com",
        pathname: "/images/**",
      },
    ],
  },
  experimental: {
    proxyClientMaxBodySize: "12mb",
  },
};

export default nextConfig;
