const product = 'automa';
const modules = ['analytics', 'optimizer', 'utils'];
const features = [
  'admin',
  'app',
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
    'plugin:@vitest/legacy-recommended',
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
    'padding-line-between-statements': [
      'error',
      // After directives (like 'use-strict'), except between directives
      { blankLine: 'always', prev: 'directive', next: '*' },
      { blankLine: 'any', prev: 'directive', next: 'directive' },
      // Before and after every sequence of variable declarations
      { blankLine: 'always', prev: '*', next: ['const', 'let', 'var'] },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
      // Before and after blocks & export statements
      {
        blankLine: 'always',
        prev: ['block-like', 'export'],
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: ['block-like', 'export'],
      },
      // Not between export statements
      {
        blankLine: 'any',
        prev: 'export',
        next: 'export',
      },
      // Before return statements
      {
        blankLine: 'always',
        prev: '*',
        next: ['return', 'continue', 'break', 'throw'],
      },
    ],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/jsx-curly-brace-presence': 'warn',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
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
          ['^(client|error|router|store|theme|tests)$'],
          [`^(gql(/.*)?|shared(/.*)?|${modules.join('|')})$`],
          [`^(${features.join('|')})$`],
          ['^(assets|views)/.*'],
          [`^(${modules.concat(features).join('|')})/.*$`],
          ['^\\.\\.'],
          ['^\\./(types|utils)$'],
          ['^\\.'],
          ['^\\./.*\\.(queries|styles)$'],
          ['^.*\\.stories'],
        ],
      },
    ],
    'import/consistent-type-specifier-style': ['warn', 'prefer-inline'],
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-absolute-path': 'error',
    'import/no-cycle': [
      'error',
      {
        maxDepth: 3,
      },
    ],
    'import/no-duplicates': 'error',
    'import/no-empty-named-blocks': 'error',
    'import/no-relative-packages': 'error',
    'import/no-self-import': 'error',
    'import/no-useless-path-segments': 'error',
    '@vitest/expect-expect': [
      'error',
      {
        assertFunctionNames: ['expect*', 'assert*'],
      },
    ],
    '@vitest/consistent-each-for': [
      'error',
      {
        describe: 'for',
        test: 'for',
      },
    ],
    '@vitest/consistent-test-it': [
      'error',
      {
        fn: 'test',
        withinDescribe: 'test',
      },
    ],
    '@vitest/consistent-vitest-vi': 'error',
    '@vitest/no-alias-methods': 'error',
    '@vitest/no-duplicate-hooks': 'error',
    '@vitest/no-importing-vitest-globals': 'error',
    '@vitest/no-test-return-statement': 'error',
    '@vitest/padding-around-all': 'error',
    '@vitest/prefer-hooks-in-order': 'error',
    '@vitest/prefer-hooks-on-top': 'error',
    'storybook/no-uninstalled-addons': 'off',
    'tailwindcss/classnames-order': 'off',
    'tailwindcss/enforces-negative-arbitrary-values': 'error',
    'tailwindcss/enforces-shorthand': 'error',
    'tailwindcss/no-arbitrary-value': 'error',
    'tailwindcss/no-custom-classname': 'off',
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
        '@graphql-eslint/require-selections': 'off',
      },
      parserOptions: {
        graphQLConfig: {
          documents: '**/*.queries.ts',
          schema: '**/*.graphql',
        },
      },
    },
    {
      files: ['**/*.stories.*'],
      rules: {
        'storybook/await-interactions': 'off',
        'storybook/csf-component': 'error',
        'storybook/hierarchy-separator': 'error',
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
