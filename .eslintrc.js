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
    'plugin:import/warnings',
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
    '!.prettierrc.js',
    'build',
    'coverage',
    'packages/common/src/graphql.ts',
  ],
};
