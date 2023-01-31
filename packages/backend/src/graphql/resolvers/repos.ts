import { QueryResolvers } from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  repos: async (root, args, { user, prisma }) => {
    const result = await prisma.user_repos.findMany({
      where: {
        user_id: user.id,
      },
      include: {
        repos: true,
      },
    });

    return result.map((r) => r.repos);
  },
  repo: async (root, { id }, { user, prisma }) => {
    const result = await prisma.user_repos.findFirst({
      where: {
        user_id: user.id,
        repo_id: id,
      },
      include: {
        repos: true,
      },
    });

    return result?.repos ?? null;
  },
};

export const Repo = {};
