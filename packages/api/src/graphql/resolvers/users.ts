import { QueryResolvers, UserResolvers } from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  me: (root, args, { user }) => {
    return user;
  },
};

export const User: UserResolvers<Context> = {
  providers: ({ id }, args, { prisma }) => {
    return prisma.user_providers.findMany({
      where: {
        user_id: id,
      },
    });
  },
};
