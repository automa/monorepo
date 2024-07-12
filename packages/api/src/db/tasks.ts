import { FastifyInstance } from 'fastify';

import { Prisma } from '@automa/prisma';

export const taskCreate = async (
  app: {
    prisma: FastifyInstance['prisma'];
    events: FastifyInstance['events'];
  },
  data: Prisma.XOR<Prisma.tasksCreateInput, Prisma.tasksUncheckedCreateInput>,
) => {
  const task = await app.prisma.tasks.create({
    data,
  });

  await app.events.taskCreated.publish({ id: task.id });

  return task;
};
