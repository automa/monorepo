import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';

import { bot_installations, bots, orgs, users } from '@automa/prisma';

import {
  graphql,
  seedBots,
  seedOrgs,
  seedUserOrgs,
  seedUsers,
  server,
} from '../utils';

suite('graphql bots', () => {
  let app: FastifyInstance, sessionUser: users | null;
  let user: users, org: orgs, secondOrg: orgs, nonMemberOrg: orgs;

  suiteSetup(async () => {
    app = await server();

    [user] = await seedUsers(app, 1);
    [org, secondOrg, nonMemberOrg] = await seedOrgs(app, 3);
    await seedUserOrgs(app, user, [org, secondOrg]);

    app.addHook('preValidation', async (request) => {
      request.session.userId = sessionUser?.id ?? undefined;
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

      await app.prisma.bots.updateMany({
        data: {
          paths: ['path-0', 'path-1'],
          is_preview: true,
          is_deterministic: true,
        },
        where: {
          name: 'bot-3',
        },
      });
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
                short_description
                image_url
                description
                type
                webhook_url
                webhook_secret
                paths
                homepage
                published_at
                is_published
                is_preview
                is_deterministic
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

      test('should have no errors', async () => {
        const { errors } = response.json();

        assert.isUndefined(errors);
      });

      test("should return requested org's published and non-published bots", async () => {
        const {
          data: { bots },
        } = response.json();

        assert.lengthOf(bots, 2);

        assert.isNumber(bots[0].id);
        assert.equal(bots[0].name, 'bot-0');
        assert.equal(bots[0].short_description, 'Bot 0');
        assert.equal(bots[0].image_url, 'https://example.com/image/0.png');
        assert.equal(bots[0].description, 'Bot 0 long description');
        assert.equal(bots[0].type, 'manual');
        assert.equal(bots[0].webhook_url, 'https://example.com/webhook/0');
        assert.equal(bots[0].webhook_secret, 'atma_whsec_0');
        assert.isEmpty(bots[0].paths);
        assert.equal(bots[0].homepage, 'https://example.com');
        assert.isString(bots[0].published_at);
        assert.isTrue(bots[0].is_published);
        assert.isFalse(bots[0].is_preview);
        assert.isFalse(bots[0].is_deterministic);
        assert.isString(bots[0].created_at);

        assert.isNumber(bots[1].id);
        assert.equal(bots[1].name, 'bot-3');
        assert.equal(bots[1].short_description, 'Bot 3');
        assert.equal(bots[1].image_url, 'https://example.com/image/3.png');
        assert.equal(bots[1].description, 'Bot 3 long description');
        assert.equal(bots[1].type, 'manual');
        assert.equal(bots[1].webhook_url, 'https://example.com/webhook/3');
        assert.equal(bots[1].webhook_secret, 'atma_whsec_3');
        assert.deepEqual(bots[1].paths, ['path-0', 'path-1']);
        assert.isNull(bots[1].homepage);
        assert.isNull(bots[1].published_at);
        assert.isFalse(bots[1].is_published);
        assert.isTrue(bots[1].is_preview);
        assert.isTrue(bots[1].is_deterministic);
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

  suite('query bot', () => {
    suiteSetup(async () => {
      await seedBots(app, [org, secondOrg, nonMemberOrg], [org]);

      await app.prisma.bots.updateMany({
        data: {
          paths: ['path-0', 'path-1'],
          is_preview: true,
          is_deterministic: true,
        },
        where: {
          name: 'bot-3',
        },
      });
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
            query bot($org_id: Int!, $name: String!) {
              bot(org_id: $org_id, name: $name) {
                id
                name
                short_description
                image_url
                description
                type
                webhook_url
                webhook_secret
                paths
                homepage
                published_at
                is_published
                is_preview
                is_deterministic
                created_at
              }
            }
          `,
          {
            org_id: org.id,
            name: 'bot-3',
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

      test('should have no errors', async () => {
        const { errors } = response.json();

        assert.isUndefined(errors);
      });

      test('should return requested bot', async () => {
        const {
          data: { bot },
        } = response.json();

        assert.isNumber(bot.id);
        assert.equal(bot.name, 'bot-3');
        assert.equal(bot.short_description, 'Bot 3');
        assert.equal(bot.image_url, 'https://example.com/image/3.png');
        assert.equal(bot.description, 'Bot 3 long description');
        assert.equal(bot.type, 'manual');
        assert.equal(bot.webhook_url, 'https://example.com/webhook/3');
        assert.equal(bot.webhook_secret, 'atma_whsec_3');
        assert.deepEqual(bot.paths, ['path-0', 'path-1']);
        assert.isNull(bot.homepage);
        assert.isNull(bot.published_at);
        assert.isFalse(bot.is_published);
        assert.isTrue(bot.is_preview);
        assert.isTrue(bot.is_deterministic);
        assert.isString(bot.created_at);
      });
    });

    test('for member org non-existing bot should fail', async () => {
      const response = await graphql(
        app,
        `
          query bot($org_id: Int!, $name: String!) {
            bot(org_id: $org_id, name: $name) {
              id
              name
            }
          }
        `,
        {
          org_id: org.id,
          name: 'non-existing-bot',
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

    test('for non-member org should fail', async () => {
      const response = await graphql(
        app,
        `
          query bot($org_id: Int!, $name: String!) {
            bot(org_id: $org_id, name: $name) {
              id
              name
            }
          }
        `,
        {
          org_id: nonMemberOrg.id,
          name: 'bot-0',
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
      await seedBots(
        app,
        [org, secondOrg, nonMemberOrg],
        [org, secondOrg, nonMemberOrg],
      );

      await app.prisma.bots.updateMany({
        data: {
          is_deterministic: true,
        },
        where: {
          org_id: org.id,
        },
      });

      await app.prisma.bots.updateMany({
        data: {
          paths: ['path-0', 'path-1'],
          is_preview: true,
        },
        where: {
          name: 'bot-2',
        },
      });
    });

    suiteTeardown(async () => {
      await app.prisma.bots.deleteMany();
    });

    setup(() => {
      sessionUser = null;
    });

    test('should return only published bots from all orgs', async () => {
      const response = await graphql(
        app,
        `
          query publicBots {
            publicBots {
              id
              name
              short_description
              image_url
              paths
              description
              homepage
              is_published
              is_preview
              is_deterministic
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
        errors,
        data: { publicBots: bots },
      } = response.json();

      assert.isUndefined(errors);

      assert.lengthOf(bots, 3);

      assert.isNumber(bots[0].id);
      assert.equal(bots[0].name, 'bot-0');
      assert.equal(bots[0].short_description, 'Bot 0');
      assert.equal(bots[0].image_url, 'https://example.com/image/0.png');
      assert.isEmpty(bots[0].paths);
      assert.equal(bots[0].description, 'Bot 0 long description');
      assert.equal(bots[0].homepage, 'https://example.com');
      assert.isTrue(bots[0].is_published);
      assert.isFalse(bots[0].is_preview);
      assert.isTrue(bots[0].is_deterministic);
      assert.equal(bots[0].org.name, 'org-0');

      assert.isNumber(bots[1].id);
      assert.equal(bots[1].name, 'bot-1');
      assert.equal(bots[1].short_description, 'Bot 1');
      assert.equal(bots[1].image_url, 'https://example.com/image/1.png');
      assert.isEmpty(bots[0].paths);
      assert.equal(bots[1].description, 'Bot 1 long description');
      assert.equal(bots[1].homepage, 'https://example.com');
      assert.isTrue(bots[1].is_published);
      assert.isFalse(bots[1].is_preview);
      assert.isFalse(bots[1].is_deterministic);
      assert.equal(bots[1].org.name, 'org-1');

      assert.isNumber(bots[2].id);
      assert.equal(bots[2].name, 'bot-2');
      assert.equal(bots[2].short_description, 'Bot 2');
      assert.equal(bots[2].image_url, 'https://example.com/image/2.png');
      assert.deepEqual(bots[2].paths, ['path-0', 'path-1']);
      assert.equal(bots[2].description, 'Bot 2 long description');
      assert.equal(bots[2].homepage, 'https://example.com');
      assert.isTrue(bots[2].is_published);
      assert.isTrue(bots[2].is_preview);
      assert.isFalse(bots[2].is_deterministic);
      assert.equal(bots[2].org.name, 'org-2');
    });

    test('should return only published non-deterministic bots from all orgs with filter.is_deterministic = false', async () => {
      const response = await graphql(
        app,
        `
          query publicBots {
            publicBots(filter: { is_deterministic: false }) {
              id
              name
              short_description
              image_url
              paths
              description
              homepage
              is_published
              is_preview
              is_deterministic
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
        errors,
        data: { publicBots: bots },
      } = response.json();

      assert.isUndefined(errors);

      assert.lengthOf(bots, 2);

      assert.isNumber(bots[0].id);
      assert.equal(bots[0].name, 'bot-1');
      assert.equal(bots[0].short_description, 'Bot 1');
      assert.equal(bots[0].image_url, 'https://example.com/image/1.png');
      assert.isEmpty(bots[0].paths);
      assert.equal(bots[0].description, 'Bot 1 long description');
      assert.equal(bots[0].homepage, 'https://example.com');
      assert.isTrue(bots[0].is_published);
      assert.isFalse(bots[0].is_preview);
      assert.isFalse(bots[0].is_deterministic);
      assert.equal(bots[0].org.name, 'org-1');

      assert.isNumber(bots[1].id);
      assert.equal(bots[1].name, 'bot-2');
      assert.equal(bots[1].short_description, 'Bot 2');
      assert.equal(bots[1].image_url, 'https://example.com/image/2.png');
      assert.deepEqual(bots[1].paths, ['path-0', 'path-1']);
      assert.equal(bots[1].description, 'Bot 2 long description');
      assert.equal(bots[1].homepage, 'https://example.com');
      assert.isTrue(bots[1].is_published);
      assert.isTrue(bots[1].is_preview);
      assert.isFalse(bots[1].is_deterministic);
      assert.equal(bots[1].org.name, 'org-2');
    });

    test('should return only published deterministic bots from all orgs with filter.is_deterministic = true', async () => {
      const response = await graphql(
        app,
        `
          query publicBots {
            publicBots(filter: { is_deterministic: true }) {
              id
              name
              short_description
              image_url
              paths
              description
              homepage
              is_published
              is_preview
              is_deterministic
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
        errors,
        data: { publicBots: bots },
      } = response.json();

      assert.isUndefined(errors);

      assert.lengthOf(bots, 1);

      assert.isNumber(bots[0].id);
      assert.equal(bots[0].name, 'bot-0');
      assert.equal(bots[0].short_description, 'Bot 0');
      assert.equal(bots[0].image_url, 'https://example.com/image/0.png');
      assert.isEmpty(bots[0].paths);
      assert.equal(bots[0].description, 'Bot 0 long description');
      assert.equal(bots[0].homepage, 'https://example.com');
      assert.isTrue(bots[0].is_published);
      assert.isFalse(bots[0].is_preview);
      assert.isTrue(bots[0].is_deterministic);
      assert.equal(bots[0].org.name, 'org-0');
    });

    test('should restrict PublicBot fields', async () => {
      const response = await graphql(
        app,
        `
          query publicBots {
            publicBots {
              id
              webhook_url
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
        'Cannot query field "webhook_url" on type "PublicBot".',
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

    test('should return all published and orgs non-published bots for user', async () => {
      sessionUser = user;

      const response = await graphql(
        app,
        `
          query publicBots {
            publicBots {
              id
              name
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
        errors,
        data: { publicBots: bots },
      } = response.json();

      assert.isUndefined(errors);

      assert.lengthOf(bots, 5);

      assert.isNumber(bots[0].id);
      assert.equal(bots[0].name, 'bot-0');

      assert.isNumber(bots[1].id);
      assert.equal(bots[1].name, 'bot-1');

      assert.isNumber(bots[2].id);
      assert.equal(bots[2].name, 'bot-2');

      assert.isNumber(bots[3].id);
      assert.equal(bots[3].name, 'bot-3');

      assert.isNumber(bots[4].id);
      assert.equal(bots[4].name, 'bot-4');
    });
  });

  suite('query publicBot', () => {
    let bot: bots,
      nonMemberOrgBot: bots,
      nonPublishedBot: bots,
      nonPublishedNonMemberOrgBot: bots;

    suiteSetup(async () => {
      [bot, nonMemberOrgBot, nonPublishedBot, nonPublishedNonMemberOrgBot] =
        await seedBots(app, [org, nonMemberOrg], [org, nonMemberOrg]);

      await app.prisma.bots.updateMany({
        data: {
          paths: ['path-0', 'path-1'],
          is_deterministic: true,
        },
        where: {
          name: 'bot-0',
        },
      });
    });

    suiteTeardown(async () => {
      await app.prisma.bots.deleteMany();
    });

    setup(() => {
      sessionUser = null;
    });

    test('should return published bot', async () => {
      const response = await graphql(
        app,
        `
          query publicBot($org_name: String!, $name: String!) {
            publicBot(org_name: $org_name, name: $name) {
              id
              name
              short_description
              image_url
              paths
              description
              homepage
              is_published
              is_preview
              is_deterministic
              org {
                name
              }
            }
          }
        `,
        {
          org_name: org.name,
          name: bot.name,
        },
      );

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        errors,
        data: { publicBot },
      } = response.json();

      assert.isUndefined(errors);

      assert.isNumber(publicBot.id);
      assert.equal(publicBot.name, 'bot-0');
      assert.equal(publicBot.short_description, 'Bot 0');
      assert.equal(publicBot.image_url, 'https://example.com/image/0.png');
      assert.deepEqual(publicBot.paths, ['path-0', 'path-1']);
      assert.equal(publicBot.description, 'Bot 0 long description');
      assert.equal(publicBot.homepage, 'https://example.com');
      assert.isTrue(publicBot.is_published);
      assert.isFalse(publicBot.is_preview);
      assert.isTrue(publicBot.is_deterministic);
      assert.equal(publicBot.org.name, 'org-0');
    });

    test('should restrict PublicBot fields', async () => {
      const response = await graphql(
        app,
        `
          query publicBot($org_name: String!, $name: String!) {
            publicBot(org_name: $org_name, name: $name) {
              id
              webhook_url
            }
          }
        `,
        {
          org_name: org.name,
          name: bot.name,
        },
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
        'Cannot query field "webhook_url" on type "PublicBot".',
      );
      assert.equal(errors[0].extensions.code, 'GRAPHQL_VALIDATION_FAILED');
    });

    test('should restrict PublicOrg fields', async () => {
      const response = await graphql(
        app,
        `
          query publicBot($org_name: String!, $name: String!) {
            publicBot(org_name: $org_name, name: $name) {
              id
              org {
                provider_name
              }
            }
          }
        `,
        {
          org_name: org.name,
          name: bot.name,
        },
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

    test('should not return non-published bot', async () => {
      const response = await graphql(
        app,
        `
          query publicBot($org_name: String!, $name: String!) {
            publicBot(org_name: $org_name, name: $name) {
              id
              name
            }
          }
        `,
        {
          org_name: org.name,
          name: nonPublishedBot.name,
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

    test('should return published bot for user', async () => {
      sessionUser = user;

      const response = await graphql(
        app,
        `
          query publicBot($org_name: String!, $name: String!) {
            publicBot(org_name: $org_name, name: $name) {
              id
              name
            }
          }
        `,
        {
          org_name: org.name,
          name: bot.name,
        },
      );

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        errors,
        data: { publicBot },
      } = response.json();

      assert.isUndefined(errors);

      assert.isNumber(publicBot.id);
      assert.equal(publicBot.name, 'bot-0');
    });

    test('should return non-member org published bot for user', async () => {
      sessionUser = user;

      const response = await graphql(
        app,
        `
          query publicBot($org_name: String!, $name: String!) {
            publicBot(org_name: $org_name, name: $name) {
              id
              name
            }
          }
        `,
        {
          org_name: nonMemberOrg.name,
          name: nonMemberOrgBot.name,
        },
      );

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        errors,
        data: { publicBot },
      } = response.json();

      assert.isUndefined(errors);

      assert.isNumber(publicBot.id);
      assert.equal(publicBot.name, 'bot-1');
    });

    test('should return non-published bot for user', async () => {
      sessionUser = user;

      const response = await graphql(
        app,
        `
          query publicBot($org_name: String!, $name: String!) {
            publicBot(org_name: $org_name, name: $name) {
              id
              name
            }
          }
        `,
        {
          org_name: org.name,
          name: nonPublishedBot.name,
        },
      );

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        errors,
        data: { publicBot },
      } = response.json();

      assert.isUndefined(errors);

      assert.isNumber(publicBot.id);
      assert.equal(publicBot.name, 'bot-2');
    });

    test('should not return non-member org non-published bot for user', async () => {
      sessionUser = user;

      const response = await graphql(
        app,
        `
          query publicBot($org_name: String!, $name: String!) {
            publicBot(org_name: $org_name, name: $name) {
              id
              name
            }
          }
        `,
        {
          org_name: nonMemberOrg.name,
          name: nonPublishedNonMemberOrgBot.name,
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

    suite('installation', () => {
      let response: LightMyRequestResponse,
        botInstallations: bot_installations[];

      suiteSetup(async () => {
        botInstallations =
          await app.prisma.bot_installations.createManyAndReturn({
            data: [
              {
                bot_id: nonMemberOrgBot.id,
                org_id: org.id,
              },
              {
                bot_id: bot.id,
                org_id: nonMemberOrg.id,
              },
              {
                bot_id: nonMemberOrgBot.id,
                org_id: nonMemberOrg.id,
              },
            ],
          });
      });

      setup(async () => {
        sessionUser = user;
      });

      suite('member org', () => {
        setup(async () => {
          response = await graphql(
            app,
            `
              query publicBot(
                $org_name: String!
                $name: String!
                $org_id: Int!
              ) {
                publicBot(org_name: $org_name, name: $name) {
                  id
                  installation(org_id: $org_id) {
                    id
                    created_at
                    org {
                      name
                    }
                  }
                }
              }
            `,
            {
              org_name: nonMemberOrg.name,
              name: nonMemberOrgBot.name,
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

        test('should have no errors', async () => {
          const { errors } = response.json();

          assert.isUndefined(errors);
        });

        test('should return bot installation', async () => {
          const {
            data: {
              publicBot: { installation },
            },
          } = response.json();

          assert.equal(installation.id, botInstallations[0].id);
          assert.isString(installation.created_at);
          assert.equal(installation.org.name, 'org-0');
        });
      });

      suite('member org when not installed', () => {
        setup(async () => {
          response = await graphql(
            app,
            `
              query publicBot(
                $org_name: String!
                $name: String!
                $org_id: Int!
              ) {
                publicBot(org_name: $org_name, name: $name) {
                  id
                  installation(org_id: $org_id) {
                    id
                    created_at
                    org {
                      name
                    }
                  }
                }
              }
            `,
            {
              org_name: nonMemberOrg.name,
              name: nonMemberOrgBot.name,
              org_id: secondOrg.id,
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

        test('should have no errors', async () => {
          const { errors } = response.json();

          assert.isUndefined(errors);
        });

        test('should return null', async () => {
          const {
            data: {
              publicBot: { installation },
            },
          } = response.json();

          assert.isNull(installation);
        });
      });

      suite('bot owner org', () => {
        setup(async () => {
          response = await graphql(
            app,
            `
              query publicBot(
                $org_name: String!
                $name: String!
                $org_id: Int!
              ) {
                publicBot(org_name: $org_name, name: $name) {
                  id
                  installation(org_id: $org_id) {
                    id
                    created_at
                    org {
                      name
                    }
                  }
                }
              }
            `,
            {
              org_name: org.name,
              name: bot.name,
              org_id: nonMemberOrg.id,
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

        test('should have no errors', async () => {
          const { errors } = response.json();

          assert.isUndefined(errors);
        });

        test('should return bot installation', async () => {
          const {
            data: {
              publicBot: { installation },
            },
          } = response.json();

          assert.equal(installation.id, botInstallations[1].id);
          assert.isString(installation.created_at);
          assert.equal(installation.org.name, 'org-2');
        });
      });

      test('for non-member org should fail', async () => {
        const response = await graphql(
          app,
          `
            query publicBot($org_name: String!, $name: String!, $org_id: Int!) {
              publicBot(org_name: $org_name, name: $name) {
                id
                installation(org_id: $org_id) {
                  id
                }
              }
            }
          `,
          {
            org_name: nonMemberOrg.name,
            name: nonMemberOrgBot.name,
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

      test('should restrict PublicOrg fields', async () => {
        const response = await graphql(
          app,
          `
            query publicBot($org_name: String!, $name: String!, $org_id: Int!) {
              publicBot(org_name: $org_name, name: $name) {
                id
                installation(org_id: $org_id) {
                  id
                  org {
                    provider_name
                  }
                }
              }
            }
          `,
          {
            org_name: nonMemberOrg.name,
            name: nonMemberOrgBot.name,
            org_id: org.id,
          },
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

      test('should restrict PublicBot fields', async () => {
        const response = await graphql(
          app,
          `
            query publicBot($org_name: String!, $name: String!, $org_id: Int!) {
              publicBot(org_name: $org_name, name: $name) {
                id
                installation(org_id: $org_id) {
                  id
                  bot {
                    webhook_url
                  }
                }
              }
            }
          `,
          {
            org_name: nonMemberOrg.name,
            name: nonMemberOrgBot.name,
            org_id: org.id,
          },
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
          'Cannot query field "webhook_url" on type "PublicBot".',
        );
        assert.equal(errors[0].extensions.code, 'GRAPHQL_VALIDATION_FAILED');
      });
    });
  });

  suite('mutation botCreate', () => {
    teardown(async () => {
      await app.prisma.bots.deleteMany();
    });

    test('with valid input should succeed', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-5',
        short_description: 'Bot 5',
        description: 'Bot 5',
        type: 'manual',
        webhook_url: 'https://example.com/webhook/5',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        errors,
        data: { botCreate: bot },
      } = response.json();

      assert.isUndefined(errors);

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-5');
      assert.equal(bot.short_description, 'Bot 5');
      assert.equal(bot.description, 'Bot 5');
      assert.equal(bot.type, 'manual');
      assert.equal(bot.webhook_url, 'https://example.com/webhook/5');
      assert.isDefined(bot.webhook_secret);
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
      assert.isString(bot.created_at);

      const count = await app.prisma.bots.count();

      assert.equal(count, 1);
    });

    test('with no description should succeed', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-5',
        short_description: 'Bot 5',
        type: 'manual',
        webhook_url: 'https://example.com/webhook/5',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        errors,
        data: { botCreate: bot },
      } = response.json();

      assert.isUndefined(errors);

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-5');
      assert.equal(bot.short_description, 'Bot 5');
      assert.isNull(bot.description);
      assert.equal(bot.type, 'manual');
      assert.equal(bot.webhook_url, 'https://example.com/webhook/5');
      assert.isDefined(bot.webhook_secret);
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
      assert.isString(bot.created_at);

      const count = await app.prisma.bots.count();

      assert.equal(count, 1);
    });

    test('with null description should succeed', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-5',
        short_description: 'Bot 5',
        description: null,
        type: 'manual',
        webhook_url: 'https://example.com/webhook/5',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        errors,
        data: { botCreate: bot },
      } = response.json();

      assert.isUndefined(errors);

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-5');
      assert.equal(bot.short_description, 'Bot 5');
      assert.isNull(bot.description);
      assert.equal(bot.type, 'manual');
      assert.equal(bot.webhook_url, 'https://example.com/webhook/5');
      assert.isDefined(bot.webhook_secret);
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
      assert.isString(bot.created_at);

      const count = await app.prisma.bots.count();

      assert.equal(count, 1);
    });

    test('with empty description should succeed', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-5',
        short_description: 'Bot 5',
        description: '',
        type: 'manual',
        webhook_url: 'https://example.com/webhook/5',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        errors,
        data: { botCreate: bot },
      } = response.json();

      assert.isUndefined(errors);

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-5');
      assert.equal(bot.short_description, 'Bot 5');
      assert.equal(bot.description, '');
      assert.equal(bot.type, 'manual');
      assert.equal(bot.webhook_url, 'https://example.com/webhook/5');
      assert.isDefined(bot.webhook_secret);
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
      assert.isString(bot.created_at);

      const count = await app.prisma.bots.count();

      assert.equal(count, 1);
    });

    test('non-member org should fail', async () => {
      const response = await botCreate(app, nonMemberOrg.id, {
        name: 'bot-6',
        short_description: 'Bot 6',
        description: 'Bot 6',
        type: 'manual',
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

      const count = await app.prisma.bots.count();

      assert.equal(count, 0);
    });

    test('with missing name should fail', async () => {
      const response = await botCreate(app, org.id, {
        short_description: 'Bot 6',
        description: 'Bot 6',
        type: 'manual',
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

      const count = await app.prisma.bots.count();

      assert.equal(count, 0);
    });

    test('with short name should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: 'b',
        short_description: 'Bot 6',
        description: 'Bot 6',
        type: 'manual',
        webhook_url: 'https://example.com/webhook/6',
      });

      assert.equal(response.statusCode, 200);

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

      const count = await app.prisma.bots.count();

      assert.equal(count, 0);
    });

    test('with long name should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: 'a'.repeat(256),
        short_description: 'Bot 6',
        description: 'Bot 6',
        type: 'manual',
        webhook_url: 'https://example.com/webhook/6',
      });

      assert.equal(response.statusCode, 200);

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

      const count = await app.prisma.bots.count();

      assert.equal(count, 0);
    });

    test('with special chars in name should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-@#$%',
        short_description: 'Bot 6',
        description: 'Bot 6',
        type: 'manual',
        webhook_url: 'https://example.com/webhook/6',
      });

      assert.equal(response.statusCode, 200);

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

      const count = await app.prisma.bots.count();

      assert.equal(count, 0);
    });

    test('with name containing only spaces should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: '     ',
        short_description: 'Bot 6',
        description: 'Bot 6',
        type: 'manual',
        webhook_url: 'https://example.com/webhook/6',
      });

      assert.equal(response.statusCode, 200);

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

      const count = await app.prisma.bots.count();

      assert.equal(count, 0);
    });

    test('with reserved name should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: 'new',
        short_description: 'Bot 6',
        description: 'Bot 6',
        type: 'manual',
        webhook_url: 'https://example.com/webhook/6',
      });

      assert.equal(response.statusCode, 200);

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
          code: 'custom',
          message: 'Must not be a reserved name',
          path: ['name'],
        },
      ]);

      const count = await app.prisma.bots.count();

      assert.equal(count, 0);
    });

    test('with duplicate name should fail', async () => {
      await seedBots(app, [org]);

      const response = await botCreate(app, org.id, {
        name: 'bot-0',
        short_description: 'Bot 0',
        type: 'manual',
        webhook_url: 'https://example.com/webhook/0',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.include(errors[0].message, 'Unprocessable Entity');
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');

      assert.deepEqual(errors[0].extensions.unique, ['org_id', 'name']);

      const count = await app.prisma.bots.count();

      assert.equal(count, 1);
    });

    test('with missing short_description should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-6',
        description: 'Bot 6',
        type: 'manual',
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
        'Field "short_description" of required type "String!" was not provided',
      );
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');

      const count = await app.prisma.bots.count();

      assert.equal(count, 0);
    });

    test('with short short_description should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-6',
        short_description: 'b',
        description: 'Bot 6',
        type: 'manual',
        webhook_url: 'https://example.com/webhook/6',
      });

      assert.equal(response.statusCode, 200);

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
          path: ['short_description'],
          type: 'string',
          inclusive: true,
          exact: false,
          minimum: 3,
        },
      ]);

      const count = await app.prisma.bots.count();

      assert.equal(count, 0);
    });

    test('with long short_description should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-6',
        short_description: 'a'.repeat(256),
        description: 'Bot 6',
        type: 'manual',
        webhook_url: 'https://example.com/webhook/6',
      });

      assert.equal(response.statusCode, 200);

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
          path: ['short_description'],
          type: 'string',
          inclusive: true,
          exact: false,
          maximum: 255,
        },
      ]);

      const count = await app.prisma.bots.count();

      assert.equal(count, 0);
    });

    test('with short_description containing only spaces should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-6',
        short_description: '     ',
        description: 'Bot 6',
        type: 'manual',
        webhook_url: 'https://example.com/webhook/6',
      });

      assert.equal(response.statusCode, 200);

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
          path: ['short_description'],
          type: 'string',
          inclusive: true,
          exact: false,
          minimum: 3,
        },
      ]);

      const count = await app.prisma.bots.count();

      assert.equal(count, 0);
    });

    test('with missing type should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-6',
        short_description: 'Bot 6',
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

      const count = await app.prisma.bots.count();

      assert.equal(count, 0);
    });

    test('with invalid type should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-6',
        short_description: 'Bot 6',
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

      const count = await app.prisma.bots.count();

      assert.equal(count, 0);
    });

    test('with missing webhook_url should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-6',
        short_description: 'Bot 6',
        description: 'Bot 6',
        type: 'manual',
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
        'Field "webhook_url" of required type "String!" was not provided',
      );
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');

      const count = await app.prisma.bots.count();

      assert.equal(count, 0);
    });

    test('with invalid webhook_url should fail', async () => {
      const response = await botCreate(app, org.id, {
        name: 'bot-6',
        short_description: 'Bot 6',
        description: 'Bot 6',
        type: 'manual',
        webhook_url: 'invalid_url',
      });

      assert.equal(response.statusCode, 200);

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

      const count = await app.prisma.bots.count();

      assert.equal(count, 0);
    });
  });

  suite('mutation botUpdate', () => {
    setup(async () => {
      await seedBots(app, [], [org, nonMemberOrg]);
    });

    teardown(async () => {
      await app.prisma.bots.deleteMany();
    });

    test('with valid input should succeed', async () => {
      const response = await botUpdate(app, org.id, 'bot-0', {
        short_description: 'Bot 0 that does something',
        description: 'Bot 0 that does something',
        webhook_url: 'https://example.com/webhooks/automa/0',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        errors,
        data: { botUpdate: bot },
      } = response.json();

      assert.isUndefined(errors);

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-0');
      assert.equal(bot.short_description, 'Bot 0 that does something');
      assert.equal(bot.description, 'Bot 0 that does something');
      assert.equal(bot.type, 'manual');
      assert.equal(bot.webhook_url, 'https://example.com/webhooks/automa/0');
      assert.isDefined(bot.webhook_secret);
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
      assert.isString(bot.created_at);
    });

    test('with no short_description should succeed', async () => {
      const response = await botUpdate(app, org.id, 'bot-0', {
        description: 'Bot 0 that does something',
        webhook_url: 'https://example.com/webhooks/automa/0',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        errors,
        data: { botUpdate: bot },
      } = response.json();

      assert.isUndefined(errors);

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-0');
      assert.equal(bot.short_description, 'Bot 0');
      assert.equal(bot.description, 'Bot 0 that does something');
      assert.equal(bot.type, 'manual');
      assert.equal(bot.webhook_url, 'https://example.com/webhooks/automa/0');
      assert.isDefined(bot.webhook_secret);
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
      assert.isString(bot.created_at);
    });

    test('with null webhook_url should succeed', async () => {
      const response = await botUpdate(app, org.id, 'bot-0', {
        short_description: 'Bot 0 that does something',
        description: 'Bot 0 that does something',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        errors,
        data: { botUpdate: bot },
      } = response.json();

      assert.isUndefined(errors);

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-0');
      assert.equal(bot.short_description, 'Bot 0 that does something');
      assert.equal(bot.description, 'Bot 0 that does something');
      assert.equal(bot.type, 'manual');
      assert.equal(bot.webhook_url, 'https://example.com/webhook/0');
      assert.isDefined(bot.webhook_secret);
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
      assert.isString(bot.created_at);
    });

    test('with no description should succeed', async () => {
      const response = await botUpdate(app, org.id, 'bot-0', {
        short_description: 'Bot 0 that does something',
        webhook_url: 'https://example.com/webhooks/automa/0',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        errors,
        data: { botUpdate: bot },
      } = response.json();

      assert.isUndefined(errors);

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-0');
      assert.equal(bot.short_description, 'Bot 0 that does something');
      assert.equal(bot.description, 'Bot 0 long description');
      assert.equal(bot.type, 'manual');
      assert.equal(bot.webhook_url, 'https://example.com/webhooks/automa/0');
      assert.isDefined(bot.webhook_secret);
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
      assert.isString(bot.created_at);
    });

    test('with null description should succeed', async () => {
      const response = await botUpdate(app, org.id, 'bot-0', {
        short_description: 'Bot 0 that does something',
        description: null,
        webhook_url: 'https://example.com/webhooks/automa/0',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        errors,
        data: { botUpdate: bot },
      } = response.json();

      assert.isUndefined(errors);

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-0');
      assert.equal(bot.short_description, 'Bot 0 that does something');
      assert.isNull(bot.description);
      assert.equal(bot.type, 'manual');
      assert.equal(bot.webhook_url, 'https://example.com/webhooks/automa/0');
      assert.isDefined(bot.webhook_secret);
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
      assert.isString(bot.created_at);
    });

    test('with empty description should succeed', async () => {
      const response = await botUpdate(app, org.id, 'bot-0', {
        short_description: 'Bot 0 that does something',
        description: '',
        webhook_url: 'https://example.com/webhooks/automa/0',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        errors,
        data: { botUpdate: bot },
      } = response.json();

      assert.isUndefined(errors);

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-0');
      assert.equal(bot.short_description, 'Bot 0 that does something');
      assert.equal(bot.description, '');
      assert.equal(bot.type, 'manual');
      assert.equal(bot.webhook_url, 'https://example.com/webhooks/automa/0');
      assert.isDefined(bot.webhook_secret);
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
      assert.isString(bot.created_at);
    });

    test('non-member org should fail', async () => {
      const response = await botUpdate(app, nonMemberOrg.id, 'bot-1', {
        short_description: 'Bot 1 that does something',
        description: 'Bot 1 that does something',
        webhook_url: 'https://example.com/webhooks/automa/1',
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

      const bot = await app.prisma.bots.findFirstOrThrow({
        where: {
          name: 'bot-1',
        },
      });

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-1');
      assert.equal(bot.short_description, 'Bot 1');
      assert.equal(bot.description, 'Bot 1 long description');
      assert.equal(bot.type, 'manual');
      assert.equal(bot.webhook_url, 'https://example.com/webhook/1');
      assert.isDefined(bot.webhook_secret);
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
    });

    test('with null short_description should fail', async () => {
      const response = await botUpdate(app, org.id, 'bot-0', {
        short_description: null,
        description: 'Bot 0 that does something',
        webhook_url: 'https://example.com/webhooks/automa/0',
      });

      assert.equal(response.statusCode, 200);

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
          code: 'invalid_type',
          message: 'Expected string, received null',
          path: ['short_description'],
          expected: 'string',
          received: 'null',
        },
      ]);

      const bot = await app.prisma.bots.findFirstOrThrow({
        where: {
          name: 'bot-0',
        },
      });

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-0');
      assert.equal(bot.short_description, 'Bot 0');
      assert.equal(bot.description, 'Bot 0 long description');
      assert.equal(bot.type, 'manual');
      assert.equal(bot.webhook_url, 'https://example.com/webhook/0');
      assert.isDefined(bot.webhook_secret);
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
    });

    test('with short short_description should fail', async () => {
      const response = await botUpdate(app, org.id, 'bot-0', {
        short_description: 'b',
        description: 'Bot 0 that does something',
        webhook_url: 'https://example.com/webhooks/automa/0',
      });

      assert.equal(response.statusCode, 200);

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
          path: ['short_description'],
          type: 'string',
          inclusive: true,
          exact: false,
          minimum: 3,
        },
      ]);

      const bot = await app.prisma.bots.findFirstOrThrow({
        where: {
          name: 'bot-0',
        },
      });

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-0');
      assert.equal(bot.short_description, 'Bot 0');
      assert.equal(bot.description, 'Bot 0 long description');
      assert.equal(bot.type, 'manual');
      assert.equal(bot.webhook_url, 'https://example.com/webhook/0');
      assert.isDefined(bot.webhook_secret);
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
    });

    test('with long short_description should fail', async () => {
      const response = await botUpdate(app, org.id, 'bot-0', {
        short_description: 'a'.repeat(256),
        description: 'Bot 0 that does something',
        webhook_url: 'https://example.com/webhooks/automa/0',
      });

      assert.equal(response.statusCode, 200);

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
          path: ['short_description'],
          type: 'string',
          inclusive: true,
          exact: false,
          maximum: 255,
        },
      ]);

      const bot = await app.prisma.bots.findFirstOrThrow({
        where: {
          name: 'bot-0',
        },
      });

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-0');
      assert.equal(bot.short_description, 'Bot 0');
      assert.equal(bot.description, 'Bot 0 long description');
      assert.equal(bot.type, 'manual');
      assert.equal(bot.webhook_url, 'https://example.com/webhook/0');
      assert.isDefined(bot.webhook_secret);
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
    });

    test('with short_description containing only spaces should fail', async () => {
      const response = await botUpdate(app, org.id, 'bot-0', {
        short_description: '      ',
        description: 'Bot 0 that does something',
        webhook_url: 'https://example.com/webhooks/automa/0',
      });

      assert.equal(response.statusCode, 200);

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
          path: ['short_description'],
          type: 'string',
          inclusive: true,
          exact: false,
          minimum: 3,
        },
      ]);

      const bot = await app.prisma.bots.findFirstOrThrow({
        where: {
          name: 'bot-0',
        },
      });

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-0');
      assert.equal(bot.short_description, 'Bot 0');
      assert.equal(bot.description, 'Bot 0 long description');
      assert.equal(bot.type, 'manual');
      assert.equal(bot.webhook_url, 'https://example.com/webhook/0');
      assert.isDefined(bot.webhook_secret);
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
    });

    test('with null webhook_url should fail', async () => {
      const response = await botUpdate(app, org.id, 'bot-0', {
        short_description: 'Bot 0 that does something',
        description: 'Bot 0 that does something',
        webhook_url: null,
      });

      assert.equal(response.statusCode, 200);

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
          code: 'invalid_type',
          message: 'Expected string, received null',
          path: ['webhook_url'],
          expected: 'string',
          received: 'null',
        },
      ]);

      const bot = await app.prisma.bots.findFirstOrThrow({
        where: {
          name: 'bot-0',
        },
      });

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-0');
      assert.equal(bot.short_description, 'Bot 0');
      assert.equal(bot.description, 'Bot 0 long description');
      assert.equal(bot.type, 'manual');
      assert.equal(bot.webhook_url, 'https://example.com/webhook/0');
      assert.isDefined(bot.webhook_secret);
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
    });

    test('with invalid webhook_url should fail', async () => {
      const response = await botUpdate(app, org.id, 'bot-0', {
        short_description: 'Bot 0 that does something',
        description: 'Bot 0 that does something',
        webhook_url: 'invalid_url',
      });

      assert.equal(response.statusCode, 200);

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

      const bot = await app.prisma.bots.findFirstOrThrow({
        where: {
          name: 'bot-0',
        },
      });

      assert.isNumber(bot.id);
      assert.equal(bot.name, 'bot-0');
      assert.equal(bot.short_description, 'Bot 0');
      assert.equal(bot.description, 'Bot 0 long description');
      assert.equal(bot.type, 'manual');
      assert.equal(bot.webhook_url, 'https://example.com/webhook/0');
      assert.isDefined(bot.webhook_secret);
      assert.isNull(bot.homepage);
      assert.isNull(bot.published_at);
      assert.isFalse(bot.is_published);
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
          short_description
          description
          type
          webhook_url
          webhook_secret
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

const botUpdate = (
  app: FastifyInstance,
  orgId: number,
  name: string,
  input: any,
) =>
  graphql(
    app,
    `
      mutation botUpdate(
        $org_id: Int!
        $name: String!
        $input: BotUpdateInput!
      ) {
        botUpdate(org_id: $org_id, name: $name, input: $input) {
          id
          name
          short_description
          description
          type
          webhook_url
          webhook_secret
          homepage
          published_at
          is_published
          created_at
        }
      }
    `,
    {
      org_id: orgId,
      name,
      input,
    },
  );
