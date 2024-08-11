module.exports = {
  require: '@swc-node/register',
  extension: ['ts'],
  ui: 'tdd',
  reporter: 'spec',
  timeout: 20000,
  colors: true,
  recursive: true,
};
