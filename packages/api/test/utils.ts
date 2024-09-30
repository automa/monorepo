// Import the modules to use their typings
import '../src/plugins/analytics';
import '../src/plugins/auth';
import '../src/plugins/error';
import '../src/plugins/optimizer';
import '../src/plugins/prisma';
import '../src/plugins/redis';
import '../src/routes/api/orgs/_org/autohooks';

import { createHmac } from 'node:crypto';

import { FastifyInstance, InjectOptions } from 'fastify';

export { server } from '../src';

export * from './mocks';

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

export const seedUserOrgs = (
  app: FastifyInstance,
  user: { id: number },
  orgs: { id: number }[],
) =>
  app.prisma.user_orgs.createManyAndReturn({
    data: orgs.map(({ id }) => ({
      org_id: id,
      user_id: user.id,
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
      short_description: `Bot ${i}`,
      type: 'manual',
      webhook_url: `https://example.com/webhook/${i}`,
      webhook_secret: `atma_whsec_${i}`,
      description: `Bot ${i} long description`,
      homepage: `https://example${i}.com`,
      image_url: `https://example.com/image/${i}.png`,
      ...(i < published.length && {
        published_at: new Date(),
      }),
    })),
  });

export const seedRepos = (
  app: FastifyInstance,
  installed: { id: number }[],
  nonInstalled: { id: number }[] = [],
) =>
  app.prisma.repos.createManyAndReturn({
    data: installed.concat(nonInstalled).map(({ id }, i) => ({
      org_id: id,
      name: `repo-${i}`,
      provider_id: `${i}`,
      ...(i < installed.length && {
        has_installation: true,
      }),
    })),
  });

export const generateSignature = (secret: string, payload: string) =>
  createHmac('sha256', secret).update(payload).digest('hex');
