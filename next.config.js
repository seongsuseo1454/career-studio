/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputStandalone: true   // 이 한 줄이 진짜 핵심!
  },
  trailingSlash: true,
  images: { unoptimized: true }
};

module.exports = nextConfig;