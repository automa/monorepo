import { createHmac, timingSafeEqual } from 'node:crypto';

import { FastifyInstance } from 'fastify';

import { env } from '../../env';
import { logger, SeverityNumber } from '../../telemetry';

import { linear, LinearEventType } from '../../hooks';

export default async function (app: FastifyInstance) {
  app.post<{
    Body: {
      action: string;
    };
  }>('/linear', async (request, reply) => {
    // Get linear event
    const event = request.headers['linear-event'];

    if (!event || typeof event !== 'string' || !request.body) {
      request.log.error('No event');
      return reply.unauthorized();
    }

    logger.emit({
      severityNumber: SeverityNumber.INFO,
      body: 'Received linear event',
      attributes: {
        event,
        action: request.body.action,
      },
    });

    const handler =
      linear[event as LinearEventType]?.[request.body.action ?? event];

    if (!handler) {
      logger.emit({
        severityNumber: SeverityNumber.INFO,
        body: 'Ignoring event',
        attributes: {
          event,
          action: request.body.action,
        },
      });

      return reply.code(204).send();
    }

    // Get github signature
    const signature = request.headers['linear-signature'];

    if (!signature || typeof signature !== 'string') {
      logger.emit({
        severityNumber: SeverityNumber.WARN,
        body: 'No signature',
      });

      return reply.unauthorized();
    }

    // Verify github sha256 signature
    let hmac = createHmac('sha256', env.LINEAR_APP.WEBHOOK_SECRET);
    hmac = hmac.update(JSON.stringify(request.body));

    const digest = Buffer.from(hmac.digest('hex'), 'utf8');
    const checksum = Buffer.from(signature, 'utf8');

    if (
      checksum.length !== digest.length ||
      !timingSafeEqual(digest, checksum)
    ) {
      logger.emit({
        severityNumber: SeverityNumber.WARN,
        body: 'Invalid signature',
      });

      return reply.unauthorized();
    }

    // Process event
    await handler(app, request.body);

    return reply.send();
  });
}
