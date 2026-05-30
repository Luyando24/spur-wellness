/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Compiler is experimental, ensure it's off if causing issues
  experimental: {
    // reactCompiler: false, // Default is false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;

