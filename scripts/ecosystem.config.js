// eslint-disable-next-line @typescript-eslint/no-var-requires
const { apps } = require('./local.config');

module.exports = {
  apps: [
    {
      name: 'tunnel',
      script: 'ngrok',
      interpreter: 'none',
      args: 'http --subdomain=automa 8080',
    },
    ...apps,
  ],
};
