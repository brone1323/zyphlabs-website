/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/project_runner',
        destination: '/project-runner',
        permanent: true, // 308
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/project-runner',
        destination: 'https://project-runner-tau.vercel.app/demo/walkthrough',
      },
      {
        source: '/project-runner/:path*',
        destination: 'https://project-runner-tau.vercel.app/demo/walkthrough/:path*',
      },
    ]
  },
}
module.exports = nextConfig
