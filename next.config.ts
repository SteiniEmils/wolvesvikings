import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  experimental: {
    proxyClientMaxBodySize: "12mb",
  },
};

export default nextConfig;
