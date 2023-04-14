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
};

export default sync;
