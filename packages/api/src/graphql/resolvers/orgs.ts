import { QueryResolvers } from '@automa/common';

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
