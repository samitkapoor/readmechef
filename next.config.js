/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      }
    ],
    domains: ['avatars.githubusercontent.com']
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
  },
  webpack: (config) => {
    return config;
  }
};

module.exports = nextConfig;
