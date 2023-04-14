import { FastifyInstance } from 'fastify';
import { createHmac, timingSafeEqual } from 'crypto';

import { GithubEventType, github } from '../../hooks';

export default async function (app: FastifyInstance) {
  app.post<{
    Body: {
      action: string;
    };
  }>('/github', async (request, reply) => {
    // Get github event
    const event = request.headers['x-github-event'];

    request.log.info(
      { event, action: request.body.action },
      'Received github event',
    );

    if (!event || typeof event !== 'string') {
      request.log.error('No event');
      return reply.unauthorized();
    }

    const handler = github[event as GithubEventType]?.[request.body.action];

    if (!handler) {
      request.log.info('Ignoring event');
      return reply.status(204).send();
    }

    // Get github signature
    const signature = request.headers['x-hub-signature-256'];

    if (!signature || typeof signature !== 'string') {
      request.log.error('No signature');
      return reply.unauthorized();
    }

    // Verify github sha256 signature
    let hmac = createHmac('sha256', app.config.GITHUB_APP.WEBHOOK_SECRET);
    hmac = hmac.update(JSON.stringify(request.body));

    const digest = Buffer.from(`sha256=${hmac.digest('hex')}`, 'utf8');
    const checksum = Buffer.from(signature, 'utf8');

    if (
      checksum.length !== digest.length ||
      !timingSafeEqual(digest, checksum)
    ) {
      request.log.error('Invalid signature');
      return reply.unauthorized();
    }

    // Process event
    await handler(app, request.body);

    reply.status(200).send();
  });
}
