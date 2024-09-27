import { integration } from '@automa/prisma';

import { LinearEventActionHandler } from './types';

const revoked: LinearEventActionHandler<{
  organizationId: string;
}> = async (app, body) => {
  await app.prisma.integrations.deleteMany({
    where: {
      type: integration.linear,
      config: {
        path: ['id'],
        equals: body.organizationId,
      },
    },
  });
};

export default {
  revoked,
};
