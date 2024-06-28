import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import prisma, { PrismaClient } from '@automa/prisma';

import { env, isProduction, isTest } from '../env';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin: FastifyPluginAsync = async (app) => {
  const client = prisma(env.DATABASE_URL, !isProduction && !isTest);

  await client.$connect();

  // Make Prisma Client available through the fastify app instance: app.prisma
  app.decorate('prisma', client);

  app.addHook('onClose', async (app) => {
    await app.prisma.$disconnect();
  });
};

export default fp(prismaPlugin, {
  name: 'prisma',
});
