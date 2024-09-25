import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import { LinearClient } from '@linear/sdk';
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

suite('api/orgs/integrations/connect/linear', () => {
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

  test('should redirect to linear website with app credentials', async () => {
    const response = await call(
      app,
      '/api/orgs/org-0/integrations/connect/linear',
    );

    assert.equal(response.statusCode, 302);

    const location = response.headers.location;

    assert.isString(location);

    assert.match(
      location as string,
      /^https:\/\/linear.app\/oauth\/authorize\?client_id=896839d929f08c9c54d1fef96550fa9c&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fcallbacks%2Flinear&response_type=code&scope=read%2Ccomments%3Acreate&state=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}&prompt=consent&actor=application/,
    );
  });

  suite('and callback', () => {
    let postStub: SinonStub;

    setup(() => {
      postStub = sandbox.stub(axios, 'post').resolves({
        data: { access_token: 'abcdef', scope: 'read comments:create' },
      });
    });

    teardown(() => {
      postStub.restore();
    });

    test('should error if code is missing', async () => {
      const response = await call(app, '/callbacks/linear?state=1234');

      assert.equal(response.statusCode, 302);

      const location = response.headers.location;

      assert.isString(location);
      assert.equal(
        location,
        'http://localhost:3000/org-0/integrations?error=1002',
      );
    });

    test('should error if state is missing', async () => {
      const response = await call(app, '/callbacks/linear?code=abcd');

      assert.equal(response.statusCode, 302);

      const location = response.headers.location;

      assert.isString(location);
      assert.equal(
        location,
        'http://localhost:3000/org-0/integrations?error=1002',
      );
    });

    test('should error if state is different', async () => {
      const response = await call(
        app,
        '/callbacks/linear?code=abcd&state=12345',
      );

      assert.equal(response.statusCode, 302);

      const location = response.headers.location;

      assert.isString(location);
      assert.equal(
        location,
        'http://localhost:3000/org-0/integrations?error=1002',
      );
    });

    test('should error if no access token is retrieved', async () => {
      postStub.resolves({ data: {} });

      const response = await call(
        app,
        '/callbacks/linear?code=abcd&state=1234',
      );

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
        'https://api.linear.app/oauth/token',
      );
    });

    suite('with access token', () => {
      let response: LightMyRequestResponse;

      setup(async () => {
        sandbox.replaceGetter(
          LinearClient.prototype,
          'organization',
          // @ts-ignore
          () => ({
            id: '5678',
            name: 'Automa',
            urlKey: 'automa',
          }),
        );

        sandbox.replaceGetter(
          LinearClient.prototype,
          'viewer',
          // @ts-ignore
          () => ({
            id: '90',
            name: 'Pavan Kumar Sunkara',
            email: 'pavan.sunkara@automa.app',
          }),
        );

        response = await call(app, '/callbacks/linear?code=abcd&state=1234');
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
        assert.equal(postStub.callCount, 1);
        assert.equal(
          postStub.firstCall.args[0],
          'https://api.linear.app/oauth/token',
        );
        assert.deepEqual(postStub.firstCall.args[1], {
          client_id: '896839d929f08c9c54d1fef96550fa9c',
          client_secret: env.LINEAR_APP.CLIENT_SECRET,
          code: 'abcd',
          redirect_uri: 'http://localhost:8080/callbacks/linear',
          grant_type: 'authorization_code',
        });
        assert.deepEqual(postStub.firstCall.args[2], {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        });
      });

      test('should create integration', async () => {
        const integrations = await app.prisma.integrations.findMany();

        assert.lengthOf(integrations, 1);

        assert.equal(integrations[0].org_id, org.id);
        assert.equal(integrations[0].integration_type, 'linear');
        assert.deepEqual(integrations[0].secrets, { access_token: 'abcdef' });
        assert.deepEqual(integrations[0].config, {
          id: '5678',
          name: 'Automa',
          slug: 'automa',
          scopes: ['read', 'comments:create'],
          userEmail: 'pavan.sunkara@automa.app',
        });
        assert.equal(integrations[0].created_by, user.id);
      });
    });
  });
});
