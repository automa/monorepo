import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { Analytics } from '@segment/analytics-node';

import { env, isProduction } from '../env';
import { tracer } from '../telemetry';

declare module 'fastify' {
  interface FastifyInstance {
    analytics: Analytics;
  }
}

const analyticsPlugin: FastifyPluginAsync = async (app) => {
  await tracer.startActiveSpan('analytics:initialize', async (span) => {
    const analytics = new Analytics({
      writeKey: env.SEGMENT.KEY,
      disable: !env.SEGMENT.ENABLED,
      ...(!isProduction && { maxEventsInBatch: 1 }),
    });

    analytics.on('error', (error) => {
      app.error.capture(error);
    });

    app.decorate('analytics', analytics);

    app.addHook('onClose', async () => {
      await analytics.closeAndFlush();
    });

    span.end();
  });
};

export default fp(analyticsPlugin, {
  name: 'analytics',
});
