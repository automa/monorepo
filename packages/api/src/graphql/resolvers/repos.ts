import { QueryResolvers, RepoResolvers } from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  repos: async (root, { org_id }, { user, prisma }) => {
    const result = await prisma.user_repos.findMany({
      where: {
        user_id: user.id,
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
  repo: (root, { provider_type, org_name, name }, { user, prisma }) => {
    return prisma.repos.findFirst({
      where: {
        name,
        orgs: {
          name: org_name,
          provider_type,
        },
        user_repos: {
          some: {
            user_id: user.id,
          },
        },
      },
    });
  },
};

export const Repo: RepoResolvers<Context> = {
  org: ({ org_id }, args, { prisma }) => {
    return prisma.orgs.findUniqueOrThrow({
      where: {
        id: org_id,
      },
    });
  },
};
