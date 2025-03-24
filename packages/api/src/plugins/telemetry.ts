import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import {
  ATTR_CLIENT_ADDRESS,
  ATTR_HTTP_REQUEST_METHOD,
  ATTR_HTTP_RESPONSE_STATUS_CODE,
  ATTR_HTTP_ROUTE,
  ATTR_URL_PATH,
} from '@opentelemetry/semantic-conventions/incubating';

import { meter } from '../telemetry';

const telemetryPlugin: FastifyPluginAsync = async (app) => {
  const requestCounter = meter.createCounter('http.request');
  const responseTimer = meter.createHistogram('http.response_time');

  app.addHook('onRequest', async (request) => {
    app.log.info(
      {
        'http.request.id': request.id,
        [ATTR_HTTP_REQUEST_METHOD]: request.method,
        [ATTR_HTTP_ROUTE]: request.routerPath,
        [ATTR_URL_PATH]: request.url,
        [ATTR_CLIENT_ADDRESS]: request.ip,
      },
      'Incoming request',
    );

    requestCounter.add(1, {
      [ATTR_HTTP_REQUEST_METHOD]: request.method,
      [ATTR_HTTP_ROUTE]: request.routerPath,
      [ATTR_URL_PATH]: request.url,
    });
  });

  app.addHook('onResponse', async (request, reply) => {
    const responseTime = reply.getResponseTime();

    app.log.info(
      {
        'http.request.id': request.id,
        [ATTR_HTTP_RESPONSE_STATUS_CODE]: reply.statusCode,
        'http.response.time': responseTime,
      },
      'Request completed',
    );

    responseTimer.record(responseTime, {
      [ATTR_HTTP_REQUEST_METHOD]: request.method,
      [ATTR_HTTP_ROUTE]: request.routerPath,
      [ATTR_URL_PATH]: request.url,
    });
  });

  app.addHook('onError', async (request, reply, error) => {
    app.log.error(
      {
        'http.request.id': request.id,
        'error.message': error.message,
        'error.stack': error.stack,
      },
      'Request errored',
    );
  });
};

export default fp(telemetryPlugin, {
  name: 'telemetry',
});
