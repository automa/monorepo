import { QueryResolvers, UserResolvers } from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  me: (root, args, { userId, prisma }) => {
    return prisma.users.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });
  },
};

export const User: UserResolvers<Context> = {
  providers: ({ id }, args, { prisma }) => {
    return prisma.users
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .user_providers();
  },
};
