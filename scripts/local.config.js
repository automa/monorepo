module.exports = {
  apps: [
    {
      name: 'graphql-dev',
      watch: [
        'packages/api/src/graphql/schema',
        'packages/console/src/**/*.queries.ts',
      ],
      script: 'pnpm',
      args: 'graphql-generate',
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
    {
      name: 'marketing',
      cwd: 'packages/marketing',
      script: 'pnpm',
      args: 'start',
    },
  ],
};
