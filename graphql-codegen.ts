import { type CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  require: ['ts-node/register'],
  overwrite: true,
  schema: 'packages/api/src/graphql/schema.ts',
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
          PublicOrg: './public#public_orgs',
          Org: '@prisma/client#orgs',
          Repo: '@prisma/client#repos',
          BotType: '@prisma/client#bot',
          PublicBot: './public#public_bots',
          Bot: '@prisma/client#bots',
          PublicBotInstallation: '@prisma/client#bot_installations',
          BotInstallation: '@prisma/client#bot_installations',
          IntegrationType: '@prisma/client#integration',
          Integration: '@prisma/client#integrations',
          TaskState: '@prisma/client#task_state',
          Task: '@prisma/client#tasks',
          TaskActivityType: '@prisma/client#task_activity',
          TaskActivity: '@prisma/client#task_activities',
          TaskItemType: '@prisma/client#task_item',
          TaskItem: '@prisma/client#task_items',
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
    'packages/console/src/gql/possibleTypes.json': {
      plugins: ['fragment-matcher'],
    },
  },
};

export default config;
