import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "soft-zoom-63098134.figma.site",
      },
    ],
  },
};

export default nextConfig;
