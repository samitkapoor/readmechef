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
  }
};

module.exports = nextConfig;
