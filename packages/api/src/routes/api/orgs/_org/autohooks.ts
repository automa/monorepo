import { FastifyInstance } from 'fastify';

import { orgs, provider } from '@automa/prisma';

declare module 'fastify' {
  interface FastifyRequest {
    org: orgs | null;
  }
}

export default async function (app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    const { provider, org: name } = request.params as {
      provider: provider;
      org: string;
    };

    request.org = await app.prisma.orgs.findFirstOrThrow({
      where: {
        provider_type: provider,
        name,
        user_orgs: {
          some: {
            user_id: request.user!.id,
          },
        },
      },
    });
  });
}
