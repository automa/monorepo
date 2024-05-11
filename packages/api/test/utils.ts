import { FastifyInstance, InjectOptions } from 'fastify';

export { server } from '../src';

// Import the modules to use their typings
import '../src/plugins/analytics';
import '../src/plugins/auth';
import '../src/plugins/error';
import '../src/plugins/optimizer';
import '../src/plugins/prisma';
import '../src/plugins/redis';
import '../src/routes/api/orgs/_provider/_org/autohooks';

export const call = (
  app: FastifyInstance,
  uri: string,
  options?: Omit<InjectOptions, 'url' | 'path' | 'server' | 'Request'>,
) =>
  app.inject({
    url: uri,
    ...options,
  });

export const graphql = (
  app: FastifyInstance,
  query: string,
  variables?: Record<string, any>,
  options?: Omit<
    InjectOptions,
    'url' | 'method' | 'payload' | 'path' | 'server' | 'Request'
  >,
) =>
  call(app, '/graphql', {
    method: 'POST',
    payload: {
      query,
      variables,
    },
    ...options,
  });

export const seedUsers = (app: FastifyInstance, count: number) =>
  Promise.all(
    Array(count)
      .fill(0)
      .map((_, i) =>
        app.prisma.users.create({
          data: {
            email: `user-${i}@example.com`,
            name: `User ${i}`,
          },
        }),
      ),
  );

export const seedOrgs = (app: FastifyInstance, count: number) => {
  return Promise.all(
    Array(count)
      .fill(0)
      .map((_, i) =>
        app.prisma.orgs.create({
          data: {
            name: `org-${i}`,
            provider_type: 'github',
            provider_id: `${i}`,
            provider_name: `org-${i}`,
            is_user: false,
          },
        }),
      ),
  );
};

export const seedBots = (
  app: FastifyInstance,
  published: { id: number }[],
  nonPublished: { id: number }[],
) => {
  return Promise.all(
    published.concat(nonPublished).map(({ id }, index) =>
      app.prisma.bots.create({
        data: {
          org_id: id,
          name: `bot-${index}`,
          description: `Bot ${index}`,
          type: 'webhook',
          webhook_url: `https://example.com/webhook/${index}`,
          ...(index < published.length && {
            homepage: 'https://example.com',
            published_at: new Date(),
          }),
        },
      }),
    ),
  );
};
