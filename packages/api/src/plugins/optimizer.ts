import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import Statsig, { DynamicConfig } from 'statsig-node';
import { api } from '@opentelemetry/sdk-node';

import { env, environment } from '../env';
import { tracer } from '../telemetry';

declare module 'fastify' {
  interface FastifyInstance {
    optimizer: {
      config: (key: string) => Promise<DynamicConfig>;
    };
  }
}

const optimizerPlugin: FastifyPluginAsync = async (app) => {
  await tracer.startActiveSpan('optimizer:initialize', async (span) => {
    await Statsig.initialize(env.STATSIG_KEY, {
      environment: {
        tier: environment,
      },
    });

    app.decorate('optimizer', {
      config: (key: string) =>
        tracer.startActiveSpan(`optimizer:config`, async (span) => {
          span.setAttribute('key', key);

          try {
            const config = await Statsig.getConfig({ userID: '0' }, key);

            span.end();

            return config;
          } catch (error) {
            span.setStatus({ code: api.SpanStatusCode.ERROR });
            span.end();

            throw error;
          }
        }),
    });

    span.end();
  });
};

export default fp(optimizerPlugin, {
  name: 'optimizer',
});
