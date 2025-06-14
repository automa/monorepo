import { FastifyInstance } from 'fastify';

import { env } from '../../../../../../env';

export default async function (app: FastifyInstance) {
  app.get('/github', async (request, reply) => {
    return reply.redirect(
      `https://github.com/apps/${env.GITHUB_APP.SLUG}/installations/new/permissions?target_id=${request.org?.provider_id}`,
    );
  });
}
