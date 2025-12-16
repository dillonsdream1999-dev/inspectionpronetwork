import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Stripe webhook needs raw body
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
