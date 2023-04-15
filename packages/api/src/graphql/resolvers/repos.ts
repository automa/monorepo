import { QueryResolvers, RepoResolvers } from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
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
