import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    ppr: true,
    clientSegmentCache: true
  }
};

export default nextConfig;
