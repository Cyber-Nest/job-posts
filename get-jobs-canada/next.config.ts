import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features
  experimental: {
    // serverActions are enabled by default in Next.js 15
  },

  serverExternalPackages: ["pdfkit"],

  // Allow images from external domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  // Redirect old /api/auth paths if needed
  async rewrites() {
    return [];
  },
};

export default nextConfig;
