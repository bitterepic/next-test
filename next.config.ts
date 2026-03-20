import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd8cip8330xdjp.cloudfront.net',
        port: '',
        search: '',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/videos/:videoId*',
        destination: '/',
      },
      {
        source: '/categories/:categoryId*',
        destination: '/',
      },
    ];
  },
};

export default nextConfig;
