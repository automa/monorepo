import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  framework: '@storybook/nextjs',
  stories: [
    '../components/**/*.stories.mdx',
    '../components/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-themes',
    '@storybook/addon-interactions',
    '@storybook/addon-coverage',
  ],
  staticDirs: ['../public'],
  docs: {
    autodocs: 'tag',
  },
};

export default config;
