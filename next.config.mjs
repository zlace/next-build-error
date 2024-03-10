/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    return {
      ...config,
      externals: ["pino-pretty", "encoding"],
    };
  },
};

export default nextConfig;
