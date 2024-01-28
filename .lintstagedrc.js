module.exports = {
  '*.{js,ts,tsx}': ['eslint --fix'],
  '*.{json,yaml,yml}': ['prettier --write'],
  '{*.graphql,packages/console/src/**/*.queries.ts}': [
    'pnpm generate-graphql',
    'git add packages/common/src/graphql.ts packages/console/src/gql',
  ],
};
