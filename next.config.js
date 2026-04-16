/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/index-v2.html',
        permanent: false,
      },
      {
        source: '/ai-services',
        destination: '/ai-services.html',
        permanent: false,
      },
      {
        source: '/solar-ai-demo',
        destination: '/solar-ai-demo.html',
        permanent: false,
      },
      {
        source: '/ai-solar-agent',
        destination: '/ai-solar-agent.html',
        permanent: false,
      },
      {
        source: '/ai-digital-administrator',
        destination: '/ai-digital-administrator.html',
        permanent: false,
      },
      {
        source: '/ai-digital-bookkeeper',
        destination: '/ai-digital-bookkeeper.html',
        permanent: false,
      },
      {
        source: '/ai-project-manager',
        destination: '/ai-project-manager.html',
        permanent: false,
      },
      {
        source: '/ai-content-creator',
        destination: '/ai-content-creator.html',
        permanent: false,
      },
      {
        source: '/ontario-solar-ai-demo',
        destination: '/ontario-solar-ai-demo.html',
        permanent: false,
      },
      {
        source: '/promotions',
        destination: '/promotions.html',
        permanent: false,
      },
    ]
  },
}
module.exports = nextConfig
