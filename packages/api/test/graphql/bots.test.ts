import { assert } from 'chai';
import { FastifyInstance, LightMyRequestResponse } from 'fastify';

import { orgs, users } from '@automa/prisma';

import { server, graphql, seedUsers, seedOrgs, seedBots } from '../utils';

suite('graphql bots', () => {
  let app: FastifyInstance, sessionUser: users | null;
  let user: users, org: orgs, secondOrg: orgs, nonMemberOrg: orgs;

  suiteSetup(async () => {
    app = await server();

    [user] = await seedUsers(app, 1);
    [org, secondOrg, nonMemberOrg] = await seedOrgs(app, 3);

    await app.prisma.user_orgs.createMany({
      data: [
        {
          org_id: org.id,
          user_id: user.id,
        },
        {
          org_id: secondOrg.id,
          user_id: user.id,
        },
      ],
    });

    app.addHook('preHandler', async (request) => {
      request.user = sessionUser;
    });
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.prisma.users.deleteMany();
    await app.close();
  });

  setup(() => {
    sessionUser = user;
  });

  suite('query bots', () => {
    suiteSetup(async () => {
      await seedBots(app, [org, secondOrg, nonMemberOrg], [org]);
    });

    suiteTeardown(async () => {
      await app.prisma.bots.deleteMany();
    });

    suite('member org', () => {
      let response: LightMyRequestResponse;

      setup(async () => {
        response = await graphql(
          app,
          `
            query bots($org_id: Int!) {
              bots(org_id: $org_id) {
                id
                name
                description
                type
                webhook_url
                homepage
                published_at
                is_published
                created_at
              }
            }
          `,
          {
            org_id: org.id,
          },
        );
      });

      test('should be successful', () => {
        assert.equal(response.statusCode, 200);

        assert.equal(
          response.headers['content-type'],
          'application/json; charset=utf-8',
        );
      });

      test("should return requested org's published and non-published bots", async () => {
        const {
          data: { bots },
        } = response.json();

        assert.lengthOf(bots, 2);

        assert.isNumber(bots[0].id);
        assert.equal(bots[0].name, 'bot-0');
        assert.equal(bots[0].description, 'Bot 0');
        assert.equal(bots[0].type, 'webhook');
        assert.equal(bots[0].webhook_url, 'https://example.com/webhook/0');
        assert.equal(bots[0].homepage, 'https://example.com');
        assert.isString(bots[0].published_at);
        assert.isTrue(bots[0].is_published);
        assert.isString(bots[0].created_at);

        assert.isNumber(bots[1].id);
        assert.equal(bots[1].name, 'bot-3');
        assert.equal(bots[1].description, 'Bot 3');
        assert.equal(bots[1].type, 'webhook');
        assert.equal(bots[1].webhook_url, 'https://example.com/webhook/3');
        assert.isNull(bots[1].homepage);
        assert.isNull(bots[1].published_at);
        assert.isFalse(bots[1].is_published);
        assert.isString(bots[1].created_at);
      });
    });

    test('for non-member org should fail', async () => {
      const response = await graphql(
        app,
        `
          query bots($org_id: Int!) {
            bots(org_id: $org_id) {
              id
              name
            }
          }
        `,
        {
          org_id: nonMemberOrg.id,
        },
      );

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.equal(errors[0].message, 'Not Found');
      assert.equal(errors[0].extensions.code, 'NOT_FOUND');
    });
  });

  suite('query publicBots', () => {
    suiteSetup(async () => {
      await seedBots(app, [org, secondOrg, nonMemberOrg], [org]);
    });

    suiteTeardown(async () => {
      await app.prisma.bots.deleteMany();
    });

    setup(() => {
      sessionUser = null;
    });

    test('should return published bots from all orgs', async () => {
      const response = await graphql(
        app,
        `
          query publicBots {
            publicBots {
              id
              name
              description
              homepage
              org {
                name
              }
            }
          }
        `,
      );

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        data: { publicBots: bots },
      } = response.json();

      assert.lengthOf(bots, 3);

      assert.isNumber(bots[0].id);
      assert.equal(bots[0].name, 'bot-0');
      assert.equal(bots[0].description, 'Bot 0');
      assert.equal(bots[0].homepage, 'https://example.com');
      assert.equal(bots[0].org.name, 'org-0');

      assert.isNumber(bots[1].id);
      assert.equal(bots[1].name, 'bot-1');
      assert.equal(bots[1].description, 'Bot 1');
      assert.equal(bots[1].homepage, 'https://example.com');
      assert.equal(bots[1].org.name, 'org-1');

      assert.isNumber(bots[2].id);
      assert.equal(bots[2].name, 'bot-2');
      assert.equal(bots[2].description, 'Bot 2');
      assert.equal(bots[2].homepage, 'https://example.com');
      assert.equal(bots[2].org.name, 'org-2');
    });

    test('should restrict PublicBot fields', async () => {
      const response = await graphql(
        app,
        `
          query publicBots {
            publicBots {
              id
              type
            }
          }
        `,
      );

      assert.equal(response.statusCode, 400);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.include(
        errors[0].message,
        'Cannot query field "type" on type "PublicBot".',
      );
      assert.equal(errors[0].extensions.code, 'GRAPHQL_VALIDATION_FAILED');
    });

    test('should restrict PublicOrg fields', async () => {
      const response = await graphql(
        app,
        `
          query publicBots {
            publicBots {
              id
              org {
                provider_name
              }
            }
          }
        `,
      );

      assert.equal(response.statusCode, 400);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.include(
        errors[0].message,
        'Cannot query field "provider_name" on type "PublicOrg".',
      );
      assert.equal(errors[0].extensions.code, 'GRAPHQL_VALIDATION_FAILED');
    });
  });

  suite('mutation botCreate', () => {
    teardown(async () => {
      await app.prisma.bots.deleteMany();
    });

    test('with valid input should succeed', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-5',
        description: 'Bot 5',
        type: 'webhook',
        webhook_url: 'https://example.com/webhook/5',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        data: { botCreate: bot },
      } = response.json();

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-5');
      assert.equal(bot.description, 'Bot 5');
      assert.equal(bot.type, 'webhook');
      assert.equal(bot.webhook_url, 'https://example.com/webhook/5');
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
      assert.isString(bot.created_at);
    });

    test('with no description should succeed', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-5',
        type: 'webhook',
        webhook_url: 'https://example.com/webhook/5',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        data: { botCreate: bot },
      } = response.json();

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-5');
      assert.isNull(bot.description);
      assert.equal(bot.type, 'webhook');
      assert.equal(bot.webhook_url, 'https://example.com/webhook/5');
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
      assert.isString(bot.created_at);
    });

    test('with null description should succeed', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-5',
        description: null,
        type: 'webhook',
        webhook_url: 'https://example.com/webhook/5',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        data: { botCreate: bot },
      } = response.json();

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-5');
      assert.isNull(bot.description);
      assert.equal(bot.type, 'webhook');
      assert.equal(bot.webhook_url, 'https://example.com/webhook/5');
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
      assert.isString(bot.created_at);
    });

    test('with empty description should succeed', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-5',
        description: '',
        type: 'webhook',
        webhook_url: 'https://example.com/webhook/5',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        data: { botCreate: bot },
      } = response.json();

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-5');
      assert.equal(bot.description, '');
      assert.equal(bot.type, 'webhook');
      assert.equal(bot.webhook_url, 'https://example.com/webhook/5');
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
      assert.isString(bot.created_at);
    });

    test('non-member org should fail', async () => {
      const response = await botCreate(app, nonMemberOrg.id, {
        name: 'bot-6',
        description: 'Bot 6',
        type: 'webhook',
        webhook_url: 'https://example.com/webhook/6',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.equal(errors[0].message, 'Not Found');
      assert.equal(errors[0].extensions.code, 'NOT_FOUND');
    });

    test('with missing name should fail', async () => {
      const response = await botCreate(app, org.id, {
        description: 'Bot 6',
        type: 'webhook',
        webhook_url: 'https://example.com/webhook/6',
      });

      assert.equal(response.statusCode, 400);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.include(
        errors[0].message,
        'Field "name" of required type "String!" was not provided',
      );
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');
    });

    test('with short name should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: 'b',
        description: 'Bot 6',
        type: 'webhook',
        webhook_url: 'https://example.com/webhook/6',
      });

      assert.equal(response.statusCode, 400);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.include(errors[0].message, 'Unprocessable Entity');
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');

      assert.deepEqual(errors[0].extensions.errors, [
        {
          code: 'too_small',
          message: 'String must contain at least 3 character(s)',
          path: ['name'],
          type: 'string',
          inclusive: true,
          exact: false,
          minimum: 3,
        },
      ]);
    });

    test('with long name should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: 'a'.repeat(256),
        description: 'Bot 6',
        type: 'webhook',
        webhook_url: 'https://example.com/webhook/6',
      });

      assert.equal(response.statusCode, 400);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.include(errors[0].message, 'Unprocessable Entity');
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');

      assert.deepEqual(errors[0].extensions.errors, [
        {
          code: 'too_big',
          message: 'String must contain at most 255 character(s)',
          path: ['name'],
          type: 'string',
          inclusive: true,
          exact: false,
          maximum: 255,
        },
      ]);
    });

    test('with special chars in name should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-@#$%',
        description: 'Bot 6',
        type: 'webhook',
        webhook_url: 'https://example.com/webhook/6',
      });

      assert.equal(response.statusCode, 400);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.include(errors[0].message, 'Unprocessable Entity');
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');

      assert.deepEqual(errors[0].extensions.errors, [
        {
          code: 'invalid_string',
          message: 'Must only contain alphanumeric characters and dashes',
          path: ['name'],
          validation: 'regex',
        },
      ]);
    });

    test('with name containing only spaces should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: '     ',
        description: 'Bot 6',
        type: 'webhook',
        webhook_url: 'https://example.com/webhook/6',
      });

      assert.equal(response.statusCode, 400);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();
      assert.lengthOf(errors, 1);
      assert.include(errors[0].message, 'Unprocessable Entity');
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');

      assert.deepEqual(errors[0].extensions.errors, [
        {
          code: 'too_small',
          message: 'String must contain at least 3 character(s)',
          path: ['name'],
          type: 'string',
          inclusive: true,
          exact: false,
          minimum: 3,
        },
        {
          code: 'invalid_string',
          message: 'Must only contain alphanumeric characters and dashes',
          path: ['name'],
          validation: 'regex',
        },
      ]);
    });

    test('with duplicate name should fail', async () => {
      await seedBots(app, [org]);

      const response = await botCreate(app, org.id, {
        name: 'bot-0',
        type: 'webhook',
        webhook_url: 'https://example.com/webhook/0',
      });

      assert.equal(response.statusCode, 400);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.include(errors[0].message, 'Unprocessable Entity');
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');

      assert.deepEqual(errors[0].extensions.unique, ['org_id', 'name']);
    });

    test('with missing type should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-6',
        description: 'Bot 6',
        webhook_url: 'https://example.com/webhook/6',
      });

      assert.equal(response.statusCode, 400);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.include(
        errors[0].message,
        'Field "type" of required type "BotType!" was not provided',
      );
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');
    });

    test('with invalid type should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-6',
        description: 'Bot 6',
        type: 'invalid',
        webhook_url: 'https://example.com/webhook/6',
      });

      assert.equal(response.statusCode, 400);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.include(
        errors[0].message,
        'Value "invalid" does not exist in "BotType" enum',
      );
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');
    });

    test.skip('with missing webhook_url should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-6',
        description: 'Bot 6',
        type: 'webhook',
      });

      assert.equal(response.statusCode, 400);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.include(
        errors[0].message,
        'Field "type" of required type "String!" was not provided',
      );
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');
    });

    test('with invalid webhook_url should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-6',
        description: 'Bot 6',
        type: 'webhook',
        webhook_url: 'invalid_url',
      });

      assert.equal(response.statusCode, 400);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.include(errors[0].message, 'Unprocessable Entity');
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');

      assert.deepEqual(errors[0].extensions.errors, [
        {
          code: 'invalid_string',
          message: 'Invalid url',
          path: ['webhook_url'],
          validation: 'url',
        },
      ]);
    });
  });
});

const botCreate = (app: FastifyInstance, orgId: number, input: any) =>
  graphql(
    app,
    `
      mutation botCreate($org_id: Int!, $input: BotCreateInput!) {
        botCreate(org_id: $org_id, input: $input) {
          id
          name
          description
          type
          webhook_url
          homepage
          published_at
          is_published
          created_at
        }
      }
    `,
    {
      org_id: orgId,
      input,
    },
  );
