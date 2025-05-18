import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { captureException, init, withScope } from '@sentry/node';

import {
  env,
  environment,
  isProduction,
  product,
  service,
  version,
} from '../env';
import { tracer } from '../telemetry';

declare module 'fastify' {
  interface FastifyInstance {
    error: {
      capture: <E>(err: E, context?: Record<string, unknown>) => void;
    };
  }
}

const errorPlugin: FastifyPluginAsync = async (app) => {
  const isErrorTrackingEnabled = isProduction && !!env.SENTRY_DSN;

  await tracer.startActiveSpan('error:initialize', async (span) => {
    if (isErrorTrackingEnabled) {
      init({
        dsn: env.SENTRY_DSN,
        release: `${product}-${service}@${version}`,
        environment,
        maxValueLength: 4096,
      });
    }

    app.decorate('error', {
      capture: (err: any, context?: Record<string, unknown>) => {
        tracer.startActiveSpan('error:capture', (span) => {
          if (isErrorTrackingEnabled) {
            withScope((scope) => {
              scope.setContext('error', { message: err.message, ...context });
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
