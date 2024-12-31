import { randomBytes } from 'node:crypto';

import { Prisma, task_activity, task_item, task_state } from '@automa/prisma';

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

  await events.taskCreated.publish(task.id, {
    taskId: task.id,
  });

  return task;
};

export const taskUpdateState = async (
  { prisma }: Context,
  taskId: number,
  state: task_state,
  actor?: {
    user_id?: number;
    bot_id?: number;
    data?: Prisma.JsonValue;
  },
) => {
  return prisma.$transaction(async (tx) => {
    // TODO: Probably should do `FOR UPDATE` in order to lock the task
    const task = await tx.tasks.findUniqueOrThrow({
      where: {
        id: taskId,
      },
    });

    if (task.state === state) {
      return;
    }

    return tx.tasks.update({
      where: {
        id: task.id,
      },
      data: {
        state,
        task_items: {
          create: [
            {
              ...(actor?.user_id && {
                users: {
                  connect: {
                    id: actor.user_id,
                  },
                },
              }),
              ...(actor?.bot_id && {
                bots: {
                  connect: {
                    id: actor.bot_id,
                  },
                },
              }),
              ...(actor?.data && {
                data: actor.data,
              }),
              type: task_item.activity,
              task_activities: {
                create: {
                  type: task_activity.state,
                  from_state: task.state,
                  to_state: state,
                },
              },
            },
          ],
        },
      },
    });
  });
};
