import {
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  taskMessageSchema,
} from '@automa/common';
import { task_item } from '@automa/prisma';

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

    const data = taskMessageSchema.parse(input);

    return taskCreate(
      { prisma, events },
      {
        org_id,
        title: data.content.slice(0, 255),
        task_items: {
          create: [
            {
              actor_user_id: userId,
              type: task_item.message,
              data: { content: data.content },
            },
            {
              actor_user_id: userId,
              type: task_item.origin,
              data: {
                orgId: org_id,
              },
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
