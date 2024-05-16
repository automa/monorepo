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
  app.prisma.users.createManyAndReturn({
    data: Array(count)
      .fill(0)
      .map((_, i) => ({
        email: `user-${i}@example.com`,
        name: `User ${i}`,
      })),
  });

export const seedOrgs = (app: FastifyInstance, count: number) =>
  app.prisma.orgs.createManyAndReturn({
    data: Array(count)
      .fill(0)
      .map((_, i) => ({
        name: `org-${i}`,
        provider_type: 'github',
        provider_id: `${i}`,
        provider_name: `org-${i}`,
        is_user: false,
      })),
  });

export const seedBots = (
  app: FastifyInstance,
  published: { id: number }[],
  nonPublished: { id: number }[] = [],
) =>
  app.prisma.bots.createManyAndReturn({
    data: published.concat(nonPublished).map(({ id }, i) => ({
      org_id: id,
      name: `bot-${i}`,
      description: `Bot ${i}`,
      type: 'webhook',
      webhook_url: `https://example.com/webhook/${i}`,
      ...(i < published.length && {
        homepage: 'https://example.com',
        published_at: new Date(),
      }),
    })),
  });
