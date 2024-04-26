import { assert } from 'chai';
import { FastifyInstance, LightMyRequestResponse } from 'fastify';

import { orgs } from '@automa/prisma';

import { server, graphql, seedUsers, seedOrgs } from '../utils';

suite('graphql bots', () => {
  let app: FastifyInstance, org: orgs, secondOrg: orgs, nonMemberOrg: orgs;

  suiteSetup(async () => {
    app = await server();

    const [user] = await seedUsers(app, 1);
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

    await app.prisma.bots.createMany({
      data: [
        {
          org_id: org.id,
          name: 'bot-1',
          description: 'Bot 1',
          type: 'webhook',
          webhook_url: 'https://example.com/webhook/one',
          homepage: 'https://example.com',
          published_at: new Date(),
        },
        {
          org_id: org.id,
          name: 'bot-2',
          type: 'webhook',
          webhook_url: 'https://example.com/webhook/two',
        },
        {
          org_id: secondOrg.id,
          name: 'bot-3',
          description: 'Bot 3',
          type: 'webhook',
          webhook_url: 'https://example.com/webhook/three',
          homepage: 'https://example.com',
          published_at: new Date(),
        },
        {
          org_id: nonMemberOrg.id,
          name: 'bot-4',
          description: 'Bot 4',
          type: 'webhook',
          webhook_url: 'https://example.com/webhook/four',
          homepage: 'https://example.com',
          published_at: new Date(),
        },
      ],
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

  suite('query bots', () => {
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

      test("should return requested org's bots only", async () => {
        const {
          data: { bots },
        } = response.json();

        assert.lengthOf(bots, 2);

        assert.isNumber(bots[0].id);
        assert.equal(bots[0].name, 'bot-1');
        assert.equal(bots[0].description, 'Bot 1');
        assert.equal(bots[0].type, 'webhook');
        assert.equal(bots[0].webhook_url, 'https://example.com/webhook/one');
        assert.equal(bots[0].homepage, 'https://example.com');
        assert.isString(bots[0].published_at);
        assert.isTrue(bots[0].is_published);
        assert.isString(bots[0].created_at);
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

  suite('mutation botCreate', () => {
    suite('with valid input', () => {
      let response: LightMyRequestResponse;

      setup(async () => {
        response = await botCreate(app, org.id, {
          name: 'bot-5',
          description: 'Bot 5',
          type: 'webhook',
          webhook_url: 'https://example.com/webhook/five',
        });
      });

      teardown(async () => {
        await app.prisma.bots.deleteMany();
      });

      test('should be successful', () => {
        assert.equal(response.statusCode, 200);

        assert.equal(
          response.headers['content-type'],
          'application/json; charset=utf-8',
        );
      });

      test('should return the created bot', async () => {
        const {
          data: { botCreate },
        } = response.json();

        assert.isNumber(botCreate.id);
        assert.equal(botCreate.name, 'bot-5');
        assert.equal(botCreate.description, 'Bot 5');
        assert.equal(botCreate.type, 'webhook');
        assert.equal(botCreate.webhook_url, 'https://example.com/webhook/five');
        assert.isNull(botCreate.homepage);
        assert.isNull(botCreate.published_at);
        assert.isFalse(botCreate.is_published);
        assert.isString(botCreate.created_at);
      });
    });

    test('non-member org should fail', async () => {
      const response = await botCreate(app, nonMemberOrg.id, {
        name: 'bot-6',
        description: 'Bot 6',
        type: 'webhook',
        webhook_url: 'https://example.com/webhook/six',
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
        description: 'Bot',
        type: 'webhook',
        webhook_url: 'https://example.com/webhook/five',
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
        description: 'Bot',
        type: 'webhook',
        webhook_url: 'https://example.com/webhook/five',
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

    test('with special chars in name should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-@#$%',
        description: 'Bot',
        type: 'webhook',
        webhook_url: 'https://example.com/webhook/five',
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

    test('with duplicate name should fail', async () => {
      await app.prisma.bots.create({
        data: {
          org_id: org.id,
          name: 'bot',
          type: 'webhook',
          webhook_url: 'https://example.com/webhook/seven',
        },
      });

      const response = await botCreate(app, org.id, {
        name: 'bot',
        type: 'webhook',
        webhook_url: 'https://example.com/webhook/five',
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
        name: 'bot',
        description: 'Bot',
        webhook_url: 'https://example.com/webhook/five',
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
        name: 'bot',
        description: 'Bot',
        type: 'invalid',
        webhook_url: 'https://example.com/webhook/five',
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
        name: 'bot',
        description: 'Bot',
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
        name: 'bot',
        description: 'Bot',
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
