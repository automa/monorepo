module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:mocha/recommended',
  ],
  rules: {
    'mocha/no-mocha-arrows': 'off',
  },
  env: {
    node: true,
    mocha: true,
  },
  ignorePatterns: [
    '!.lintstagedrc.js',
    '!.prettierrc.js',
    'build',
    'coverage',
    'packages/common/src/graphql.ts',
  ],
  settings: {
    'import/resolver': {
      typescript: true,
    },
    'import/internal-regex': '^@automa/',
  },
};
