import {
  MutationResolvers,
  publicBotFields,
  publicOrgFields,
  QueryResolvers,
  Resolvers,
} from '@automa/common';
import { task_item } from '@automa/prisma';

import { Context } from '../types';
import { throwGraphQLError } from '../utils';

import { botInstall } from '../../db';

export const Query: QueryResolvers<Context> = {
  botInstallations: async (root, { org_id, filter }, { prisma }) => {
    return prisma.bot_installations.findMany({
      where: {
        org_id,
        bots: {
          type: filter?.type ?? undefined,
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    });
  },
};

export const Mutation: MutationResolvers<Context> = {
  botInstall: async (_, { org_id, input: { bot_id } }, { prisma, events }) => {
    // Check if org owns the bot or if the bot is published
    const bot = await prisma.bots.findFirst({
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

    if (!bot) {
      return throwGraphQLError('invalid', 'Bot not found', ['bot_id']);
    }

    return botInstall(
      { prisma, events },
      {
        org_id,
        bot_id: bot.id,
      },
    );
  },
  botUninstall: async (_, { org_id, bot_id }, { prisma }) => {
    const { count } = await prisma.bot_installations.deleteMany({
      where: {
        org_id,
        bot_id,
      },
    });

    return count > 0;
  },
};

export const PublicBotInstallation: Resolvers<Context>['PublicBotInstallation'] =
  {
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
  };

export const BotInstallation: Resolvers<Context>['BotInstallation'] = {
  org: ({ id }, args, { prisma }) => {
    return prisma.bot_installations
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .orgs();
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
  tasks_count: async ({ org_id, bot_id }, args, { prisma }) => {
    const counts = await prisma.tasks.groupBy({
      by: ['state'],
      where: {
        org_id,
        task_items: {
          some: {
            type: task_item.bot,
            bot_id,
          },
        },
      },
      _count: true,
    });

    return counts.map(({ _count, state }) => ({
      state,
      count: _count,
    }));
  },
};
