/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    SECRET_KEY: process.env.SECRET_KEY,
  },
};
export default nextConfig;
