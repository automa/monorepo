module.exports = {
  apps: [
    {
      name: 'prisma-dev',
      cwd: 'packages/prisma',
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
  ],
};
