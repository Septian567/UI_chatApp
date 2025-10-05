/** @type {import('next').NextConfig} */
const nextConfig = {
  // Konfigurasi untuk production deployment
  output: 'standalone',
  trailingSlash: true,

  // ESLint ignore selama build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Typescript ignore selama build (jika perlu)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Optimasi images untuk static deployment
  images: {
    unoptimized: true,
    domains: [], // tambahkan domain images jika diperlukan
  },

  // Environment variables yang akan diganti saat runtime
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Redirects untuk SPA behavior (opsional)
  async redirects()
  {
    return [
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'page',
            value: 'home',
          },
        ],
        destination: '/home',
        permanent: false,
      },
    ];
  },

  // Rewrites untuk API calls (sesuaikan dengan backend URL)
  async rewrites()
  {
    return process.env.NODE_ENV === 'production'
      ? [
        {
          source: '/api/:path*',
          destination: `${ process.env.NEXT_PUBLIC_API_URL }/api/:path*`,
        },
      ]
      : [];
  }
}

export default nextConfig
