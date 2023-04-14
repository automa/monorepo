import { FastifyInstance, FastifyRequest } from 'fastify';

const sync = async (app: FastifyInstance, request: FastifyRequest) => {
  const { installations } = await request.github<{
    installations: { id: number }[];
  }>({
    path: '/user/installations?per_page=100',
  });

  const orgs = await app.prisma.orgs.findMany({
    where: {
      github_installation_id: {
        in: installations.map(({ id }) => id),
      },
    },
  });

  await app.prisma.user_orgs.createMany({
    data: orgs.map((org) => ({
      user_id: request.session.userId!,
      org_id: org.id,
    })),
    skipDuplicates: true,
  });

  await Promise.all(
    orgs.map(async (org) => {
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
            in: repositories.map(({ id }) => `${id}`),
          },
        },
      });

      return app.prisma.user_repos.createMany({
        data: repos.map((repo) => ({
          user_id: request.session.userId!,
          repo_id: repo.id,
        })),
        skipDuplicates: true,
      });
    }),
  );
};

export default sync;
