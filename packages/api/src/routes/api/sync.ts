import { FastifyInstance } from 'fastify';

import { sync as githubSync } from '../../clients/github';

export default async function (app: FastifyInstance) {
  app.post('/sync', async (request, reply) => {
    await githubSync(app, request, request.userId!, null, true);

    return reply.code(204).send();
  });
}
