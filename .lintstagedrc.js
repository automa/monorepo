module.exports = {
  '*.{js,ts,tsx}': ['eslint --fix'],
  '*.{json,yaml,yml}': ['prettier --write'],
  'src/**/*.queries.ts': ['pnpm graphql-generate', 'git add src/gql'],
};
