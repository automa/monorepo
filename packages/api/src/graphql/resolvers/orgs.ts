import { QueryResolvers, Resolvers } from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  orgs: async (root, args, { userId, session, prisma }) => {
    const result = await prisma.user_orgs.findMany({
      where: {
        user_id: userId,
      },
      include: {
        orgs: true,
      },
    });

    const orgs = result.map((r) => r.orgs);

    // Store the user's orgs in the session
    session.orgs = orgs.map(({ id, name }) => ({ id, name }));

    return orgs;
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
