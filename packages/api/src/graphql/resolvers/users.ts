import {
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  userUpdateSchema,
} from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  user: (root, args, { userId, prisma }) => {
    if (!userId) {
      return null;
    }

    return prisma.users.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });
  },
};

export const Mutation: MutationResolvers<Context> = {
  userUpdate: async (_, { input }, { userId, prisma }) => {
    const data = userUpdateSchema.parse(input);

    return prisma.users.update({
      where: {
        id: userId,
      },
      data,
    });
  },
};

export const User: Resolvers<Context>['User'] = {
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
