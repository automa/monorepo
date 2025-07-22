import { QueryResolvers, Resolvers } from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  integrations: async (root, { org_id }, { prisma }) => {
    return prisma.integrations.findMany({
      where: {
        org_id,
      },
    });
  },
};

export const Integration: Resolvers<Context>['Integration'] = {
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
