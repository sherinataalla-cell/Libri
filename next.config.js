/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Required for @react-pdf/renderer to work in Next.js
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
