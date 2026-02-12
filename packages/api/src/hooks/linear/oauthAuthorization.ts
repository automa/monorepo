import { integration } from '@automa/prisma';

import { LinearEventActionHandler } from './types';

// TODO: Do we need to handle created? In the case where users might install the app from
// the Linear marketplace instead of connecting it from our UI.

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
