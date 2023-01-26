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
      name: 'backend-dev',
      cwd: 'packages/backend',
      script: 'yarn',
      interpreter: '/bin/bash',
      args: 'dev',
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
