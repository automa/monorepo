import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';

import { orgs, users } from '@automa/prisma';

import { seedOrgs, seedUsers, server } from '../../utils';

import { callWithFixture } from './utils';

suite('linear hook OAuthApp event', () => {
  let app: FastifyInstance,
    user: users,
    org: orgs,
    response: LightMyRequestResponse;

  suiteSetup(async () => {
    app = await server();

    [user] = await seedUsers(app, 1);
    [org] = await seedOrgs(app, 1);
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.prisma.users.deleteMany();
    await app.close();
  });

  setup(async () => {
    await app.prisma.integrations.create({
      data: {
        org_id: org.id,
        integration_type: 'linear',
        secrets: {
          access_token: 'abcdef',
        },
        config: {
          id: '6cb652a9-8f3f-40b7-9695-df81e161fe07',
          name: 'Automa',
          slug: 'automa',
        },
        created_by: user.id,
      },
    });
  });

  teardown(async () => {
    await app.prisma.integrations.deleteMany();
    await app.prisma.tasks.deleteMany();
  });

  suite('revoked', () => {
    setup(async () => {
      response = await callWithFixture(app, 'OAuthApp', 'revoked');
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should disconnect integration', async () => {
      const count = await app.prisma.integrations.count();

      assert.equal(count, 0);
    });
  });

  suite('revoked with missing integration', () => {
    setup(async () => {
      await app.prisma.integrations.update({
        where: {
          org_id_integration_type: {
            org_id: org.id,
            integration_type: 'linear',
          },
        },
        data: {
          config: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Workspace',
            slug: 'workspace',
          },
        },
      });

      response = await callWithFixture(app, 'OAuthApp', 'revoked');
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should not disconnect integration', async () => {
      const count = await app.prisma.integrations.count();

      assert.equal(count, 1);
    });
  });
});
