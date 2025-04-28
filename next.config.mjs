/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  images: {
    domains: ['localhost', "127.0.0.1"],
  },
  // redirects: async () => {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/home',
  //       permanent: true,
  //       locale: false
  //     }
  //   ]
  // }
}

export default nextConfig
