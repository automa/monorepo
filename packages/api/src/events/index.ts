import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { api } from '@opentelemetry/sdk-node';
import { Message, PubSub, Subscription, Topic } from '@google-cloud/pubsub';

import { env, isProduction } from '../env';
import { tracer } from '../telemetry';

import { QueueDefinition } from './types';

import queues from './queues';

type Queues = typeof queues;

type QueueInput<T> = T extends QueueDefinition<infer I> ? I : never;

declare module 'fastify' {
  interface FastifyInstance {
    events: {
      [K in keyof Queues]: {
        publish: (input: QueueInput<Queues[K]>) => Promise<void>;
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

  const pubsub = new PubSub({
    credentials: JSON.parse(env.GCP.CREDENTIALS),
    projectId: env.GCP.PROJECT_ID,
    ...(!isProduction && { apiEndpoint: env.GCP.PUBSUB_URL }),
  });

  const topics: Record<string, Topic> = {};
  const subscriptions: Subscription[] = [];

  for (const [key, { topic: name, handler }] of Object.entries(queues)) {
    const topic = pubsub.topic(name, {
      enableOpenTelemetryTracing: true,
    });

    await topic.get();

    topics[key] = topic;

    if (handler && subscribe) {
      const subscription = topic.subscription(name, {
        enableOpenTelemetryTracing: true,
        flowControl: {
          maxExtensionMinutes: isProduction ? 0 : 10,
        },
      });

      await subscription.get();

      subscription.on('message', (message: Message) =>
        tracer.startActiveSpan('events:consume', async (span) => {
          span.setAttribute('queue', key);

          try {
            await handler?.(app, JSON.parse(message.data.toString()));
            await message.ackWithResponse();
          } catch (error) {
            span.setStatus({ code: api.SpanStatusCode.ERROR });
            app.error.capture(error);
            await message.nackWithResponse();
          }

          span.end();
        }),
      );

      subscription.on('error', app.error.capture);

      subscriptions.push(subscription);
    }
  }

  app.addHook('onClose', async () => {
    for (const subscription of subscriptions) {
      await subscription.close();
    }

    for (const topic of Object.values(topics)) {
      await topic.flush();
    }

    pubsub.close();
  });

  app.decorate(
    'events',
    Object.entries(queues).reduce(
      (acc, [key, queue]) => ({
        ...acc,
        [key]: {
          publish: (input: QueueInput<typeof queue>) =>
            tracer.startActiveSpan('events:publish', async (span) => {
              span.setAttribute('queue', key);

              try {
                await topics[key].publishMessage({ json: input });

                span.end();
              } catch (error) {
                span.setStatus({ code: api.SpanStatusCode.ERROR });
                span.end();

                throw error;
              }
            }),
        },
      }),
      {},
    ),
  );
};

export default fp(eventsPlugin, {
  name: 'events',
});
