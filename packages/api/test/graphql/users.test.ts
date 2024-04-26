import { assert } from 'chai';
import { FastifyInstance, LightMyRequestResponse } from 'fastify';

import { server, graphql, seedUsers } from '../utils';

suite('graphql users', () => {
  let app: FastifyInstance;

  suiteSetup(async () => {
    app = await server();

    const [user, secondUser] = await seedUsers(app, 2);

    await app.prisma.user_providers.createMany({
      data: [
        {
          user_id: user.id,
          provider_type: 'github',
          provider_id: '123',
          provider_email: 'pavan@example.com',
          refresh_token: 'acbdef',
        },
        {
          user_id: user.id,
          provider_type: 'gitlab',
          provider_id: '123',
          provider_email: 'pavan.sunkara@example.com',
          refresh_token: 'acbdef',
        },
        {
          user_id: secondUser.id,
          provider_type: 'github',
          provider_id: '456',
          provider_email: 'john@example.com',
          refresh_token: 'acbdef',
        },
      ],
    });

    app.addHook('preHandler', async (request) => {
      request.user = user;
    });
  });

  suiteTeardown(async () => {
    await app.prisma.users.deleteMany();
    await app.close();
  });

  suite('query me', () => {
    let response: LightMyRequestResponse;

    setup(async () => {
      response = await graphql(
        app,
        `
          query me {
            me {
              id
              name
              email
              providers {
                id
                provider_type
                provider_id
              }
            }
          }
        `,
      );
    });

    test('should be successful', () => {
      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );
    });

    test('should return user', async () => {
      const {
        data: { me },
      } = response.json();

      assert.isNumber(me.id);
      assert.equal(me.name, 'User 0');
      assert.equal(me.email, 'user-0@example.com');
    });

    test("should return user's providers only", async () => {
      const {
        data: { me },
      } = response.json();

      assert.lengthOf(me.providers, 2);

      assert.isNumber(me.providers[0].id);
      assert.equal(me.providers[0].provider_type, 'github');
      assert.equal(me.providers[0].provider_id, '123');

      assert.isNumber(me.providers[1].id);
      assert.equal(me.providers[1].provider_type, 'gitlab');
      assert.equal(me.providers[1].provider_id, '123');
    });
  });
});
