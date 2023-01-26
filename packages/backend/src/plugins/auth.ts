import fp from 'fastify-plugin';
import { FastifyPluginAsync, preHandlerHookHandler } from 'fastify';
import { users } from '@automa/prisma';

declare module 'fastify' {
  interface FastifyContextConfig {
    auth?: boolean;
  }

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

  const handler: preHandlerHookHandler = async (request, reply) => {
    if (!request.user) {
      return reply.unauthorized();
    }
  };

  // Gate all `/api` routes behind authentication
  app.addHook('onRoute', async (routeOptions) => {
    if (routeOptions.preHandler && !Array.isArray(routeOptions.preHandler)) {
      routeOptions.preHandler = [routeOptions.preHandler];
    }

    if (routeOptions.path.startsWith('/api/')) {
      routeOptions.preHandler = [...(routeOptions.preHandler || []), handler];
    }
  });
};

export default fp(authPlugin, {
  name: 'auth',
});
