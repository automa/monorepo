import { BotResolvers } from '@automa/common';

import { Context } from '../types';

export const Bot: BotResolvers<Context> = {
  org: async ({ org_id }, args, { prisma }) => {
    return prisma.orgs.findFirstOrThrow({
      where: {
        id: org_id,
      },
    });
  },
};
