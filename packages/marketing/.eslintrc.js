const product = 'automa';
const modules = ['components', 'utils'];

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@next/next/core-web-vitals',
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
  rules: {
    quotes: ['warn', 'single', { avoidEscape: true }],
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/jsx-curly-brace-presence': 'warn',
    'react/jsx-no-target-blank': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          ['^\u0000'],
          ['^node:', '^(fs|path)$'],
          [
            '^(react|react-twc)$',
            '^(next)(/.*)?$',
            '^(@storybook|tailwindcss|class-variance-authority)(/.*)?$',
            '^@?\\w',
          ],
          [`^@${product}/`],
          ['^'],
          ['^.*\\.css$'],
          ['^\u0000?(env)$'],
          ['^(.*/)?(mdx-components|theme)$'],
          [`^(${modules.join('|')})$`],
          ['^(assets)/.*'],
          [`^(${modules.join('|')})/.*$`],
          ['^(\\.\\./)+(types|utils)$'],
          ['^\\.\\.'],
          ['^\\./(types|utils)$'],
          ['^\\.'],
          ['^\\./.*\\.(styles)$'],
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
  ],
  overrides: [
    {
      files: ['**/*.stories.*'],
      rules: {
        'import/no-anonymous-default-export': 'off',
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
        'next.config.mjs',
        'postcss.config.js',
        'tailwind.config.ts',
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
        project: 'packages/marketing',
      },
    },
    'import/internal-regex': `^@${product}/`,
  },
};
