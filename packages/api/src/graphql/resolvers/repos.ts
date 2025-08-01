import { QueryResolvers, Resolvers } from '@automa/common';
import { task_item } from '@automa/prisma';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  repos: async (root, { org_id, filter }, { userId, prisma }) => {
    const result = await prisma.user_repos.findMany({
      where: {
        user_id: userId,
        repos: {
          org_id,
          is_archived: filter?.is_archived ?? undefined,
        },
      },
      include: {
        repos: true,
      },
      orderBy: {
        repos: {
          id: 'asc',
        },
      },
    });

    return result.map((r) => r.repos);
  },
  repo: async (root, { org_id, name }, { userId, prisma }) => {
    return prisma.repos.findFirst({
      where: {
        name,
        org_id,
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
  org: ({ id }, args, { prisma }) => {
    return prisma.repos
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .orgs();
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
