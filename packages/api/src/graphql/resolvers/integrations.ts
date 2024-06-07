import { IntegrationResolvers, QueryResolvers } from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  integrations: async (root, { org_id }, { userId, prisma }) => {
    // Check if the user is a member of the org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: userId,
        org_id,
      },
    });

    return prisma.integrations.findMany({
      where: {
        org_id,
      },
    });
  },
};

export const Integration: IntegrationResolvers<Context> = {
  author: ({ id }, args, { prisma }) => {
    return prisma.integrations
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .users();
  },
};
