const product = 'automa';
const modules = ['analytics', 'optimizer', 'shared', 'utils'];
const features = [
  'auth',
  'bots',
  'integrations',
  'orgs',
  'repos',
  'tasks',
  'users',
];

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
    'plugin:tailwindcss/recommended',
  ],
  plugins: ['simple-import-sort'],
  processor: '@graphql-eslint/graphql',
  rules: {
    quotes: ['warn', 'single', { avoidEscape: true }],
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@automa/common/build/*'],
            message:
              'Please import from `@automa/common`. For types, use `gql/graphql`.',
          },
        ],
      },
    ],
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/ban-ts-comment': 'off',
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
    'react/jsx-curly-brace-presence': 'warn',
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          ['^\u0000'],
          ['^node:'],
          [
            '^(react|react-dom/client|react-router-dom|react-redux|react-twc|vite|vitest)$',
            '^(@apollo/client|@reduxjs/toolkit|@storybook|@testing-library|tailwindcss|class-variance-authority)(/.*)?$',
            '^@?\\w',
          ],
          [`^@${product}/`],
          ['^'],
          ['^\u0000(@fontsource-.*|cal-sans)$'],
          ['^.*\\.css$'],
          ['^\u0000?(env|telemetry)$'],
          ['^(client|error|store|theme|tests)$'],
          [`^(gql(/.*)?|${modules.join('|')})$`],
          [`^(${features.join('|')})$`],
          ['^(assets|views)/.*'],
          [`^(${modules.concat(features).join('|')})/.*$`],
          ['^\\.\\.'],
          ['^\\./(routes|types|utils)$'],
          ['^\\.'],
          ['^\\./.*\\.(queries|styles)$'],
          ['^.*\\.stories'],
        ],
      },
    ],
    'import/no-empty-named-blocks': 'error',
    'import/no-absolute-path': 'error',
    'import/no-relative-packages': 'error',
    'import/no-self-import': 'error',
    'import/no-useless-path-segments': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-cycle': [
      'error',
      {
        maxDepth: 3,
      },
    ],
    'storybook/no-uninstalled-addons': 'off',
    'tailwindcss/no-custom-classname': 'off',
    'tailwindcss/classnames-order': 'off',
    'tailwindcss/enforces-negative-arbitrary-values': 'error',
    'tailwindcss/enforces-shorthand': 'error',
    'tailwindcss/no-arbitrary-value': 'error',
  },
  ignorePatterns: [
    '!.storybook',
    '!.prettierrc.js',
    'build',
    'coverage',
    'public',
    'src/gql',
  ],
  overrides: [
    {
      files: ['**/*.graphql'],
      extends: ['plugin:@graphql-eslint/operations-recommended'],
      rules: {
        '@graphql-eslint/naming-convention': [
          'error',
          {
            VariableDefinition: 'snake_case',
            OperationDefinition: {
              style: 'PascalCase',
              forbiddenPrefixes: ['Query', 'Mutation', 'Subscription', 'Get'],
              forbiddenSuffixes: ['Query', 'Mutation', 'Subscription'],
            },
            FragmentDefinition: {
              style: 'PascalCase',
              forbiddenPrefixes: ['Fragment'],
              forbiddenSuffixes: ['Fragment'],
            },
          },
        ],
        '@graphql-eslint/require-id-when-available': 'off',
      },
      parserOptions: {
        operations: '**/*.queries.ts',
        schema: '**/*.graphql',
      },
    },
    {
      files: ['**/*.stories.*'],
      rules: {
        'storybook/await-interactions': 'off',
        'storybook/hierarchy-separator': 'error',
        'storybook/csf-component': 'error',
        'storybook/no-redundant-story-name': 'error',
        'storybook/no-stories-of': 'error',
        'storybook/prefer-pascal-case': 'error',
      },
    },
    {
      files: [
        '.storybook/*.ts',
        '.eslintrc.js',
        '.prettierrc.js',
        'postcss.config.js',
        'tailwind.config.ts',
        'vite.config.mts',
      ],
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
        project: 'packages/console',
      },
    },
    'import/internal-regex': `^@${product}/`,
  },
};
