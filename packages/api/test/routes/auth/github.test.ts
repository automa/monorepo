import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import axios from 'axios';

import { users } from '@automa/prisma';

import { call, server } from '../../utils';

suite('auth/github', () => {
  let app: FastifyInstance, sandbox: SinonSandbox, sessionUser: users | null;

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();

    app.addHook('preValidation', async (request) => {
      request.session.referer = '/orgs';
      request.session.integrationOauthState = '1234';

      request.session.userId = sessionUser?.id ?? undefined;
    });
  });

  suiteTeardown(async () => {
    await app.close();
  });

  teardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.prisma.users.deleteMany();
    sandbox.restore();
  });

  test('should redirect to github website with app credentials', async () => {
    const response = await call(app, '/auth/github');

    assert.equal(response.statusCode, 302);

    const location = response.headers.location;

    assert.isString(location);

    assert.match(
      location as string,
      /^https:\/\/github.com\/login\/oauth\/authorize\?client_id=Iv1\.bee7999253d03200&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fcallbacks%2Fgithub&state=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
    );
  });

  suite('and callback', () => {
    let postStub: SinonStub, installationsStub: SinonStub, userStub: SinonStub;

    setup(() => {
      installationsStub = sandbox
        .stub()
        .onFirstCall()
        .resolves({
          data: {
            installations: [{ id: 1234 }],
          },
          headers: {
            link: '</user/installations?per_page=100&page=2>; rel="next"',
          },
        })
        .onSecondCall()
        .resolves({
          data: {
            installations: [{ id: 5678 }],
          },
          headers: {},
        });

      postStub = sandbox.stub(axios, 'post').resolves({
        data: { access_token: 'abcdef', refresh_token: '123456' },
      });

      userStub = sandbox.stub(axios, 'get').resolves({
        data: {
          id: 123,
          email: 'pavan@example.com',
          name: 'Pavan Kumar Sunkara',
          login: 'pksunkara',
        },
      });

      // @ts-ignore
      sandbox.stub(axios, 'create').returns({
        get: installationsStub,
        request: userStub,
      });
    });

    test('should error if state is missing', async () => {
      const response = await call(app, '/callbacks/github?state=1234');

      assert.equal(response.statusCode, 302);

      const location = response.headers.location;

      assert.isString(location);
      assert.equal(location, '/orgs?error=1000');
    });

    test('should error if code is missing', async () => {
      const response = await call(app, '/callbacks/github?code=abcd');

      assert.equal(response.statusCode, 302);

      const location = response.headers.location;

      assert.isString(location);
      assert.equal(location, '/orgs?error=1000');
    });

    test('should error if state is different', async () => {
      const response = await call(
        app,
        '/callbacks/github?code=abcd&state=12345',
      );

      assert.equal(response.statusCode, 302);

      const location = response.headers.location;

      assert.isString(location);
      assert.equal(location, '/orgs?error=1000');
    });

    test('should error if no access token is retrieved', async () => {
      postStub.resolves({ data: { refresh_token: '123456' } });

      const response = await call(
        app,
        '/callbacks/github?code=abcd&state=1234',
      );

      assert.equal(response.statusCode, 302);

      const location = response.headers.location;

      assert.isString(location);
      assert.equal(location, '/orgs?error=1000');

      assert.equal(postStub.callCount, 1);
      assert.equal(
        postStub.firstCall.args[0],
        'https://github.com/login/oauth/access_token',
      );
    });

    test('should error if no refresh token is retrieved', async () => {
      postStub.resolves({ data: { access_token: 'abcdef' } });

      const response = await call(
        app,
        '/callbacks/github?code=abcd&state=1234',
      );

      assert.equal(response.statusCode, 302);

      const location = response.headers.location;

      assert.isString(location);
      assert.equal(location, '/orgs?error=1000');

      assert.equal(postStub.callCount, 1);
      assert.equal(
        postStub.firstCall.args[0],
        'https://github.com/login/oauth/access_token',
      );
    });

    suite('with no user and no provider', () => {
      let response: LightMyRequestResponse;

      setup(async () => {
        await app.prisma.orgs.createMany({
          data: [
            {
              name: 'automa',
              provider_type: 'github',
              provider_id: '1234',
              provider_name: 'automa',
              github_installation_id: 1234,
            },
            {
              name: 'automa-demo',
              provider_type: 'github',
              provider_id: '5678',
              provider_name: 'automa-demo',
              github_installation_id: 5678,
            },
          ],
        });

        response = await call(app, '/callbacks/github?code=abcd&state=1234');
      });

      teardown(async () => {
        await app.prisma.orgs.deleteMany();
      });

      test('should request access token', async () => {
        assert.equal(postStub.callCount, 1);
        assert.equal(
          postStub.firstCall.args[0],
          'https://github.com/login/oauth/access_token',
        );
        assert.deepEqual(postStub.firstCall.args[1], {
          client_id: 'Iv1.bee7999253d03200',
          client_secret: '279f43a10c306d492656f8069e8b052dc5ccf7d0',
          code: 'abcd',
          redirect_uri: 'http://localhost:8080/callbacks/github',
        });
      });

      test('should retrieve user information', async () => {
        assert.equal(userStub.callCount, 1);
        assert.lengthOf(userStub.firstCall.args, 2);
        assert.equal(userStub.firstCall.args[0], 'https://api.github.com/user');
        assert.deepEqual(userStub.firstCall.args[1], {
          headers: {
            Authorization: 'Bearer abcdef',
          },
        });
      });

      test('should redirect to referer', async () => {
        assert.equal(response.statusCode, 302);

        const location = response.headers.location;

        assert.isString(location);
        assert.equal(location, '/orgs');
      });

      suite('and user', () => {
        let users: users[];

        setup(async () => {
          users = await app.prisma.users.findMany();
        });

        test('should be created', async () => {
          assert.lengthOf(users, 1);

          assert.deepOwnInclude(users[0], {
            email: 'pavan@example.com',
            name: 'Pavan Kumar Sunkara',
          });
        });

        test('should be connected to github provider', async () => {
          const providers = await app.prisma.user_providers.findMany({
            where: {
              user_id: users[0].id,
            },
          });

          assert.lengthOf(providers, 1);
          assert.deepOwnInclude(providers[0], {
            provider_type: 'github',
            provider_id: '123',
            provider_email: 'pavan@example.com',
            refresh_token: '123456',
          });
        });

        test('should have their orgs retrieved', async () => {
          assert.isAtLeast(installationsStub.callCount, 2);
          assert.lengthOf(installationsStub.firstCall.args, 1);
          assert.deepEqual(
            installationsStub.firstCall.args[0],
            '/user/installations?per_page=100',
          );
          assert.lengthOf(installationsStub.secondCall.args, 1);
          assert.deepEqual(
            installationsStub.secondCall.args[0],
            '/user/installations?per_page=100&page=2',
          );
        });

        test('should be added to orgs', async () => {
          const userOrgs = await app.prisma.user_orgs.findMany({
            where: {
              user_id: users[0].id,
            },
            select: {
              user_id: true,
              orgs: true,
            },
            orderBy: {
              org_id: 'asc',
            },
          });

          assert.lengthOf(userOrgs, 3);

          assert.equal(userOrgs[0].user_id, users[0].id);
          assert.deepOwnInclude(userOrgs[0].orgs, {
            name: 'automa',
            provider_type: 'github',
            provider_id: '1234',
            provider_name: 'automa',
            github_installation_id: 1234,
          });

          assert.equal(userOrgs[1].user_id, users[0].id);
          assert.deepOwnInclude(userOrgs[1].orgs, {
            name: 'automa-demo',
            provider_type: 'github',
            provider_id: '5678',
            provider_name: 'automa-demo',
            github_installation_id: 5678,
          });

          assert.equal(userOrgs[2].user_id, users[0].id);
          assert.deepOwnInclude(userOrgs[2].orgs, {
            name: 'pksunkara',
            provider_type: 'github',
            provider_id: '123',
            provider_name: 'pksunkara',
            github_installation_id: null,
          });
        });
      });
    });

    suite('with user having same email and not connected to provider', () => {
      let response: LightMyRequestResponse;

      setup(async () => {
        await app.prisma.users.create({
          data: {
            email: 'pavan@example.com',
            name: 'Pavan Sunkara',
          },
        });

        response = await call(app, '/callbacks/github?code=abcd&state=1234');
      });

      test('should request access token', async () => {
        assert.equal(postStub.callCount, 1);
        assert.equal(
          postStub.firstCall.args[0],
          'https://github.com/login/oauth/access_token',
        );
        assert.deepEqual(postStub.firstCall.args[1], {
          client_id: 'Iv1.bee7999253d03200',
          client_secret: '279f43a10c306d492656f8069e8b052dc5ccf7d0',
          code: 'abcd',
          redirect_uri: 'http://localhost:8080/callbacks/github',
        });
      });

      test('should retrieve user information', async () => {
        assert.equal(userStub.callCount, 1);
        assert.lengthOf(userStub.firstCall.args, 2);
        assert.equal(userStub.firstCall.args[0], 'https://api.github.com/user');
        assert.deepEqual(userStub.firstCall.args[1], {
          headers: {
            Authorization: 'Bearer abcdef',
          },
        });
      });

      test('should redirect to referer', async () => {
        assert.equal(response.statusCode, 302);

        const location = response.headers.location;

        assert.isString(location);
        assert.equal(location, '/orgs');
      });

      suite('and user', () => {
        let users: users[];

        setup(async () => {
          users = await app.prisma.users.findMany();
        });

        test('should not be updated', async () => {
          assert.lengthOf(users, 1);

          assert.deepOwnInclude(users[0], {
            email: 'pavan@example.com',
            name: 'Pavan Sunkara',
          });
        });

        test('should be connected to github provider', async () => {
          const providers = await app.prisma.user_providers.findMany({
            where: {
              user_id: users[0].id,
            },
          });

          assert.lengthOf(providers, 1);
          assert.deepOwnInclude(providers[0], {
            provider_type: 'github',
            provider_id: '123',
            provider_email: 'pavan@example.com',
            refresh_token: '123456',
          });
        });

        test('should have their orgs retrieved', async () => {
          assert.isAtLeast(installationsStub.callCount, 2);
          assert.lengthOf(installationsStub.firstCall.args, 1);
          assert.deepEqual(
            installationsStub.firstCall.args[0],
            '/user/installations?per_page=100',
          );
          assert.lengthOf(installationsStub.secondCall.args, 1);
          assert.deepEqual(
            installationsStub.secondCall.args[0],
            '/user/installations?per_page=100&page=2',
          );
        });
      });
    });

    suite(
      'with user having different email and not connected to provider',
      () => {
        let response: LightMyRequestResponse;

        setup(async () => {
          await app.prisma.users.create({
            data: {
              email: 'pavan.sunkara@example.com',
              name: 'Pavan Sunkara',
            },
          });

          response = await call(app, '/callbacks/github?code=abcd&state=1234');
        });

        test('should request access token', async () => {
          assert.equal(postStub.callCount, 1);
          assert.equal(
            postStub.firstCall.args[0],
            'https://github.com/login/oauth/access_token',
          );
          assert.deepEqual(postStub.firstCall.args[1], {
            client_id: 'Iv1.bee7999253d03200',
            client_secret: '279f43a10c306d492656f8069e8b052dc5ccf7d0',
            code: 'abcd',
            redirect_uri: 'http://localhost:8080/callbacks/github',
          });
        });

        test('should retrieve user information', async () => {
          assert.equal(userStub.callCount, 1);
          assert.lengthOf(userStub.firstCall.args, 2);
          assert.equal(
            userStub.firstCall.args[0],
            'https://api.github.com/user',
          );
          assert.deepEqual(userStub.firstCall.args[1], {
            headers: {
              Authorization: 'Bearer abcdef',
            },
          });
        });

        test('should redirect to referer', async () => {
          assert.equal(response.statusCode, 302);

          const location = response.headers.location;

          assert.isString(location);
          assert.equal(location, '/orgs');
        });

        suite('and user', () => {
          let users: users[];

          setup(async () => {
            users = await app.prisma.users.findMany({ orderBy: { id: 'asc' } });
          });

          test('should be created', async () => {
            assert.lengthOf(users, 2);

            assert.deepOwnInclude(users[0], {
              email: 'pavan.sunkara@example.com',
              name: 'Pavan Sunkara',
            });

            assert.deepOwnInclude(users[1], {
              email: 'pavan@example.com',
              name: 'Pavan Kumar Sunkara',
            });
          });

          test('should be connected to github provider', async () => {
            const providers = await app.prisma.user_providers.findMany({
              where: {
                user_id: users[1].id,
              },
            });

            assert.lengthOf(providers, 1);
            assert.deepOwnInclude(providers[0], {
              provider_type: 'github',
              provider_id: '123',
              provider_email: 'pavan@example.com',
              refresh_token: '123456',
            });
          });

          test('should have their orgs retrieved', async () => {
            assert.isAtLeast(installationsStub.callCount, 2);
            assert.lengthOf(installationsStub.firstCall.args, 1);
            assert.deepEqual(
              installationsStub.firstCall.args[0],
              '/user/installations?per_page=100',
            );
            assert.lengthOf(installationsStub.secondCall.args, 1);
            assert.deepEqual(
              installationsStub.secondCall.args[0],
              '/user/installations?per_page=100&page=2',
            );
          });
        });
      },
    );

    suite(
      'with user having different email and not connected to provider and logged in',
      () => {
        let response: LightMyRequestResponse;

        setup(async () => {
          sessionUser = await app.prisma.users.create({
            data: {
              email: 'pavan.sunkara@example.com',
              name: 'Pavan Sunkara',
            },
          });

          response = await call(app, '/callbacks/github?code=abcd&state=1234');
        });

        teardown(() => {
          sessionUser = null;
        });

        test('should request access token', async () => {
          assert.equal(postStub.callCount, 1);
          assert.equal(
            postStub.firstCall.args[0],
            'https://github.com/login/oauth/access_token',
          );
          assert.deepEqual(postStub.firstCall.args[1], {
            client_id: 'Iv1.bee7999253d03200',
            client_secret: '279f43a10c306d492656f8069e8b052dc5ccf7d0',
            code: 'abcd',
            redirect_uri: 'http://localhost:8080/callbacks/github',
          });
        });

        test('should retrieve user information', async () => {
          assert.equal(userStub.callCount, 1);
          assert.lengthOf(userStub.firstCall.args, 2);
          assert.equal(
            userStub.firstCall.args[0],
            'https://api.github.com/user',
          );
          assert.deepEqual(userStub.firstCall.args[1], {
            headers: {
              Authorization: 'Bearer abcdef',
            },
          });
        });

        test('should redirect to referer', async () => {
          assert.equal(response.statusCode, 302);

          const location = response.headers.location;

          assert.isString(location);
          assert.equal(location, '/orgs');
        });

        suite('and user', () => {
          let users: users[];

          setup(async () => {
            users = await app.prisma.users.findMany({ orderBy: { id: 'asc' } });
          });

          test('should not be updated', async () => {
            assert.lengthOf(users, 1);

            assert.deepOwnInclude(users[0], {
              email: 'pavan.sunkara@example.com',
              name: 'Pavan Sunkara',
            });
          });

          test('should be connected to github provider', async () => {
            const providers = await app.prisma.user_providers.findMany({
              where: {
                user_id: users[0].id,
              },
            });

            assert.lengthOf(providers, 1);
            assert.deepOwnInclude(providers[0], {
              provider_type: 'github',
              provider_id: '123',
              provider_email: 'pavan@example.com',
              refresh_token: '123456',
            });
          });

          test('should have their orgs retrieved', async () => {
            assert.isAtLeast(installationsStub.callCount, 2);
            assert.lengthOf(installationsStub.firstCall.args, 1);
            assert.deepEqual(
              installationsStub.firstCall.args[0],
              '/user/installations?per_page=100',
            );
            assert.lengthOf(installationsStub.secondCall.args, 1);
            assert.deepEqual(
              installationsStub.secondCall.args[0],
              '/user/installations?per_page=100&page=2',
            );
          });
        });
      },
    );

    suite('with user having same email and connected to same provider', () => {
      let response: LightMyRequestResponse;

      setup(async () => {
        const user = await app.prisma.users.create({
          data: {
            email: 'pavan@example.com',
            name: 'Pavan Sunkara',
          },
        });
        await app.prisma.user_providers.create({
          data: {
            user_id: user.id,
            provider_type: 'github',
            provider_id: '123',
            provider_email: 'pavan@example.com',
            refresh_token: 'acbdef',
          },
        });

        response = await call(app, '/callbacks/github?code=abcd&state=1234');
      });

      test('should request access token', async () => {
        assert.equal(postStub.callCount, 1);
        assert.equal(
          postStub.firstCall.args[0],
          'https://github.com/login/oauth/access_token',
        );
        assert.deepEqual(postStub.firstCall.args[1], {
          client_id: 'Iv1.bee7999253d03200',
          client_secret: '279f43a10c306d492656f8069e8b052dc5ccf7d0',
          code: 'abcd',
          redirect_uri: 'http://localhost:8080/callbacks/github',
        });
      });

      test('should retrieve user information', async () => {
        assert.equal(userStub.callCount, 1);
        assert.lengthOf(userStub.firstCall.args, 2);
        assert.equal(userStub.firstCall.args[0], 'https://api.github.com/user');
        assert.deepEqual(userStub.firstCall.args[1], {
          headers: {
            Authorization: 'Bearer abcdef',
          },
        });
      });

      test('should redirect to referer', async () => {
        assert.equal(response.statusCode, 302);

        const location = response.headers.location;

        assert.isString(location);
        assert.equal(location, '/orgs');
      });

      suite('and user', () => {
        let users: users[];

        setup(async () => {
          users = await app.prisma.users.findMany();
        });

        test('should not be updated', async () => {
          assert.lengthOf(users, 1);

          assert.deepOwnInclude(users[0], {
            email: 'pavan@example.com',
            name: 'Pavan Sunkara',
          });
        });

        test('should update github provider refresh token', async () => {
          const providers = await app.prisma.user_providers.findMany({
            where: {
              user_id: users[0].id,
            },
          });

          assert.lengthOf(providers, 1);
          assert.deepOwnInclude(providers[0], {
            provider_type: 'github',
            provider_id: '123',
            provider_email: 'pavan@example.com',
            refresh_token: '123456',
          });
        });

        test('should have their orgs retrieved', async () => {
          assert.isAtLeast(installationsStub.callCount, 2);
          assert.lengthOf(installationsStub.firstCall.args, 1);
          assert.deepEqual(
            installationsStub.firstCall.args[0],
            '/user/installations?per_page=100',
          );
          assert.lengthOf(installationsStub.secondCall.args, 1);
          assert.deepEqual(
            installationsStub.secondCall.args[0],
            '/user/installations?per_page=100&page=2',
          );
        });
      });
    });

    suite(
      'with user having different email and connected to same provider',
      () => {
        let response: LightMyRequestResponse;

        setup(async () => {
          const user = await app.prisma.users.create({
            data: {
              email: 'pavan.sunkara@example.com',
              name: 'Pavan Sunkara',
            },
          });
          await app.prisma.user_providers.create({
            data: {
              user_id: user.id,
              provider_type: 'github',
              provider_id: '123',
              provider_email: 'pavan.sunkara@example.com',
              refresh_token: 'acbdef',
            },
          });

          response = await call(app, '/callbacks/github?code=abcd&state=1234');
        });

        test('should request access token', async () => {
          assert.equal(postStub.callCount, 1);
          assert.equal(
            postStub.firstCall.args[0],
            'https://github.com/login/oauth/access_token',
          );
          assert.deepEqual(postStub.firstCall.args[1], {
            client_id: 'Iv1.bee7999253d03200',
            client_secret: '279f43a10c306d492656f8069e8b052dc5ccf7d0',
            code: 'abcd',
            redirect_uri: 'http://localhost:8080/callbacks/github',
          });
        });

        test('should retrieve user information', async () => {
          assert.equal(userStub.callCount, 1);
          assert.lengthOf(userStub.firstCall.args, 2);
          assert.equal(
            userStub.firstCall.args[0],
            'https://api.github.com/user',
          );
          assert.deepEqual(userStub.firstCall.args[1], {
            headers: {
              Authorization: 'Bearer abcdef',
            },
          });
        });

        test('should redirect to referer', async () => {
          assert.equal(response.statusCode, 302);

          const location = response.headers.location;

          assert.isString(location);
          assert.equal(location, '/orgs');
        });

        suite('and user', () => {
          let users: users[];

          setup(async () => {
            users = await app.prisma.users.findMany();
          });

          test('should not be updated', async () => {
            assert.lengthOf(users, 1);

            assert.deepOwnInclude(users[0], {
              email: 'pavan.sunkara@example.com',
              name: 'Pavan Sunkara',
            });
          });

          test('should update github provider email and refresh token', async () => {
            const providers = await app.prisma.user_providers.findMany({
              where: {
                user_id: users[0].id,
              },
            });

            assert.lengthOf(providers, 1);
            assert.deepOwnInclude(providers[0], {
              provider_type: 'github',
              provider_id: '123',
              provider_email: 'pavan@example.com',
              refresh_token: '123456',
            });
          });

          test('should have their orgs retrieved', async () => {
            assert.isAtLeast(installationsStub.callCount, 2);
            assert.lengthOf(installationsStub.firstCall.args, 1);
            assert.deepEqual(
              installationsStub.firstCall.args[0],
              '/user/installations?per_page=100',
            );
            assert.lengthOf(installationsStub.secondCall.args, 1);
            assert.deepEqual(
              installationsStub.secondCall.args[0],
              '/user/installations?per_page=100&page=2',
            );
          });
        });
      },
    );

    suite(
      'with user having same email and connected to different provider',
      () => {
        let response: LightMyRequestResponse;

        setup(async () => {
          const user = await app.prisma.users.create({
            data: {
              email: 'pavan@example.com',
              name: 'Pavan Sunkara',
            },
          });
          await app.prisma.user_providers.create({
            data: {
              user_id: user.id,
              provider_type: 'github',
              provider_id: '12345',
              provider_email: 'pavan.sunkara@example.com',
              refresh_token: 'acbdef',
            },
          });
          response = await call(app, '/callbacks/github?code=abcd&state=1234');
        });

        test('should request access token', async () => {
          assert.equal(postStub.callCount, 1);
          assert.equal(
            postStub.firstCall.args[0],
            'https://github.com/login/oauth/access_token',
          );
          assert.deepEqual(postStub.firstCall.args[1], {
            client_id: 'Iv1.bee7999253d03200',
            client_secret: '279f43a10c306d492656f8069e8b052dc5ccf7d0',
            code: 'abcd',
            redirect_uri: 'http://localhost:8080/callbacks/github',
          });
        });

        test('should retrieve user information', async () => {
          assert.equal(userStub.callCount, 1);
          assert.lengthOf(userStub.firstCall.args, 2);
          assert.equal(
            userStub.firstCall.args[0],
            'https://api.github.com/user',
          );
          assert.deepEqual(userStub.firstCall.args[1], {
            headers: {
              Authorization: 'Bearer abcdef',
            },
          });
        });

        test('should redirect to referer', async () => {
          assert.equal(response.statusCode, 302);

          const location = response.headers.location;

          assert.isString(location);
          assert.equal(location, '/orgs?error=1001');
        });

        suite('and user', () => {
          let users: users[];

          setup(async () => {
            users = await app.prisma.users.findMany();
          });

          test('should not be updated', async () => {
            assert.lengthOf(users, 1);

            assert.deepOwnInclude(users[0], {
              email: 'pavan@example.com',
              name: 'Pavan Sunkara',
            });
          });

          test('should not update github provider', async () => {
            const providers = await app.prisma.user_providers.findMany({
              where: {
                user_id: users[0].id,
              },
            });

            assert.lengthOf(providers, 1);
            assert.deepOwnInclude(providers[0], {
              provider_type: 'github',
              provider_id: '12345',
              provider_email: 'pavan.sunkara@example.com',
              refresh_token: 'acbdef',
            });
          });

          test('should not have their orgs retrieved', async () => {
            assert.equal(installationsStub.callCount, 0);
          });
        });
      },
    );

    suite(
      'with user having different email and connected to different provider',
      () => {
        let response: LightMyRequestResponse;

        setup(async () => {
          const user = await app.prisma.users.create({
            data: {
              email: 'pavan.sunkara@example.com',
              name: 'Pavan Sunkara',
            },
          });
          await app.prisma.user_providers.create({
            data: {
              user_id: user.id,
              provider_type: 'github',
              provider_id: '12345',
              provider_email: 'pavan.sunkara@example.com',
              refresh_token: 'acbdef',
            },
          });

          response = await call(app, '/callbacks/github?code=abcd&state=1234');
        });

        test('should request access token', async () => {
          assert.equal(postStub.callCount, 1);
          assert.equal(
            postStub.firstCall.args[0],
            'https://github.com/login/oauth/access_token',
          );
          assert.deepEqual(postStub.firstCall.args[1], {
            client_id: 'Iv1.bee7999253d03200',
            client_secret: '279f43a10c306d492656f8069e8b052dc5ccf7d0',
            code: 'abcd',
            redirect_uri: 'http://localhost:8080/callbacks/github',
          });
        });

        test('should retrieve user information', async () => {
          assert.equal(userStub.callCount, 1);
          assert.lengthOf(userStub.firstCall.args, 2);
          assert.equal(
            userStub.firstCall.args[0],
            'https://api.github.com/user',
          );
          assert.deepEqual(userStub.firstCall.args[1], {
            headers: {
              Authorization: 'Bearer abcdef',
            },
          });
        });

        test('should redirect to referer', async () => {
          assert.equal(response.statusCode, 302);

          const location = response.headers.location;

          assert.isString(location);
          assert.equal(location, '/orgs');
        });

        suite('and user', () => {
          let users: users[];

          setup(async () => {
            users = await app.prisma.users.findMany({ orderBy: { id: 'asc' } });
          });

          test('should be created', async () => {
            assert.lengthOf(users, 2);

            assert.deepOwnInclude(users[0], {
              email: 'pavan.sunkara@example.com',
              name: 'Pavan Sunkara',
            });

            assert.deepOwnInclude(users[1], {
              email: 'pavan@example.com',
              name: 'Pavan Kumar Sunkara',
            });
          });

          test('should be connected to github provider', async () => {
            const providers = await app.prisma.user_providers.findMany({
              where: {
                user_id: users[1].id,
              },
            });

            assert.lengthOf(providers, 1);
            assert.deepOwnInclude(providers[0], {
              provider_type: 'github',
              provider_id: '123',
              provider_email: 'pavan@example.com',
              refresh_token: '123456',
            });
          });

          test('should have their orgs retrieved', async () => {
            assert.isAtLeast(installationsStub.callCount, 2);
            assert.lengthOf(installationsStub.firstCall.args, 1);
            assert.deepEqual(
              installationsStub.firstCall.args[0],
              '/user/installations?per_page=100',
            );
            assert.lengthOf(installationsStub.secondCall.args, 1);
            assert.deepEqual(
              installationsStub.secondCall.args[0],
              '/user/installations?per_page=100&page=2',
            );
          });
        });
      },
    );
  });
});
