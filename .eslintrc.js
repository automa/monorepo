module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:prettier/recommended',
    'plugin:import/warnings',
  ],
  rules: {},
  ignorePatterns: [
    '!.storybook',
    '!.prettierrc.js',
    'build',
    'coverage',
    'public',
    'yarn.lock',
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
