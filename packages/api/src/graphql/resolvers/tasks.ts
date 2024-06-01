import {
  MutationResolvers,
  QueryResolvers,
  TaskResolvers,
  taskMessageSchema,
} from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  tasks: async (root, { org_id }, { user, prisma }) => {
    // Check if the user is a member of the org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: user.id,
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
};

export const Mutation: MutationResolvers<Context> = {
  taskCreate: async (_, { org_id, input }, { prisma, user }) => {
    // Check if the user is a member of the org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: user.id,
        org_id,
      },
    });

    const data = taskMessageSchema.parse(input);

    // TODO: Create task item for the message (blocked testing due to lack of task items in the schema)
    return prisma.tasks.create({
      data: {
        org_id,
        title: data.content.slice(0, 255),
        created_by: user.id,
      },
    });
  },
};

export const Task: TaskResolvers<Context> = {
  org: ({ org_id }, args, { prisma }) => {
    return prisma.orgs.findUniqueOrThrow({
      where: {
        id: org_id,
      },
    });
  },
  author: ({ created_by }, args, { prisma }) => {
    if (!created_by) return null;

    return prisma.users.findUniqueOrThrow({
      where: {
        id: created_by,
      },
    });
  },
  // TODO: Implement task items
};
