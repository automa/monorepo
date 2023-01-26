import { FastifyInstance } from 'fastify';

export default async function (app: FastifyInstance) {
  app.get('/session', async (request, reply) => {
    reply.status(200).send(request.user);
  });
}
