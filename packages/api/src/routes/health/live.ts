import { FastifyInstance } from 'fastify';

export default async function (app: FastifyInstance) {
  app.get('/live', async (request, reply) => {
    reply.status(200).send();
  });
}
