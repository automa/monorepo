import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import { StatsWriterPlugin } from 'webpack-stats-plugin';

// TODO: Copy from vite.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'build',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
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

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
  },
});

export default withMDX(nextConfig);
