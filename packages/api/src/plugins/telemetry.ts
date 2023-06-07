import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

import { logger, meter, SeverityNumber } from '../telemetry';

const telemetryPlugin: FastifyPluginAsync = async (app) => {
  const responseTimer = meter.createHistogram('http_response_time');

  app.addHook('onRequest', async (request) => {
    logger.emit({
      severityNumber: SeverityNumber.INFO,
      body: 'Incoming request',
      attributes: {
        reqId: request.id,
        reqMethod: request.method,
        reqUrl: request.url,
        reqIp: request.ip,
      },
    });
  });

  app.addHook('onResponse', async (request, reply) => {
    const responseTime = reply.getResponseTime();

    logger.emit({
      severityNumber: SeverityNumber.INFO,
      body: 'Request completed',
      attributes: {
        reqId: request.id,
        responseStatusCode: reply.statusCode,
        responseTime,
      },
    });

    responseTimer.record(responseTime, {
      method: request.routerMethod,
      url: request.routerPath,
    });
  });

  app.addHook('onError', async (request, reply, error) => {
    logger.emit({
      severityNumber: SeverityNumber.ERROR,
      body: 'Request errored',
      attributes: {
        reqId: request.id,
        responseStatusCode: reply.statusCode,
        errStack: error.stack,
      },
    });
  });
};

export default fp(telemetryPlugin, {
  name: 'telemetry',
});
