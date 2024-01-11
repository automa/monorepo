import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'packages/api/src/graphql/schema',
  documents: 'packages/console/src/**/*.queries.ts',
  generates: {
    'packages/common/src/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        mappers: {
          User: '.prisma/client#users',
          Org: '.prisma/client#orgs',
          Repo: '.prisma/client#repos',
          ProjectIntegrationConnection: '.prisma/client#org_project_providers',
        },
      },
    },
    'packages/console/src/gql/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
        fragmentMasking: { unmaskFunctionName: 'getFragment' },
      },
    },
  },
};

export default config;
