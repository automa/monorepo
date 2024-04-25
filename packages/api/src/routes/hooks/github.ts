import { createHmac, timingSafeEqual } from 'node:crypto';

import { FastifyInstance } from 'fastify';

import { env } from '../../env';
import { logger, SeverityNumber } from '../../telemetry';
import { GithubEventType, github } from '../../hooks';

export default async function (app: FastifyInstance) {
  app.post<{
    Body: {
      action: string;
    };
  }>('/github', async (request, reply) => {
    // Get github event
    const event = request.headers['x-github-event'];

    if (!event || typeof event !== 'string' || !request.body) {
      request.log.error('No event');
      return reply.unauthorized();
    }

    logger.emit({
      severityNumber: SeverityNumber.INFO,
      body: 'Received github event',
      attributes: {
        event,
        action: request.body.action,
      },
    });

    const handler =
      github[event as GithubEventType]?.[request.body.action ?? event];

    if (!handler) {
      logger.emit({
        severityNumber: SeverityNumber.INFO,
        body: 'Ignoring event',
        attributes: {
          event,
          action: request.body.action,
        },
      });

      return reply.status(204).send();
    }

    // Get github signature
    const signature = request.headers['x-hub-signature-256'];

    if (!signature || typeof signature !== 'string') {
      logger.emit({
        severityNumber: SeverityNumber.WARN,
        body: 'No signature',
      });

      return reply.unauthorized();
    }

    // Verify github sha256 signature
    let hmac = createHmac('sha256', env.GITHUB_APP.WEBHOOK_SECRET);
    hmac = hmac.update(JSON.stringify(request.body));

    const digest = Buffer.from(`sha256=${hmac.digest('hex')}`, 'utf8');
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

    reply.status(200).send();
  });
}
