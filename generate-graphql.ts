import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'packages/api/src/graphql/schema',
  generates: {
    'packages/common/src/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        mappers: {
          Org: '.prisma/client#orgs',
          Repo: '.prisma/client#repos',
        },
      },
    },
  },
};

export default config;
