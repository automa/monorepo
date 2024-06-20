import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';

import { seedUsers, server } from '../../utils';

import { callWithFixture } from './utils';

suite('github hook github_app_authorization event', () => {
  let app: FastifyInstance, response: LightMyRequestResponse;

  suiteSetup(async () => {
    app = await server();
  });

  suiteTeardown(async () => {
    await app.close();
  });

  suite('revoked', () => {
    suite('with no user', () => {
      setup(async () => {
        response = await callWithFixture(
          app,
          'github_app_authorization',
          'revoked',
        );
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should not do anything', async () => {
        assert.equal(await app.prisma.users.count(), 0);
      });
    });

    suite('with user', () => {
      setup(async () => {
        const user = await seedUsers(app, 1);

        await app.prisma.user_providers.create({
          data: {
            user_id: user[0].id,
            provider_type: 'github',
            provider_id: '174703',
            provider_email: 'user-0@exmaple.com',
            refresh_token: 'abcdef',
          },
        });

        response = await callWithFixture(
          app,
          'github_app_authorization',
          'revoked',
        );
      });

      teardown(async () => {
        await app.prisma.users.deleteMany();
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should delete refresh token for user provider', async () => {
        const users = await app.prisma.users.findMany();

        assert.lengthOf(users, 1);

        assert.deepOwnInclude(users[0], {
          name: 'User 0',
          email: 'user-0@example.com',
        });

        const userProviders = await app.prisma.user_providers.findMany();

        assert.lengthOf(userProviders, 1);

        assert.deepOwnInclude(userProviders[0], {
          user_id: users[0].id,
          provider_type: 'github',
          provider_id: '174703',
          provider_email: 'user-0@exmaple.com',
          refresh_token: null,
        });
      });
    });
  });
});
