module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'plugin:storybook/recommended',
  ],
  rules: {
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],
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
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          '{}': false,
        },
        extendDefaults: true,
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'import/no-cycle': [
      'error',
      {
        maxDepth: 3,
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
        'storybook/await-interactions': 'off',
        'storybook/hierarchy-separator': 'error',
        'storybook/csf-component': 'error',
        'storybook/no-redundant-story-name': 'error',
        'storybook/no-stories-of': 'error',
        'storybook/prefer-pascal-case': 'error',
      },
    },
    {
      files: ['.storybook/*.js', '.babel-plugin-macrosrc.js', '.eslintrc.js'],
      env: {
        node: true,
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        project: 'packages/frontend',
      },
    },
  },
};
