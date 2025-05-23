import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLError } from 'graphql';

import {
  MutationResolvers,
  publicBotFields,
  publicOrgFields,
  QueryResolvers,
  Resolvers,
} from '@automa/common';
import { task_item } from '@automa/prisma';

import { Context } from '../types';

import { botInstall } from '../../db';

export const Query: QueryResolvers<Context> = {
  botInstallations: async (root, { org_id, filter }, { userId, prisma }) => {
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
  botInstall: async (
    _,
    { org_id, input: { bot_id } },
    { userId, prisma, events },
  ) => {
    // Check if the user is a member of the org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: userId,
        org_id,
      },
    });

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
      throw new GraphQLError('Unprocessable Entity', {
        extensions: {
          code: ApolloServerErrorCode.BAD_USER_INPUT,
          errors: [
            {
              code: 'invalid',
              message: 'Bot not found',
              path: ['bot_id'],
            },
          ],
        },
      });
    }

    return botInstall(
      { prisma, events },
      {
        org_id,
        bot_id: bot.id,
      },
    );
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

export const BotInstallation: Resolvers<Context>['BotInstallation'] = {
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
