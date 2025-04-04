/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      }
    ],
    domains: ['avatars.githubusercontent.com'],
    // Optimize images further
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]',
          publicPath: `/_next/static/media/`,
          outputPath: 'static/media/'
        }
      }
    });
    return config;
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Optimize asset delivery
  assetPrefix: process.env.NODE_ENV === 'production' ? '/_next' : undefined,
  // Cache optimization
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2
  },
  experimental: {
    // Optimize JS size
    optimizePackageImports: ['framer-motion', 'lucide-react']
  }
};

module.exports = nextConfig;
