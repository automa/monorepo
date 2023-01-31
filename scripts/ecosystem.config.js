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
      watch: ['packages/backend/src/graphql/schema'],
      script: 'yarn',
      interpreter: '/bin/bash',
      args: 'generate-graphql',
      autorestart: false,
    },
    {
      name: 'backend-dev',
      cwd: 'packages/backend',
      script: 'yarn',
      interpreter: '/bin/bash',
      args: 'dev',
    },
    {
      name: 'backend-graphql-dev',
      cwd: 'packages/backend',
      watch: ['src/graphql/schema'],
      script: 'yarn',
      interpreter: '/bin/bash',
      args: 'copy-graphql',
      autorestart: false,
    },
    {
      name: 'backend',
      cwd: 'packages/backend',
      watch: ['build'],
      script: 'build/index.js',
    },
    {
      name: 'frontend',
      cwd: 'packages/frontend',
      script: 'yarn',
      interpreter: '/bin/bash',
      args: 'start',
    },
  ],
};
