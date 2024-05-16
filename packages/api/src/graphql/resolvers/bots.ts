import {
  BotResolvers,
  MutationResolvers,
  QueryResolvers,
  botCreateSchema,
} from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  bots: async (root, { org_id }, { user, prisma }) => {
    // TODO: Convert the org check into a directive and/or use resolver composition
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

    return prisma.bots.findMany({
      where: {
        org_id,
      },
      orderBy: {
        id: 'asc',
      },
    });
  },
};

export const Mutation: MutationResolvers<Context> = {
  botCreate: async (_, { org_id, input }, { prisma, user }) => {
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

    const data = botCreateSchema.parse(input);

    return prisma.bots.create({
      data: {
        org_id,
        ...data,
      },
    });
  },
};

export const Bot: BotResolvers<Context> = {
  org: async ({ org_id }, args, { prisma }) => {
    // TODO: Restrict what fields can be queried. Add select and specify public org type
    return prisma.orgs.findFirstOrThrow({
      where: {
        id: org_id,
      },
    });
  },
};
