import {
  BotResolvers,
  MutationResolvers,
  PublicBotResolvers,
  QueryResolvers,
  botCreateSchema,
  publicBotFields,
  publicOrgFields,
} from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  bots: async (root, { org_id }, { user, prisma }) => {
    // TODO: Convert the org check into a directive and/or use resolver composition
    // Check if the user is a member of the org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: user.id,
        org_id,
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
  publicBots: async (root, args, { prisma }) => {
    return prisma.bots.findMany({
      where: {
        is_published: true,
      },
      orderBy: {
        id: 'asc',
      },
      select: publicBotFields,
    });
  },
  publicBot: async (root, { org_name, name }, { prisma }) => {
    return prisma.bots.findFirstOrThrow({
      where: {
        name,
        is_published: true,
        orgs: {
          name: org_name,
        },
      },
      select: publicBotFields,
    });
  },
};

export const Mutation: MutationResolvers<Context> = {
  botCreate: async (_, { org_id, input }, { prisma, user }) => {
    // Check if the user is a member of the org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: user.id,
        org_id,
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

export const PublicBot: PublicBotResolvers<Context> = {
  org: async ({ org_id }, args, { prisma }) => {
    return prisma.orgs.findFirstOrThrow({
      where: {
        id: org_id,
      },
      select: publicOrgFields,
    });
  },
  installation: async (
    { id, org_id: botOrgId },
    { org_id },
    { prisma, user },
  ) => {
    // Check if the user is a member of the given org or the bot's org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: user.id,
        org_id: {
          in: [org_id, botOrgId],
        },
      },
    });

    return prisma.bot_installations.findFirst({
      where: {
        bot_id: id,
        org_id,
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
