import { FastifyInstance } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import axios from 'axios';

import { integration, integrations, orgs, users } from '@automa/prisma';

import { seedOrgs, seedUsers, server } from '../utils';

import checkJiraWebhooks from '../../src/events/jobs/checkJiraWebhooks';

suite('events/checkJiraWebhooks', () => {
  let app: FastifyInstance;
  let sandbox: SinonSandbox, getStub: SinonStub;
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
          id: 'abcdef',
          webhookId: 456,
        },
      },
    });

    getStub = sandbox.stub(axios, 'get').resolves({
      data: {
        values: [
          {
            id: 456,
          },
        ],
      },
    });
  });

  teardown(async () => {
    await app.prisma.integrations.deleteMany();
    sandbox.restore();
  });

  suite('with tokens missing', () => {
    setup(async () => {
      await app.prisma.integrations.update({
        where: {
          id: connection.id,
        },
        data: {
          secrets: {},
        },
      });

      await checkJiraWebhooks.handler?.(app, {});
    });

    test('should not call jira', () => {
      assert.equal(getStub.callCount, 0);
    });

    test('should delete integration', async () => {
      const found = await app.prisma.integrations.findUnique({
        where: {
          id: connection.id,
        },
      });

      assert.isNull(found);
    });
  });

  suite('with jira returning 403', () => {
    setup(async () => {
      getStub.rejects({
        response: {
          status: 403,
        },
      });

      await checkJiraWebhooks.handler?.(app, {});
    });

    test('should call jira', () => {
      assert.equal(getStub.callCount, 1);

      assert.deepEqual(
        getStub.firstCall.args[0],
        'https://api.atlassian.com/ex/jira/abcdef/rest/api/3/webhook',
      );
      assert.deepEqual(getStub.firstCall.args[1], {
        headers: {
          Authorization: 'Bearer access',
        },
      });
    });

    test('should delete integration', async () => {
      const found = await app.prisma.integrations.findUnique({
        where: {
          id: connection.id,
        },
      });

      assert.isNull(found);
    });
  });

  suite('with unknown error', () => {
    setup(async () => {
      getStub.rejects(new Error('unknown'));

      await checkJiraWebhooks.handler?.(app, {});
    });

    test('should call jira', () => {
      assert.equal(getStub.callCount, 1);

      assert.deepEqual(
        getStub.firstCall.args[0],
        'https://api.atlassian.com/ex/jira/abcdef/rest/api/3/webhook',
      );
      assert.deepEqual(getStub.firstCall.args[1], {
        headers: {
          Authorization: 'Bearer access',
        },
      });
    });

    test('should not delete integration', async () => {
      const found = await app.prisma.integrations.findUnique({
        where: {
          id: connection.id,
        },
      });

      assert.isNotNull(found);
    });
  });

  suite('with no jira webhook', () => {
    setup(async () => {
      getStub.resolves({ data: { values: [] } });

      await checkJiraWebhooks.handler?.(app, {});
    });

    test('should call jira', () => {
      assert.equal(getStub.callCount, 1);

      assert.deepEqual(
        getStub.firstCall.args[0],
        'https://api.atlassian.com/ex/jira/abcdef/rest/api/3/webhook',
      );
      assert.deepEqual(getStub.firstCall.args[1], {
        headers: {
          Authorization: 'Bearer access',
        },
      });
    });

    test('should delete integration', async () => {
      const found = await app.prisma.integrations.findUnique({
        where: {
          id: connection.id,
        },
      });

      assert.isNull(found);
    });
  });

  suite('with jira webhook', () => {
    setup(async () => {
      await checkJiraWebhooks.handler?.(app, {});
    });

    test('should call jira', () => {
      assert.equal(getStub.callCount, 1);

      assert.deepEqual(
        getStub.firstCall.args[0],
        'https://api.atlassian.com/ex/jira/abcdef/rest/api/3/webhook',
      );
      assert.deepEqual(getStub.firstCall.args[1], {
        headers: {
          Authorization: 'Bearer access',
        },
      });
    });

    test('should not delete integration', async () => {
      const found = await app.prisma.integrations.findUnique({
        where: {
          id: connection.id,
        },
      });

      assert.isNotNull(found);
    });
  });
});
