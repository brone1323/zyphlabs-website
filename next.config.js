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
}
module.exports = nextConfig
