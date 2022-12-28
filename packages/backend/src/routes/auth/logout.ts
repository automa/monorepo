import { FastifyInstance } from 'fastify';

export default async function (app: FastifyInstance) {
  app.get('/logout', async (request, reply) => {
    request.session.destroy();
    reply.status(204).send();
  });
}
