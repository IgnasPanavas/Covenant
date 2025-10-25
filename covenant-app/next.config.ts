import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'ipfs.io', 'gateway.pinata.cloud'],
  },
}

export default nextConfig
