import { FastifyInstance } from 'fastify';

export default async function (app: FastifyInstance) {
  app.get('/session', async (request, reply) => {
    const { id, email } = request.user!;
    return reply.status(200).send({ id, email });
  });
}
