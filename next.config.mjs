const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  env: {
    BASE_URL: process.env.BASE_URL,
  },
};

export default nextConfig;
