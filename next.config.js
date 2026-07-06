/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // XSS himoya
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Clickjacking himoya
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          // MIME type sniffing himoya
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Referrer policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Permissions policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
    ]
  },
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // Compress
  compress: true,
  // Remove powered by header
  poweredByHeader: false,
}

module.exports = nextConfig
