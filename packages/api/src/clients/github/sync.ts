import { FastifyInstance, FastifyRequest } from 'fastify';

import { provider } from '@automa/prisma';

export const sync = async (
  app: FastifyInstance,
  request: FastifyRequest,
  userId: number,
  userOrg: { id: number; login: string } | null = null,
  waitForRepoSyncs = false,
) => {
  // Since the user might not have installed the github app on any of their orgs, we won't be able to read them.
  // This is why we create a personal org based on the user's github account.
  if (!userOrg) {
    userOrg = await request.github<{
      login: string;
      id: number;
    }>({
      path: '/user',
    });
  }

  const personalOrg = await app.prisma.orgs.upsert({
    where: {
      provider_type_provider_id: {
        provider_type: provider.github,
        provider_id: `${userOrg.id}`,
      },
    },
    update: {},
    create: {
      name: userOrg.login,
      provider_type: provider.github,
      provider_id: `${userOrg.id}`,
      is_user: true,
    },
  });

  // The user might have installed the app on multiple orgs, so we need to sync their memberships.
  const { installations } = await request.github<{
    installations: { id: number }[];
  }>({
    path: '/user/installations?per_page=100',
  });

  const orgs = [
    personalOrg,
    ...(await app.prisma.orgs.findMany({
      where: {
        github_installation_id: {
          in: installations.map(({ id }) => id),
        },
      },
    })),
  ];

  await app.prisma.user_orgs.createMany({
    data: orgs.map((org) => ({
      user_id: userId,
      org_id: org.id,
    })),
    skipDuplicates: true,
  });

  const repoSyncs = orgs
    .filter((o) => !!o.github_installation_id)
    .map(async (org) => {
      const { repositories } = await request.github<{
        // TODO: permissions
        repositories: { id: number }[];
      }>({
        path: `/user/installations/${org.github_installation_id}/repositories?per_page=100`,
      });

      const repos = await app.prisma.repos.findMany({
        where: {
          org_id: org.id,
          provider_id: {
            in: (repositories || []).map(({ id }) => `${id}`),
          },
        },
      });

      return app.prisma.user_repos.createMany({
        data: repos.map((repo) => ({
          user_id: userId,
          repo_id: repo.id,
        })),
        skipDuplicates: true,
      });
    });

  if (waitForRepoSyncs) {
    await Promise.all(repoSyncs);
  } else {
    Promise.all(repoSyncs);
  }
};
