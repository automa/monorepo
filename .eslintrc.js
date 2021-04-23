module.exports = {
  extends: [
    'react-app',
    'plugin:prettier/recommended',
    'plugin:import/warnings',
  ],
  rules: {
    'prettier/prettier': 2,
  },
  overrides: [
    {
      files: ['**/*.stories.*'],
      rules: {
        'import/no-anonymous-default-export': 'off',
      },
    },
  ],
};
