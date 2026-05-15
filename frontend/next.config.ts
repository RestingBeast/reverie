import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [
      new URL("https://i.scdn.co/image/**"),
      new URL("https://picsum.photos/**"),
    ],
  },
};

export default nextConfig;
