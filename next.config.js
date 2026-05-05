/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/project_runner', destination: '/project-runner', permanent: true },
      { source: '/signup', destination: '/', permanent: false },
      { source: '/signup/:path*', destination: '/', permanent: false },
      { source: '/questionnaire', destination: '/', permanent: false },
      { source: '/questionnaire/:path*', destination: '/', permanent: false },
      { source: '/portfolio', destination: '/', permanent: false },
      { source: '/portfolio/:path*', destination: '/', permanent: false },
    ]
  },
  async rewrites() {
    return [
      { source: '/project-runner', destination: 'https://project-runner-tau.vercel.app/demo/walkthrough' },
      { source: '/project-runner/:path*', destination: 'https://project-runner-tau.vercel.app/demo/walkthrough/:path*' },
    ]
  },
}
module.exports = nextConfig
