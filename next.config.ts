import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  serverExternalPackages: ["sharp"],
  outputFileTracingExcludes: {
    "*": ["skills/**", "examples/**", "download/**", "test/**", "upload/**", "*.log", "worklog.md", "bun.lock"],
  },
};

export default nextConfig;
