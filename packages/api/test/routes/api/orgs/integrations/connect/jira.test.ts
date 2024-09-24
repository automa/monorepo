import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import axios from 'axios';

import { orgs, users } from '@automa/prisma';

import { env } from '../../../../../../src/env';

import {
  call,
  seedOrgs,
  seedUserOrgs,
  seedUsers,
  server,
} from '../../../../../utils';

suite('api/orgs/integrations/connect/jira', () => {
  let app: FastifyInstance, sandbox: SinonSandbox;
  let org: orgs, user: users;

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();

    [user] = await seedUsers(app, 1);
    [org] = await seedOrgs(app, 1);
    await seedUserOrgs(app, user, [org]);

    app.addHook('preValidation', async (request) => {
      request.session.orgId = org.id;
      request.session.integrationOauthState = '1234';

      request.session.userId = user.id;
    });
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.prisma.users.deleteMany();
    await app.close();
  });

  test('should redirect to jira website with app credentials', async () => {
    const response = await call(
      app,
      '/api/orgs/org-0/integrations/connect/jira',
    );

    assert.equal(response.statusCode, 302);

    const location = response.headers.location;

    assert.isString(location);

    assert.match(
      location as string,
      /^https:\/\/auth.atlassian.com\/authorize\?client_id=F2xGP22ZI3MmnsJphTWPvk9qt6FXgB0A&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fcallbacks%2Fjira&response_type=code&scope=read%3Ajira-user\+read%3Ajira-work\+write%3Ajira-work\+manage%3Ajira-webhook\+offline_access&state=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}&prompt=consent&audience=api.atlassian.com/,
    );
  });

  suite('and callback', () => {
    let postStub: SinonStub;

    setup(() => {
      postStub = sandbox.stub(axios, 'post').resolves({
        data: { access_token: 'abcdef', refresh_token: 'ghijkl' },
      });
    });

    teardown(() => {
      sandbox.restore();
    });

    test('should error if code is missing', async () => {
      const response = await call(app, '/callbacks/jira?state=1234');

      assert.equal(response.statusCode, 302);

      const location = response.headers.location;

      assert.isString(location);
      assert.equal(
        location,
        'http://localhost:3000/org-0/integrations?error=1002',
      );
    });

    test('should error if state is missing', async () => {
      const response = await call(app, '/callbacks/jira?code=abcd');

      assert.equal(response.statusCode, 302);

      const location = response.headers.location;

      assert.isString(location);
      assert.equal(
        location,
        'http://localhost:3000/org-0/integrations?error=1002',
      );
    });

    test('should error if state is different', async () => {
      const response = await call(app, '/callbacks/jira?code=abcd&state=12345');

      assert.equal(response.statusCode, 302);

      const location = response.headers.location;

      assert.isString(location);
      assert.equal(
        location,
        'http://localhost:3000/org-0/integrations?error=1002',
      );
    });

    test('should error if no access token is retrieved', async () => {
      postStub.resolves({ data: { refresh_token: 'ghijkl' } });

      const response = await call(app, '/callbacks/jira?code=abcd&state=1234');

      assert.equal(response.statusCode, 302);

      const location = response.headers.location;

      assert.isString(location);
      assert.equal(
        location,
        'http://localhost:3000/org-0/integrations?error=1002',
      );

      assert.equal(postStub.callCount, 1);
      assert.equal(
        postStub.firstCall.args[0],
        'https://auth.atlassian.com/oauth/token',
      );
    });

    test('should error if no refresh token is retrieved', async () => {
      postStub.resolves({ data: { access_token: 'abcdef' } });

      const response = await call(app, '/callbacks/jira?code=abcd&state=1234');

      assert.equal(response.statusCode, 302);

      const location = response.headers.location;

      assert.isString(location);
      assert.equal(
        location,
        'http://localhost:3000/org-0/integrations?error=1002',
      );

      assert.equal(postStub.callCount, 1);
      assert.equal(
        postStub.firstCall.args[0],
        'https://auth.atlassian.com/oauth/token',
      );
    });

    suite('with multiple connected jira orgs', () => {
      let response: LightMyRequestResponse, getStub: SinonStub;

      setup(async () => {
        getStub = sandbox.stub(axios, 'get').resolves({
          data: [
            {
              id: '5678',
              url: 'automa.atlassian.net',
              name: 'Automa',
              scopes: [],
            },
            {
              id: '1234',
              url: 'workspace.atlassian.net',
              name: 'workspace',
              scopes: [],
            },
          ],
        });

        response = await call(app, '/callbacks/jira?code=abcd&state=1234');
      });

      teardown(async () => {
        await app.prisma.integrations.deleteMany();
        sandbox.restore();
      });

      test('should error', async () => {
        assert.equal(response.statusCode, 302);

        const location = response.headers.location;

        assert.isString(location);
        assert.equal(
          location,
          'http://localhost:3000/org-0/integrations?error=1003',
        );
      });

      test('should retrieve accessible resources', async () => {
        assert.equal(getStub.callCount, 1);
        assert.equal(
          getStub.firstCall.args[0],
          'https://api.atlassian.com/oauth/token/accessible-resources',
        );
      });
    });

    suite('with single connected jira org', () => {
      let response: LightMyRequestResponse, getStub: SinonStub;

      setup(async () => {
        getStub = sandbox
          .stub(axios, 'get')
          .onFirstCall()
          .resolves({
            data: [
              {
                id: '5678',
                url: 'automa.atlassian.net',
                name: 'Automa',
                scopes: [
                  'read:jira-user',
                  'read:jira-work',
                  'write:jira-work',
                  'manage:jira-webhook',
                  'offline_access',
                ],
              },
            ],
          })
          .onSecondCall()
          .resolves({
            data: {
              accountId: '90',
              displayName: 'Pavan Sunkara',
              emailAddress: 'pavan@example.com',
            },
          });

        postStub.onSecondCall().resolves({
          data: {
            webhookRegistrationResult: [
              {
                createdWebhookId: 123,
              },
            ],
          },
        });

        response = await call(app, '/callbacks/jira?code=abcd&state=1234');
      });

      teardown(async () => {
        await app.prisma.integrations.deleteMany();
        sandbox.restore();
      });

      test('should redirect to integrations page', async () => {
        assert.equal(response.statusCode, 302);

        const location = response.headers.location;

        assert.isString(location);
        assert.equal(location, 'http://localhost:3000/org-0/integrations');
      });

      test('should request access token', async () => {
        assert.equal(postStub.callCount, 2);
        assert.equal(
          postStub.firstCall.args[0],
          'https://auth.atlassian.com/oauth/token',
        );
        assert.deepEqual(postStub.firstCall.args[1], {
          client_id: 'F2xGP22ZI3MmnsJphTWPvk9qt6FXgB0A',
          client_secret: env.JIRA_APP.CLIENT_SECRET,
          code: 'abcd',
          redirect_uri: 'http://localhost:8080/callbacks/jira',
          grant_type: 'authorization_code',
        });
      });

      test('should retrieve accessible resources', async () => {
        assert.equal(getStub.callCount, 2);
        assert.equal(
          getStub.firstCall.args[0],
          'https://api.atlassian.com/oauth/token/accessible-resources',
        );
        assert.deepEqual(getStub.firstCall.args[1], {
          headers: {
            Authorization: 'Bearer abcdef',
          },
        });
      });

      test('should retrieve user information', async () => {
        assert.equal(
          getStub.secondCall.args[0],
          'https://api.atlassian.com/ex/jira/5678/rest/api/3/myself',
        );
        assert.deepEqual(getStub.secondCall.args[1], {
          headers: {
            Authorization: 'Bearer abcdef',
          },
        });
      });

      test('should create webhook', async () => {
        assert.equal(
          postStub.secondCall.args[0],
          'https://api.atlassian.com/ex/jira/5678/rest/api/3/webhook',
        );
        assert.deepEqual(postStub.secondCall.args[1], {
          url: 'http://localhost:8080/hooks/jira',
          webhooks: [
            {
              events: ['comment_created'],
              jqlFilter: 'project != ______NON_EXISTENT_PROJECT',
            },
          ],
        });
        assert.deepEqual(postStub.secondCall.args[2], {
          headers: {
            Authorization: 'Bearer abcdef',
          },
        });
      });

      test('should create integration', async () => {
        const integrations = await app.prisma.integrations.findMany();

        assert.lengthOf(integrations, 1);

        assert.equal(integrations[0].org_id, org.id);
        assert.equal(integrations[0].integration_type, 'jira');
        assert.deepEqual(integrations[0].secrets, {
          access_token: 'abcdef',
          refresh_token: 'ghijkl',
        });
        assert.deepEqual(integrations[0].config, {
          id: '5678',
          name: 'Automa',
          url: 'automa.atlassian.net',
          scopes: [
            'read:jira-user',
            'read:jira-work',
            'write:jira-work',
            'manage:jira-webhook',
            'offline_access',
          ],
          webhookId: 123,
          userEmail: 'pavan@example.com',
        });
        assert.equal(integrations[0].created_by, user.id);
      });
    });
  });
});
