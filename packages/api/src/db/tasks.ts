import { randomBytes } from 'node:crypto';

import { FastifyInstance } from 'fastify';

import { Prisma } from '@automa/prisma';

export const taskCreate = async (
  app: {
    prisma: FastifyInstance['prisma'];
    events: FastifyInstance['events'];
  },
  data: Prisma.XOR<
    Omit<Prisma.tasksCreateInput, 'token'>,
    Omit<Prisma.tasksUncheckedCreateInput, 'token'>
  >,
) => {
  const task = await app.prisma.tasks.create({
    data: {
      ...data,
      token: randomBytes(128).toString('base64url'),
    },
  });

  await app.events.taskCreated.publish({ id: task.id });

  return task;
};
