import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Queue, Worker } from 'bullmq';
import { BullMQOtel } from 'bullmq-otel';
import Redis from 'ioredis';

import { env } from '../env';

import { JobDefinition } from './types';

import jobs from './jobs';

type Jobs = typeof jobs;

type JobInput<T> = T extends JobDefinition<infer I> ? I : never;

type JobsInputIntersection<T> = (
  T extends any ? (k: T) => void : never
) extends (k: infer I) => void
  ? I
  : never;

declare module 'fastify' {
  interface FastifyInstance {
    events: {
      [K in keyof Jobs]: {
        publish: (
          id: string | number,
          input: JobInput<Jobs[K]>,
        ) => Promise<void>;
        bulkPublish: (
          jobs: {
            id: string | number;
            input: JobInput<Jobs[K]>;
          }[],
        ) => void;
      };
    };
  }
}

const eventsPlugin: FastifyPluginAsync<{
  events?: {
    subscribe?: boolean;
  };
}> = async (app, { events: options }) => {
  const subscribe = options?.subscribe ?? true;

  const connection = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
  });

  const queue = new Queue('events', {
    connection,
    defaultJobOptions: {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 10 * 60 * 1000, // 10 minutes
      },
      removeOnComplete: {
        age: 24 * 60 * 60, // 1 day
      },
      removeOnFail: false,
    },
    telemetry: new BullMQOtel('events'),
  });

  // Add cron jobs to the queue
  for (const [key, job] of Object.entries(jobs)) {
    if (!job.repeat) {
      continue;
    }

    await queue.upsertJobScheduler(key, job.repeat, {
      name: key,
      data: {},
    });
  }

  const worker = new Worker<
    JobsInputIntersection<JobInput<Jobs[keyof Jobs]>>,
    void,
    keyof Jobs
  >(
    'events',
    async (job) => {
      const { handler } = jobs[job.name];

      if (handler && subscribe) {
        try {
          app.log.info(job.data, `Processing ${job.name} event`);

          await handler(app, job.data);
        } catch (error) {
          app.error.capture(error);
          throw error;
        }
      }
    },
    {
      connection,
      telemetry: new BullMQOtel('events'),
    },
  );

  worker.on('error', app.error.capture);

  app.addHook('onClose', async () => {
    await worker.close();
    await connection.quit();
  });

  app.decorate(
    'events',
    Object.entries(jobs).reduce(
      (acc, [key, job]) => ({
        ...acc,
        [key]: {
          publish: (id: string | number, input: JobInput<typeof job>) =>
            queue.add(key, input, {
              jobId: `${key}-${id}`,
            }),
          bulkPublish: (
            jobs: {
              id: string | number;
              input: JobInput<typeof job>;
            }[],
          ) => {
            queue.addBulk(
              jobs.map(({ id, input }) => ({
                name: key,
                data: input,
                opts: {
                  jobId: `${key}-${id}`,
                },
              })),
            );
          },
        },
      }),
      {},
    ),
  );
};

export default fp(eventsPlugin, {
  name: 'events',
});
