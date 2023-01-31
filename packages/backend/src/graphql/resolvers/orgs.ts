import { QueryResolvers } from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  orgs: async (root, args, { user, prisma }) => {
    const result = await prisma.user_orgs.findMany({
      where: {
        user_id: user.id,
      },
      include: {
        orgs: true,
      },
    });

    return result.map((r) => r.orgs);
  },
  org: async (root, { id }, { user, prisma }) => {
    const result = await prisma.user_orgs.findFirst({
      where: {
        user_id: user.id,
        org_id: id,
      },
      include: {
        orgs: true,
      },
    });

    return result?.orgs ?? null;
  },
};

export const Org = {};
