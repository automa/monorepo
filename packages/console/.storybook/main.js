module.exports = {
  staticDirs: ['../public'],
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-coverage',
  ],
  framework: '@storybook/react-vite',
  features: {
    interactionsDebugger: true,
  },
  docs: {
    autodocs: true,
  },
};
