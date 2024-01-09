import { join } from 'path';

import { ApolloServer } from '@apollo/server';
import {
  ApolloFastifyContextFunction,
  fastifyApolloDrainPlugin,
  fastifyApolloHandler,
} from '@as-integrations/fastify';
import { loadFiles } from '@graphql-tools/load-files';
import { FastifyInstance } from 'fastify';

import { isProduction } from '../env';

import { Context } from './types';

export default async function (app: FastifyInstance) {
  const context: ApolloFastifyContextFunction<Context> = async (request) => {
    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      user: request.user!,
      prisma: app.prisma,
    };
  };

  const typeDefs = await loadFiles(join(__dirname, 'schema/*.graphql'));
  const resolvers = await loadFiles(join(__dirname, 'resolvers/*.{js,ts}'));

  const apollo = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    plugins: [fastifyApolloDrainPlugin(app)],
    introspection: !isProduction,
    includeStacktraceInErrorResponses: !isProduction,
    nodeEnv: '',
  });

  await apollo.start();

  app.post(
    '/graphql',
    {
      // If we want to allow unauthed users to access the API, we need to
      // remove this prehandler and use a graphql decorator
      preHandler: async (request, reply) => {
        if (!request.user) {
          return reply.unauthorized();
        }
      },
    },
    fastifyApolloHandler(apollo, { context }),
  );
}
