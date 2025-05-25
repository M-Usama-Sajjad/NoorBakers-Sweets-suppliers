/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  images: {
    domains: ['localhost', '127.0.0.1', 'noorbakersandsweets.co.uk', 'api.noorbakersandsweets.co.uk']
  }
}

export default nextConfig
