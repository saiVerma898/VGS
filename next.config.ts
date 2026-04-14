import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Apple App Store images
      { protocol: "https", hostname: "*.mzstatic.com" },
      // TikTok thumbnails
      { protocol: "https", hostname: "*.tiktokcdn.com" },
      { protocol: "https", hostname: "*.tiktokcdn-us.com" },
      { protocol: "https", hostname: "p16-sign-va.tiktokcdn.com" },
      { protocol: "https", hostname: "p16-sign.tiktokcdn-us.com" },
      { protocol: "https", hostname: "p77-sign.tiktokcdn-us.com" },
      // Twitter media images
      { protocol: "https", hostname: "pbs.twimg.com" },
      // Postiz uploads
      { protocol: "https", hostname: "uploads.postiz.com" },
    ],
  },
};

export default nextConfig;
