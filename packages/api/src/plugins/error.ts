import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { init, captureException, withScope } from '@sentry/node';

import { env, product, service, version } from '../env';
import { tracer } from '../telemetry';

declare module 'fastify' {
  interface FastifyInstance {
    error: {
      capture: <E>(err: E) => void;
    };
  }
}

const errorPlugin: FastifyPluginAsync = async (app) => {
  await tracer.startActiveSpan('error:initialize', async (span) => {
    if (env.SENTRY.ENABLED) {
      init({
        dsn: env.SENTRY.DSN,
        release: `${product}-${service}@${version}`,
      });
    }

    app.decorate('error', {
      capture: (err: any) => {
        tracer.startActiveSpan(`error:capture`, (span) => {
          if (env.SENTRY.ENABLED) {
            withScope((scope) => {
              scope.setContext('error', { message: err.message });
              captureException(err);
            });
          } else {
            console.error(err);
          }

          span.end();
        });
      },
    });

    process.removeAllListeners('unhandledRejection');
    process.on('unhandledRejection', app.error.capture);

    span.end();
  });
};

export default fp(errorPlugin, {
  name: 'error',
});
