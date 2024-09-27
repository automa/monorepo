import { FastifyInstance } from 'fastify';

import { IntegrationType } from '@automa/common';

import { env } from '../../../../../../env';

export default async function (app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    // Get the integration from the router path
    const integration = request.routerPath.replace(
      /^\/api\/orgs\/:org\/integrations\/connect\//,
      '',
    );

    const connection = await app.prisma.integrations.findUnique({
      where: {
        org_id_type: {
          org_id: request.org!.id,
          type: integration as IntegrationType,
        },
      },
    });

    // Redirect to the integrations page if the integration is already connected
    if (!!connection) {
      return reply.redirect(
        `${env.CLIENT_URI}/${request.org!.name}/integrations`,
      );
    }
  });
}
