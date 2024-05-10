import { StatsWriterPlugin } from 'webpack-stats-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'build',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    if (process.env.BUILD_STATS) {
      config.plugins.push(
        new StatsWriterPlugin({
          filename: 'webpack-stats.json',
          stats: {
            assets: true,
            chunks: true,
            modules: true,
          },
        }),
      );
    }

    return config;
  },
};

export default nextConfig;
