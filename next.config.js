/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  images: {
    unoptimized: true,
    domains: ["images.unsplash.com", "via.placeholder.com"],
  },
};

module.exports = nextConfig;
