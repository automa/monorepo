module.exports = {
  '*.{js,ts,tsx}': ['eslint --fix'],
  '*.{json,yaml,yml}': ['prettier --write'],
  '*.graphql': ['yarn generate-graphql'],
};
