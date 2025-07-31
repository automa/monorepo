import { FastifyInstance } from 'fastify';

import { integration } from '@automa/prisma';

export const commentEventKey = (id: string) => `linear:event:comment_id:${id}`;

export const checkConnection = async (
  app: FastifyInstance,
  organizationId: string,
) => {
  // Find the integration for the organization
  const connection = await app.prisma.integrations.findFirst({
    where: {
      type: integration.linear,
      config: {
        path: ['id'],
        equals: organizationId,
      },
    },
    include: {
      orgs: true,
    },
  });

  // Check if we have the access token
  if (
    !(
      connection?.secrets &&
      typeof connection.secrets === 'object' &&
      !Array.isArray(connection.secrets) &&
      connection.secrets.access_token
    )
  ) {
    return {};
  }

  return {
    accessToken: connection.secrets.access_token as string,
    orgId: connection.org_id,
    orgName: connection.orgs.name,
  };
};
