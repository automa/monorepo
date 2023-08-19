module.exports = {
  apps: [
    // TODO: Make this optional
    {
      name: 'tunnel',
      script: 'ngrok',
      interpreter: 'none',
      args: 'http --subdomain=automa 8080',
    },
    {
      name: 'prisma-dev',
      cwd: 'packages/prisma',
      script: 'yarn',
      interpreter: '/bin/bash',
      args: 'dev',
    },
    {
      name: 'common-dev',
      cwd: 'packages/common',
      script: 'yarn',
      interpreter: '/bin/bash',
      args: 'dev',
    },
    {
      name: 'common-graphql-dev',
      watch: ['packages/api/src/graphql/schema'],
      script: 'yarn',
      interpreter: '/bin/bash',
      args: 'generate-graphql',
      autorestart: false,
    },
    {
      name: 'api-dev',
      cwd: 'packages/api',
      script: 'yarn',
      interpreter: '/bin/bash',
      args: 'dev',
    },
    {
      name: 'api-graphql-dev',
      cwd: 'packages/api',
      watch: ['src/graphql/schema'],
      script: 'yarn',
      interpreter: '/bin/bash',
      args: 'copy-graphql',
      autorestart: false,
    },
    {
      name: 'api',
      cwd: 'packages/api',
      watch: ['build'],
      script: 'build/index.js',
    },
    {
      name: 'console',
      cwd: 'packages/console',
      script: 'yarn',
      interpreter: '/bin/bash',
      args: 'start',
    },
  ],
};
