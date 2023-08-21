import { default as nextra } from 'nextra';
import { StatsWriterPlugin } from 'webpack-stats-plugin';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  flexsearch: true,
  defaultShowCopyCode: true,
});

export default withNextra({
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
});
