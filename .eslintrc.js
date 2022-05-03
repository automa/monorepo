module.exports = {
  root: true,
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:prettier/recommended',
    'plugin:import/warnings',
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
  },
  ignorePatterns: [
    '!.storybook',
    '!.prettierrc.js',
    'build',
    'coverage',
    'public',
  ],
  overrides: [
    {
      files: ['**/*.stories.*'],
      rules: {
        'import/no-anonymous-default-export': 'off',
      },
    },
  ],
};
