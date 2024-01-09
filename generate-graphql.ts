import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'packages/api/src/graphql/schema',
  generates: {
    'packages/common/src/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        mappers: {
          User: '.prisma/client#users',
          Org: '.prisma/client#orgs',
          Repo: '.prisma/client#repos',
          OrgProjectProvider: '.prisma/client#org_project_providers',
        },
      },
    },
  },
};

export default config;
