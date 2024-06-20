import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Redis } from 'ioredis';

import { env } from '../env';

declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis;
  }
}

const redisPlugin: FastifyPluginAsync = async (app) => {
  const client = new Redis(env.REDIS_URL);

  // Make Redis Client available through the fastify app instance: app.redis
  app.decorate('redis', client);

  app.addHook('onClose', async (app) => {
    await app.redis.quit();
  });
};

export default fp(redisPlugin, {
  name: 'redis',
});
