import { FastifyInstance } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import axios from 'axios';

import { integration, integrations, orgs, users } from '@automa/prisma';

import { seedOrgs, seedUsers, server } from '../utils';

import extendJiraWebhooks from '../../src/events/jobs/extendJiraWebhooks';

suite('events/extendJiraWebhooks', () => {
  let app: FastifyInstance;
  let sandbox: SinonSandbox, putStub: SinonStub;
  let org: orgs, user: users, connection: integrations;

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();

    [org] = await seedOrgs(app, 1);
    [user] = await seedUsers(app, 1);
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.prisma.users.deleteMany();
    await app.close();
  });

  setup(async () => {
    connection = await app.prisma.integrations.create({
      data: {
        org_id: org.id,
        created_by: user.id,
        type: integration.jira,
        secrets: {
          access_token: 'access',
          refresh_token: 'refresh',
        },
        config: {
          id: 'jira-123',
          webhookId: 456,
          refreshedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 29 days ago
        },
      },
    });

    putStub = sandbox.stub(axios, 'put').resolves({ data: {} });
  });

  teardown(async () => {
    await app.prisma.integrations.deleteMany();
    sandbox.restore();
  });

  suite('with fresh webhook', () => {
    setup(async () => {
      connection = await app.prisma.integrations.update({
        where: { id: connection.id },
        data: {
          config: {
            ...(connection.config as object),
            refreshedAt: new Date(),
          },
        },
      });

      await extendJiraWebhooks.handler?.(app, {});
    });

    test('should not refresh webhook', async () => {
      assert.equal(putStub.callCount, 0);
    });

    test('should not update integration config', async () => {
      const updated = await app.prisma.integrations.findFirstOrThrow({
        where: {
          id: connection.id,
        },
      });

      assert.deepEqual(updated.config, connection.config);
    });
  });

  suite('with missing tokens', () => {
    setup(async () => {
      await app.prisma.integrations.update({
        where: {
          id: connection.id,
        },
        data: {
          secrets: {},
        },
      });

      await extendJiraWebhooks.handler?.(app, {});
    });

    test('should not call jira', () => {
      assert.equal(putStub.callCount, 0);
    });

    test('should not update integration config', async () => {
      const updated = await app.prisma.integrations.findFirstOrThrow({
        where: {
          id: connection.id,
        },
      });

      assert.deepEqual(updated.config, connection.config);
    });
  });

  suite('with old webhook', () => {
    setup(async () => {
      await extendJiraWebhooks.handler?.(app, {});
    });

    test('should refresh webhook', async () => {
      assert.equal(putStub.callCount, 1);

      assert.deepEqual(
        putStub.firstCall.args[0],
        'https://api.atlassian.com/ex/jira/jira-123/rest/api/3/webhook/refresh',
      );
      assert.deepEqual(putStub.firstCall.args[1], { webhookIds: [456] });
      assert.deepEqual(putStub.firstCall.args[2], {
        headers: {
          Authorization: 'Bearer access',
        },
      });
    });

    test('should update integration config', async () => {
      const updated = await app.prisma.integrations.findFirstOrThrow({
        where: {
          id: connection.id,
        },
      });

      assert.notDeepEqual(updated.config, connection.config);
    });
  });
});
