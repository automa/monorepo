import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'packages/api/src/graphql/schema',
  documents: 'packages/console/src/**/*.queries.ts',
  generates: {
    'schema.graphql': {
      plugins: ['schema-ast'],
    },
    'packages/common/src/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        mappers: {
          ProviderType: '@prisma/client#provider',
          User: '@prisma/client#users',
          UserProvider: '@prisma/client#user_providers',
          Org: '@prisma/client#orgs',
          Repo: '@prisma/client#repos',
          BotType: '@prisma/client#bot',
          Bot: '@prisma/client#bots',
          BotInstallation: '@prisma/client#bot_installations',
          ProjectProviderType: '@prisma/client#project_provider',
          ProjectIntegrationConnection: '@prisma/client#org_project_providers',
          Task: '@prisma/client#tasks',
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
