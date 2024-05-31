import { assert } from 'chai';
import { FastifyInstance, LightMyRequestResponse } from 'fastify';

import { server, graphql, seedUsers } from '../utils';

suite('graphql orgs', () => {
  let app: FastifyInstance;

  suiteSetup(async () => {
    app = await server();

    const [user] = await seedUsers(app, 1);

    await app.prisma.orgs.createMany({
      data: [
        {
          name: 'pksunkara',
          provider_type: 'github',
          provider_id: '123',
          provider_name: 'pksunkara',
          is_user: true,
        },
        {
          name: 'automa',
          provider_type: 'github',
          provider_id: '456',
          provider_name: 'automa',
          is_user: false,
          has_installation: true,
          github_installation_id: 123,
        },
        {
          name: 'gitlab-automa',
          provider_type: 'gitlab',
          provider_id: '123',
          provider_name: 'automa',
          is_user: false,
        },
        {
          name: 'johndoe',
          provider_type: 'github',
          provider_id: '789',
          provider_name: 'johndoe',
          is_user: true,
          has_installation: true,
          github_installation_id: 456,
        },
      ],
    });

    await app.prisma.user_orgs.createMany({
      data: (await app.prisma.orgs.findMany())
        .filter((o) => o.name !== 'johndoe')
        .map(({ id }) => ({ org_id: id, user_id: user.id })),
    });

    app.addHook('preHandler', async (request) => {
      request.user = user;
    });
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.prisma.users.deleteMany();
    await app.close();
  });

  suite('query orgs', () => {
    let response: LightMyRequestResponse;

    setup(async () => {
      response = await graphql(
        app,
        `
          query orgs {
            orgs {
              id
              name
              provider_type
              provider_id
              provider_name
              is_user
              has_installation
              github_installation_id
              created_at
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

    test('should have no errors', async () => {
      const { errors } = response.json();

      assert.isUndefined(errors);
    });

    test("should return user's orgs only", async () => {
      const {
        data: { orgs },
      } = response.json();

      assert.lengthOf(orgs, 3);

      assert.isNumber(orgs[0].id);
      assert.equal(orgs[0].name, 'pksunkara');
      assert.equal(orgs[0].provider_type, 'github');
      assert.equal(orgs[0].provider_id, '123');
      assert.equal(orgs[0].provider_name, 'pksunkara');
      assert.isTrue(orgs[0].is_user);
      assert.isFalse(orgs[0].has_installation);
      assert.isNull(orgs[0].github_installation_id);
      assert.isString(orgs[0].created_at);

      assert.isNumber(orgs[1].id);
      assert.equal(orgs[1].name, 'automa');
      assert.equal(orgs[1].provider_type, 'github');
      assert.equal(orgs[1].provider_id, '456');
      assert.equal(orgs[1].provider_name, 'automa');
      assert.isFalse(orgs[1].is_user);
      assert.isTrue(orgs[1].has_installation);
      assert.equal(orgs[1].github_installation_id, 123);
      assert.isString(orgs[1].created_at);

      assert.isNumber(orgs[2].id);
      assert.equal(orgs[2].name, 'gitlab-automa');
      assert.equal(orgs[2].provider_type, 'gitlab');
      assert.equal(orgs[2].provider_id, '123');
      assert.equal(orgs[2].provider_name, 'automa');
      assert.isFalse(orgs[2].is_user);
      assert.isFalse(orgs[2].has_installation);
      assert.isNull(orgs[2].github_installation_id);
      assert.isString(orgs[2].created_at);
    });
  });
});
