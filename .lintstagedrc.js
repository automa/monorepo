module.exports = {
  '*.{js,ts,tsx}': ['eslint --fix'],
  '*.{json,yaml,yml}': ['prettier --write'],
  'src/**/*.queries.ts': ['pnpm generate-graphql', 'git add src/gql'],
};
