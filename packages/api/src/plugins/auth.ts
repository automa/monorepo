import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { users } from '@automa/prisma';

declare module 'fastify' {
  interface FastifyRequest {
    userId: users['id'] | null;
  }
}

const authPlugin: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (request) => {
    request.userId = request.session.userId ?? null;
  });
};

export default fp(authPlugin, {
  name: 'auth',
});
