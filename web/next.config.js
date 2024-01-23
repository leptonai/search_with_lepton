/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  assetPrefix: "/ui/",
  basePath: "/ui",
  distDir: '../ui',
  async rewrites() {
    return [
      {
        source: "/query",
        destination: "http://localhost:8080/query", // Proxy to Backend
      },
    ];
  },
};

module.exports = nextConfig;
