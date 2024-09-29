import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { api } from '@opentelemetry/sdk-node';
import Statsig, { DynamicConfig } from 'statsig-node';

import { orgs, users } from '@automa/prisma';

import { env, environment, isTest } from '../env';
import { tracer } from '../telemetry';

declare module 'fastify' {
  interface FastifyInstance {
    optimizer: {
      gate: (key: string, user?: users, org?: orgs) => boolean;
      config: (key: string, user?: users, org?: orgs) => DynamicConfig;
      experiment: (key: string, user?: users, org?: orgs) => DynamicConfig;
    };
  }
}

const marshallUser = (user?: users, org?: orgs) =>
  user
    ? {
        userID: `${user.id}`,
        email: user.email,
        customIDs: {
          ...(org?.id && {
            orgID: `${org.id}`,
          }),
        },
      }
    : {
        userID: '0',
      };

const optimizerPlugin: FastifyPluginAsync = async (app) => {
  const isOptimizerEnabled = !isTest && !!env.STATSIG_KEY;

  await tracer.startActiveSpan('optimizer:initialize', async (span) => {
    if (isOptimizerEnabled) {
      await Statsig.initialize(env.STATSIG_KEY, {
        environment: {
          tier: environment,
        },
      });
    }

    app.decorate('optimizer', {
      gate: (gate: string, user?: users, org?: orgs) =>
        tracer.startActiveSpan('optimizer:gate', (span) => {
          span.setAttribute('gate', gate);

          try {
            const value = isOptimizerEnabled
              ? Statsig.checkGateSync(marshallUser(user, org), gate)
              : false;

            span.end();

            return !!value;
          } catch (error) {
            span.setStatus({ code: api.SpanStatusCode.ERROR });
            span.end();

            throw error;
          }
        }),
      config: (key: string, user?: users, org?: orgs) =>
        tracer.startActiveSpan('optimizer:config', (span) => {
          span.setAttribute('key', key);

          try {
            const config = isOptimizerEnabled
              ? Statsig.getConfigSync(marshallUser(user, org), key)
              : new DynamicConfig(key);

            span.end();

            return config;
          } catch (error) {
            span.setStatus({ code: api.SpanStatusCode.ERROR });
            span.end();

            throw error;
          }
        }),
      experiment: (experiment: string, user?: users, org?: orgs) =>
        tracer.startActiveSpan('optimizer:experiment', (span) => {
          span.setAttribute('experiment', experiment);

          try {
            const config = isOptimizerEnabled
              ? Statsig.getExperimentSync(marshallUser(user, org), experiment)
              : new DynamicConfig(experiment);

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
