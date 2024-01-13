module.exports = {
  '*.{js,ts,tsx}': ['eslint --fix'],
  '*.{json,yaml,yml}': ['prettier --write'],
  'src/**/*.queries.ts': ['yarn generate-graphql', 'git add src/gql'],
};
