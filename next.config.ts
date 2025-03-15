import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      }
    ]
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
};

export default nextConfig;
