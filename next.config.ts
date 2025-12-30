import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '60mb', // Increased to 60MB for even safer buffer
    },
    proxyClientMaxBodySize: 62914560, // 60MB in bytes for proxy/middleware limit
  },
};

export default nextConfig;
