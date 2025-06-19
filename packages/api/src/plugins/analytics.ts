import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Analytics, TrackParams } from '@segment/analytics-node';

import { orgs, users } from '@automa/prisma';

import { env, environment, isProduction } from '../env';
import { tracer } from '../telemetry';

declare module 'fastify' {
  interface FastifyInstance {
    analytics: {
      page: (
        category: string,
        name: string,
        properties?: TrackParams['properties'],
        user?: users,
        org?: orgs,
      ) => void;
      track: (
        event: string,
        properties?: TrackParams['properties'],
        user?: users,
        org?: orgs,
      ) => void;
    };
  }
}

const marshallEvent = (
  properties?: TrackParams['properties'],
  user?: users,
  org?: orgs,
) => ({
  userId: `${user?.id ?? 0}`,
  properties: {
    ...properties,
    statsigEnvironment: {
      tier: environment,
    },
    statsigCustomIDs: [...(org?.id ? ['orgID', `${org.id}`] : [])],
  },
});

const analyticsPlugin: FastifyPluginAsync = async (app) => {
  const isAnalyticsEnabled = isProduction && !!env.SEGMENT_KEY;

  await tracer.startActiveSpan('analytics:initialize', async (span) => {
    let analytics: Analytics | undefined;

    if (isAnalyticsEnabled) {
      analytics = new Analytics({
        writeKey: env.SEGMENT_KEY!,
        ...(!isProduction && { maxEventsInBatch: 1 }),
      });
    }

    analytics?.on('error', (error) => {
      app.error.capture(error);
    });

    const page = (
      category: string,
      name: string,
      properties?: TrackParams['properties'],
      user?: users,
      org?: orgs,
    ) =>
      analytics?.page({
        ...marshallEvent(properties, user, org),
        category,
        name,
      });

    const track = (
      event: string,
      properties?: TrackParams['properties'],
      user?: users,
      org?: orgs,
    ) =>
      analytics?.track({
        ...marshallEvent(properties, user, org),
        event,
      });

    app.decorate('analytics', {
      page,
      track,
    });

    app.addHook('onClose', async () => {
      await analytics?.closeAndFlush();
    });

    span.end();
  });
};

export default fp(analyticsPlugin, {
  name: 'analytics',
});
