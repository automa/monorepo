import { IntegrationResolvers, QueryResolvers } from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  integrations: async (root, { org_id }, { user, prisma }) => {
    // Check if the user is a member of the org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: user.id,
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
  author: ({ created_by }, args, { prisma }) => {
    return prisma.users.findFirstOrThrow({
      where: {
        id: created_by,
      },
    });
  },
};
