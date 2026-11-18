import type { NextConfig } from "next";

const serverUrl = process.env.SERVER_URL;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    if (process.env.NODE_ENV === "production" || !serverUrl) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${serverUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
