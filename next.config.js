/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    runtime: "edge",
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
};

module.exports = nextConfig;
