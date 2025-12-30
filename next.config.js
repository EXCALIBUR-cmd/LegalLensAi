/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Externalize Tesseract.js for server-side to avoid bundling issues
    if (isServer) {
      config.externals = [...(config.externals || []), 'tesseract.js', 'canvas'];
    }
    
    return config;
  },
}

module.exports = nextConfig
