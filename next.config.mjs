const nextConfig = {
  experimental: { optimizePackageImports: ["@chakra-ui/react"] },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      }
    ]
  }
};
export default nextConfig;
