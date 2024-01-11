import { join } from 'path';

import { ApolloServer } from '@apollo/server';
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from '@as-integrations/fastify';
import { loadFiles } from '@graphql-tools/load-files';
import { FastifyInstance } from 'fastify';
import { GraphQLError } from 'graphql';

import { isProduction } from '../env';

import { Context } from './types';

export default async function (app: FastifyInstance) {
  const typeDefs = await loadFiles(join(__dirname, 'schema/*.graphql'));
  const resolvers = await loadFiles(join(__dirname, 'resolvers/*.{js,ts}'));

  const apollo = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    plugins: [fastifyApolloDrainPlugin(app)],
    status400ForVariableCoercionErrors: true,
    introspection: !isProduction,
    includeStacktraceInErrorResponses: !isProduction,
    nodeEnv: '',
    // TODO: formatError - https://www.apollographql.com/docs/apollo-server/data/errors#for-client-responses
  });

  await apollo.start();

  await app.register(fastifyApollo(apollo), {
    method: ['GET', 'POST'],
    path: '/graphql',
    context: async (request) => {
      if (!request.user) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHORIZED',
            http: { status: 401 },
          },
        });
      }

      return {
        user: request.user,
        prisma: app.prisma,
        analytics: app.analytics,
        optimizer: app.optimizer,
      };
    },
  });
}
