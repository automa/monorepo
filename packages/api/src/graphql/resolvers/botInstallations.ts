import {
  BotInstallationResolvers,
  MutationResolvers,
  QueryResolvers,
  publicBotFields,
  publicOrgFields,
} from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  botInstallations: async (root, { org_id }, { userId, prisma }) => {
    // Check if the user is a member of the org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: userId,
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
  botInstall: async (_, { org_id, input: { bot_id } }, { userId, prisma }) => {
    // Check if the user is a member of the org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: userId,
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
  botUninstall: async (_, { org_id, bot_id }, { userId, prisma }) => {
    // Check if the user is a member of the org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: userId,
        org_id,
      },
    });

    const { count } = await prisma.bot_installations.deleteMany({
      where: {
        org_id,
        bot_id,
      },
    });

    return count > 0;
  },
};

export const BotInstallation: BotInstallationResolvers<Context> = {
  org: ({ id }, args, { prisma }) => {
    return prisma.bot_installations
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .orgs({
        select: publicOrgFields,
      });
  },
  bot: ({ id }, args, { prisma }) => {
    return prisma.bot_installations
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .bots({
        select: publicBotFields,
      });
  },
};
