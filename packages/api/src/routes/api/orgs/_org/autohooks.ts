import { FastifyInstance } from 'fastify';

import { orgs } from '@automa/prisma';

declare module 'fastify' {
  interface FastifyRequest {
    org: orgs | null;
  }
}

export default async function (app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    const { org: name } = request.params as {
      org: string;
    };

    request.org = await app.prisma.orgs.findFirstOrThrow({
      where: {
        name,
        user_orgs: {
          some: {
            user_id: request.userId!,
          },
        },
      },
    });
  });
}
