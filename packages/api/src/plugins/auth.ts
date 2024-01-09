import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

import { users } from '@automa/prisma';

declare module 'fastify' {
  interface FastifyRequest {
    user: users | null;
  }
}

const authPlugin: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (request) => {
    const { userId } = request.session;

    if (!userId) {
      request.user = null;
      return;
    }

    request.user = await app.prisma.users.findUnique({
      where: {
        id: userId,
      },
    });
  });
};

export default fp(authPlugin, {
  name: 'auth',
});
