import {
  BotResolvers,
  MutationResolvers,
  botCreateSchema,
} from '@automa/common';

import { Context } from '../types';

export const Mutation: MutationResolvers<Context> = {
  botCreate: async (_, { input }, { prisma, user }) => {
    const { org_id } = input;

    botCreateSchema.parse(input);

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

    return prisma.bots.create({
      data: {
        ...input,
      },
    });
  },
};

export const Bot: BotResolvers<Context> = {
  org: async ({ org_id }, args, { prisma }) => {
    return prisma.orgs.findFirstOrThrow({
      where: {
        id: org_id,
      },
    });
  },
};
