import { QueryResolvers, Resolvers } from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  orgs: async (root, args, { userId, prisma }) => {
    const result = await prisma.user_orgs.findMany({
      where: {
        user_id: userId,
      },
      include: {
        orgs: true,
      },
    });

    return result.map((r) => r.orgs);
  },
};

export const Org: Resolvers<Context>['Org'] = {
  bot_installations_count: async ({ id }, args, { prisma }) => {
    const {
      _count: { bot_installations: count },
    } = await prisma.orgs.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        _count: {
          select: {
            bot_installations: true,
          },
        },
      },
    });

    return count;
  },
};
