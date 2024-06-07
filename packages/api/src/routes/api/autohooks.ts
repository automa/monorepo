import { FastifyInstance } from 'fastify';

export default async function (app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    if (!request.userId) {
      return reply.unauthorized();
    }
  });
}
