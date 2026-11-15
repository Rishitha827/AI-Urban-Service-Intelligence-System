/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: '/register', destination: '/' },
      { source: '/track', destination: '/' },
      { source: '/intelligence', destination: '/' },
      { source: '/dashboard', destination: '/' },
      { source: '/priority', destination: '/' },
    ]
  },
}

export default nextConfig
