module.exports = {
  root: true,
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:prettier/recommended',
    'plugin:storybook/recommended',
  ],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'styled-components',
            message: 'Please import from styled-components/macro.',
          },
        ],
        patterns: ['!styled-components/macro'],
      },
    ],
    'storybook/no-uninstalled-addons': 'off',
  },
  ignorePatterns: [
    '!.storybook',
    '!.babel-plugin-macrosrc.js',
    'build',
    'coverage',
    'public',
  ],
  overrides: [
    {
      files: ['**/*.stories.*'],
      rules: {
        'import/no-anonymous-default-export': 'off',
        'storybook/hierarchy-separator': 'error',
        'storybook/csf-component': 'error',
        'storybook/no-redundant-story-name': 'error',
        'storybook/no-stories-of': 'error',
        'storybook/prefer-pascal-case': 'error',
      },
    },
  ],
};
