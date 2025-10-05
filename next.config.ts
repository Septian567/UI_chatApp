import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Abaikan semua error ESLint saat build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
