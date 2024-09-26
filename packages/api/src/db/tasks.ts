import { randomBytes } from 'node:crypto';

import { Prisma } from '@automa/prisma';

import { Context } from './types';

export const taskCreate = async (
  { prisma, events }: Context,
  data: Prisma.XOR<
    Omit<Prisma.tasksCreateInput, 'token'>,
    Omit<Prisma.tasksUncheckedCreateInput, 'token'>
  >,
) => {
  const task = await prisma.tasks.create({
    data: {
      ...data,
      token: randomBytes(128).toString('base64url'),
    },
  });

  await events.taskCreated.publish({ id: task.id });

  return task;
};
