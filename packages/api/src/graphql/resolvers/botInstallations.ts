import { BotInstallationResolvers, QueryResolvers } from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  botInstallations: async (root, { org_id }, { user, prisma }) => {
    // Check if the user is a member of the org
    await prisma.orgs.findFirstOrThrow({
      where: {
        id: org_id,
        user_orgs: {
          some: {
            user_id: user.id,
          },
        },
      },
    });

    return prisma.bot_installations.findMany({
      where: {
        org_id,
      },
      orderBy: {
        id: 'asc',
      },
    });
  },
};

export const BotInstallation: BotInstallationResolvers<Context> = {
  org: async ({ org_id }, args, { prisma }) => {
    return prisma.orgs.findFirstOrThrow({
      where: {
        id: org_id,
      },
    });
  },
  bot: async ({ bot_id }, args, { prisma }) => {
    // TODO: Restrict what fields can be queried. Add select and specify public bot type
    return prisma.bots.findFirstOrThrow({
      where: {
        id: bot_id,
      },
    });
  },
};
