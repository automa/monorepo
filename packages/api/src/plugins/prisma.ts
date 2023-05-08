import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

import prisma from '@automa/prisma';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin: FastifyPluginAsync = async (app) => {
  const client = prisma(app.config.DATABASE_URL);

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
