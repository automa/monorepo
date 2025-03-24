import { FastifyInstance } from 'fastify';

import { jira, JiraEventType } from '../../hooks';

export default async function (app: FastifyInstance) {
  app.post<{
    Body: {
      webhookEvent: string;
    };
  }>('/jira', async (request, reply) => {
    // Get jira event
    const event = request.body?.webhookEvent;

    if (!event || typeof event !== 'string') {
      request.log.error('No event');
      return reply.unauthorized();
    }

    app.log.info({ event }, 'Received jira event');

    const handler = jira[event as JiraEventType];

    if (!handler) {
      app.log.info({ event }, 'Ignoring event');

      return reply.code(204).send();
    }

    // Process event
    await handler(app, request.body);

    return reply.send();
  });
}
