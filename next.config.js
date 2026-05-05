/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/project-runner', destination: 'https://project-runner-tau.vercel.app/demo/walkthrough' },
      { source: '/project-runner/:path*', destination: 'https://project-runner-tau.vercel.app/demo/walkthrough/:path*' },
      { source: '/api/demo/enter', destination: 'https://project-runner-tau.vercel.app/api/demo/enter' },
      { source: '/api/demo/:path*', destination: 'https://project-runner-tau.vercel.app/api/demo/:path*' },
      { source: '/demo/walkthrough', destination: 'https://project-runner-tau.vercel.app/demo/walkthrough' },
      { source: '/demo/walkthrough/:path*', destination: 'https://project-runner-tau.vercel.app/demo/walkthrough/:path*' },
    ]
  },
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
}
module.exports = nextConfig
