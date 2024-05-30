import { ApolloServer } from '@apollo/server';
import {
  ApolloServerErrorCode,
  unwrapResolverError,
} from '@apollo/server/errors';
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from '@as-integrations/fastify';
import { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';

import { Prisma } from '@automa/prisma';

import { isProduction } from '../env';

import schema from './schema';
import { Context } from './types';

export default async function (app: FastifyInstance) {
  const apollo = new ApolloServer<Context>({
    schema,
    plugins: [fastifyApolloDrainPlugin(app)],
    status400ForVariableCoercionErrors: true,
    introspection: !isProduction,
    includeStacktraceInErrorResponses: !isProduction,
    nodeEnv: '',
    formatError: (formattedErr, error) => {
      const innerErr = unwrapResolverError(error);

      if (innerErr instanceof Prisma.PrismaClientKnownRequestError) {
        switch (innerErr.code) {
          case 'P2002':
            return {
              ...formattedErr,
              message: 'Unprocessable Entity',
              extensions: {
                ...formattedErr.extensions,
                code: ApolloServerErrorCode.BAD_USER_INPUT,
                unique: innerErr.meta?.target,
              },
            };

          case 'P2025':
            return {
              ...formattedErr,
              message: 'Not Found',
              extensions: {
                ...formattedErr.extensions,
                code: 'NOT_FOUND',
              },
            };

          default:
            break;
        }
      }

      if (innerErr instanceof ZodError) {
        return {
          ...formattedErr,
          message: 'Unprocessable Entity',
          extensions: {
            ...formattedErr.extensions,
            code: ApolloServerErrorCode.BAD_USER_INPUT,
            errors: innerErr.errors,
          },
        };
      }

      return formattedErr;
    },
  });

  await apollo.start();

  await app.register(fastifyApollo(apollo), {
    method: ['GET', 'POST'],
    path: '/graphql',
    context: async (request) => ({
      user: request.user!,
      prisma: app.prisma,
      analytics: app.analytics,
      optimizer: app.optimizer,
    }),
  });
}
