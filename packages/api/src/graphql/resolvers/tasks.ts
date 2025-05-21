import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLError } from 'graphql';

import {
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  taskCreateSchema,
} from '@automa/common';
import { bot, task_item } from '@automa/prisma';

import { Context } from '../types';

import { taskCreate } from '../../db';

export const Query: QueryResolvers<Context> = {
  tasks: async (root, { org_id, filter }, { userId, prisma }) => {
    // Check if the user is a member of the org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: userId,
        org_id,
      },
    });

    return prisma.tasks.findMany({
      where: {
        org_id,
        is_scheduled: filter?.is_scheduled ?? undefined,
        ...(filter?.bot_id && {
          task_items: {
            some: {
              type: task_item.bot,
              bot_id: filter.bot_id,
            },
          },
        }),
      },
      orderBy: {
        id: 'desc',
      },
    });
  },
  task: async (root, { org_id, id }, { userId, prisma }) => {
    // Check if the user is a member of the org the task belongs to
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: userId,
        org_id,
      },
    });

    return prisma.tasks.findUniqueOrThrow({
      where: {
        id,
        org_id,
      },
    });
  },
};

export const Mutation: MutationResolvers<Context> = {
  taskCreate: async (_, { org_id, input }, { userId, prisma, events }) => {
    // Check if the user is a member of the org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: userId,
        org_id,
      },
    });

    const data = taskCreateSchema.parse(input);

    const [repo, botInstallation] = await Promise.all([
      prisma.repos.findFirst({
        where: {
          id: data.repo_id,
        },
      }),
      prisma.bot_installations.findFirst({
        where: {
          id: data.bot_installation_id,
          bots: {
            type: bot.manual,
          },
        },
      }),
    ]);

    if (!botInstallation) {
      throw new GraphQLError('Unprocessable Entity', {
        extensions: {
          code: ApolloServerErrorCode.BAD_USER_INPUT,
          errors: [
            {
              code: 'invalid',
              message: 'Bot installation not found',
              path: ['bot_installation_id'],
            },
          ],
        },
      });
    }

    if (!repo) {
      throw new GraphQLError('Unprocessable Entity', {
        extensions: {
          code: ApolloServerErrorCode.BAD_USER_INPUT,
          errors: [
            {
              code: 'invalid',
              message: 'Repository not found',
              path: ['repo_id'],
            },
          ],
        },
      });
    }

    return taskCreate(
      { prisma, events },
      {
        org_id,
        title: data.title,
        task_items: {
          create: [
            ...(data.content
              ? [
                  {
                    actor_user_id: userId,
                    // TODO: Save task message as tiptap
                    // Need to change the converters for integrations too
                    type: task_item.message,
                    data: { content: data.content },
                  },
                ]
              : []),
            {
              actor_user_id: userId,
              type: task_item.origin,
              data: {
                orgId: org_id,
              },
            },
            {
              type: task_item.repo,
              actor_user_id: userId,
              repo_id: repo.id,
            },
            {
              type: task_item.bot,
              actor_user_id: userId,
              bot_id: botInstallation.bot_id,
            },
          ],
        },
      },
    );
  },
};

export const Task: Resolvers<Context>['Task'] = {
  org: ({ id }, args, { prisma }) => {
    return prisma.tasks
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .orgs();
  },
  items: ({ id }, args, { prisma }) => {
    return prisma.tasks
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .task_items({
        orderBy: {
          id: 'asc',
        },
      });
  },
};

export const TaskItem: Resolvers<Context>['TaskItem'] = {
  actor_user: ({ id }, args, { prisma }) => {
    return prisma.task_items
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .users();
  },
  bot: ({ id }, args, { prisma }) => {
    return prisma.task_items
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .bots();
  },
  repo: ({ id }, args, { prisma }) => {
    return prisma.task_items
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .repos();
  },
  activity: ({ id }, args, { prisma }) => {
    return prisma.task_items
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .task_activities();
  },
};
