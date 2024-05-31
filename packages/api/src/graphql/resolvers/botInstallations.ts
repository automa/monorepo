import {
  BotInstallationResolvers,
  MutationResolvers,
  QueryResolvers,
  publicBotFields,
} from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  botInstallations: async (root, { org_id }, { user, prisma }) => {
    // Check if the user is a member of the org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: user.id,
        org_id,
      },
    });

    return prisma.bot_installations.findMany({
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
  botInstall: async (_, { org_id, input: { bot_id } }, { prisma, user }) => {
    // Check if the user is a member of the org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: user.id,
        org_id,
      },
    });

    // Check if org owns the bot or if the bot is published
    await prisma.bots.findFirstOrThrow({
      where: {
        id: bot_id,
        OR: [
          {
            org_id,
          },
          {
            is_published: true,
          },
        ],
      },
    });

    return prisma.bot_installations.create({
      data: {
        org_id,
        bot_id,
      },
    });
  },
};

export const BotInstallation: BotInstallationResolvers<Context> = {
  org: async ({ org_id }, args, { prisma }) => {
    return prisma.orgs.findFirstOrThrow({
      where: {
        id: org_id,
      },
    });
  },
  bot: async ({ bot_id }, args, { prisma }) => {
    return prisma.bots.findFirstOrThrow({
      where: {
        id: bot_id,
      },
      select: publicBotFields,
    });
  },
};
