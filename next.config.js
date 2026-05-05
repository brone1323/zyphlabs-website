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
}
module.exports = nextConfig
