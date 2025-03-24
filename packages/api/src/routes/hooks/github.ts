import { createHmac, timingSafeEqual } from 'node:crypto';

import { FastifyInstance } from 'fastify';

import { env } from '../../env';

import { github, GithubEventType } from '../../hooks';

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

    app.log.info(
      {
        event,
        action: request.body.action,
      },
      'Received github event',
    );

    const handler =
      github[event as GithubEventType]?.[request.body.action ?? event];

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

    // Get github signature
    const signature = request.headers['x-hub-signature-256'];

    if (!signature || typeof signature !== 'string') {
      app.log.warn('No signature');

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
      app.log.warn('Invalid signature');

      return reply.unauthorized();
    }

    // Process event
    await handler(app, request.body);

    return reply.send();
  });
}
