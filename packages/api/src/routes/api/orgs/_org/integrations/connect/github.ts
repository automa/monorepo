import { FastifyInstance } from 'fastify';

import { environment } from '../../../../../../env';

export default async function (app: FastifyInstance) {
  app.get('/github', async (request, reply) => {
    const appName = `automa${
      environment === 'production' ? '' : `-${environment}`
    }`;

    return reply.redirect(
      `https://github.com/apps/${appName}/installations/new/permissions?target_id=${request.org?.provider_id}`,
    );
  });
}
