import { FastifyInstance } from 'fastify';

export default async function (app: FastifyInstance) {
  app.get('/logout', async (request, reply) => {
    await request.session.destroy();
    return reply.code(204).send();
  });
}
