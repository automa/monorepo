import { OrgResolvers, QueryResolvers } from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  orgs: async (root, args, { user, prisma }) => {
    const result = await prisma.user_orgs.findMany({
      where: {
        user_id: user.id,
      },
      include: {
        orgs: true,
      },
    });

    return result.map((r) => r.orgs);
  },
  org: async (root, { provider_type, name }, { user, prisma }) => {
    return prisma.orgs.findFirst({
      where: {
        provider_type,
        name,
        user_orgs: {
          some: {
            user_id: user.id,
          },
        },
      },
    });
  },
};

export const Org: OrgResolvers<Context> = {
  repos: async ({ id }, args, { user, prisma }) => {
    const result = await prisma.user_repos.findMany({
      where: {
        user_id: user.id,
        repos: {
          org_id: id,
        },
      },
      include: {
        repos: true,
      },
    });

    return result.map((r) => r.repos);
  },
  project_providers: async ({ id }, args, { user, prisma }) => {
    return prisma.org_project_providers.findMany({
      where: {
        org_id: id,
      },
    });
  },
};
