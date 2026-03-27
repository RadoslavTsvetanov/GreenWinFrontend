import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const raw = process.env.BACKEND_API_URL?.trim() || "http://localhost:3014";
    const backendBase = raw.replace(/\/$/, "").replace(/\/api$/, "");

    return [
      {
        source: "/backend-api/:path*",
        destination: `${backendBase}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
