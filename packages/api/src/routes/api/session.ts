import { FastifyInstance } from 'fastify';

export default async function (app: FastifyInstance) {
  app.get('/session', async (request, reply) => {
    const user = await app.prisma.users.findUnique({
      where: {
        id: request.userId!,
      },
    });

    if (!user) {
      return reply.unauthorized();
    }

    return reply.send({
      id: user.id,
      email: user.email,
    });
  });
}
