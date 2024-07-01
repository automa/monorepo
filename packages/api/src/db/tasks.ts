import { FastifyInstance } from 'fastify';

import { Prisma } from '@automa/prisma';

export const taskCreate = async (
  app: {
    prisma: FastifyInstance['prisma'];
  },
  data: Prisma.XOR<Prisma.tasksCreateInput, Prisma.tasksUncheckedCreateInput>,
) => {
  const task = await app.prisma.tasks.create({
    data,
  });

  return task;
};
