import { QueryResolvers, Resolvers } from '@automa/common';
import { task_item } from '@automa/prisma';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  repos: async (root, { org_id }, { userId, prisma }) => {
    const result = await prisma.user_repos.findMany({
      where: {
        user_id: userId,
        repos: {
          org_id,
        },
      },
      include: {
        repos: true,
      },
    });

    return result.map((r) => r.repos);
  },
  // TODO: Look into removing the below query or correcting it
  repo: (root, { org_name, name }, { userId, prisma }) => {
    return prisma.repos.findFirst({
      where: {
        name,
        orgs: {
          name: org_name,
        },
        user_repos: {
          some: {
            user_id: userId,
          },
        },
      },
    });
  },
};

export const Repo: Resolvers<Context>['Repo'] = {
  org: ({ org_id }, args, { prisma }) => {
    return prisma.orgs.findUniqueOrThrow({
      where: {
        id: org_id,
      },
    });
  },
  tasks_count: async ({ id, org_id }, args, { prisma }) => {
    const counts = await prisma.tasks.groupBy({
      by: ['state'],
      where: {
        org_id,
        task_items: {
          some: {
            type: task_item.repo,
            repo_id: id,
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
