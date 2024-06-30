import {
  MutationResolvers,
  QueryResolvers,
  taskMessageSchema,
  TaskResolvers,
} from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  tasks: async (root, { org_id }, { userId, prisma }) => {
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
  taskCreate: async (_, { org_id, input }, { userId, prisma }) => {
    // Check if the user is a member of the org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: userId,
        org_id,
      },
    });

    const data = taskMessageSchema.parse(input);

    return prisma.tasks.create({
      data: {
        org_id,
        title: data.content.slice(0, 255),
        created_by: userId,
        task_items: {
          create: [
            {
              type: 'message',
              content: data.content,
            },
          ],
        },
      },
    });
  },
};

export const Task: TaskResolvers<Context> = {
  org: ({ id }, args, { prisma }) => {
    return prisma.tasks
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .orgs();
  },
  author: ({ id }, args, { prisma }) => {
    return prisma.tasks
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .users();
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
