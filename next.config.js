/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/index.html',
        permanent: false,
      },
      {
        source: '/ai-services',
        destination: '/ai-services.html',
        permanent: false,
      },
    ]
  },
}
module.exports = nextConfig
