import { createHmac, timingSafeEqual } from 'node:crypto';

import { FastifyInstance } from 'fastify';

import { env } from '../../env';

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

    app.log.info(
      {
        event,
        action: request.body.action,
      },
      'Received linear event',
    );

    const handler =
      linear[event as LinearEventType]?.[request.body.action ?? event];

    if (!handler) {
      app.log.info(
        {
          event,
          action: request.body.action,
        },
        'Ignoring event',
      );

      return reply.code(204).send();
    }

    // Get linear signature
    const signature = request.headers['linear-signature'];

    if (!signature || typeof signature !== 'string') {
      app.log.warn('No signature');

      return reply.unauthorized();
    }

    // Verify linear sha256 signature
    let hmac = createHmac('sha256', env.LINEAR_APP.WEBHOOK_SECRET);
    hmac = hmac.update(JSON.stringify(request.body));

    const digest = Buffer.from(hmac.digest('hex'), 'utf8');
    const checksum = Buffer.from(signature, 'utf8');

    if (
      checksum.length !== digest.length ||
      !timingSafeEqual(digest, checksum)
    ) {
      app.log.warn('Invalid signature');

      return reply.unauthorized();
    }

    // Process event
    await handler(app, request.body);

    return reply.send();
  });
}
