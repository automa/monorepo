module.exports = {
  apps: [
    {
      name: 'prisma-dev',
      cwd: 'packages/prisma',
      script: 'pnpm',
      args: 'dev',
    },
    {
      name: 'common-dev',
      cwd: 'packages/common',
      script: 'pnpm',
      args: 'dev',
    },
    {
      name: 'config-dev',
      cwd: 'packages/config',
      script: 'pnpm',
      args: 'dev',
    },
    {
      name: 'graphql-dev',
      watch: [
        'packages/api/src/graphql/schema',
        'packages/console/src/**/*.queries.ts',
      ],
      script: 'pnpm',
      args: 'generate-graphql',
      autorestart: false,
    },
    {
      name: 'api-dev',
      cwd: 'packages/api',
      script: 'pnpm',
      args: 'dev',
    },
    {
      name: 'api-graphql-dev',
      cwd: 'packages/api',
      watch: ['src/graphql/schema'],
      script: 'pnpm',
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
      script: 'pnpm',
      args: 'start',
    },
  ],
};
