/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone for development
  // output: 'standalone',
  
  // Ensure CSS processing works
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },

  // Enable CSS processing
  webpack: (config) => {
    return config;
  },

  // Performance optimizations
  poweredByHeader: false,
  compress: true,

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'SpaceMate',
  },
};

module.exports = nextConfig;