import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';

import { bots, orgs } from '@automa/prisma';

import {
  graphql,
  seedBots,
  seedOrgs,
  seedUserOrgs,
  seedUsers,
  server,
} from '../utils';

suite('graphql botInstallations', () => {
  let app: FastifyInstance, sandbox: SinonSandbox, publishStub: SinonStub;
  let org: orgs, secondOrg: orgs, nonMemberOrg: orgs;
  let bot: bots,
    secondOrgBot: bots,
    nonMemberOrgBot: bots,
    nonPublishedBot: bots;

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();

    const [user] = await seedUsers(app, 1);
    [org, secondOrg, nonMemberOrg] = await seedOrgs(app, 3);
    await seedUserOrgs(app, user, [org, secondOrg]);
    [bot, , secondOrgBot, nonMemberOrgBot, , nonPublishedBot] = await seedBots(
      app,
      [org, org, secondOrg, nonMemberOrg, nonMemberOrg],
      [org],
    );

    await app.prisma.bots.updateMany({
      data: {
        type: 'scheduled',
      },
      where: {
        id: {
          in: [bot.id, nonPublishedBot.id],
        },
      },
    });

    app.addHook('preValidation', async (request) => {
      request.session.userId = user.id;
    });
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.prisma.users.deleteMany();
    await app.close();
  });

  suite('org bot_installations_count', () => {
    let response: LightMyRequestResponse;

    suiteSetup(async () => {
      await app.prisma.bot_installations.createMany({
        data: [
          {
            bot_id: bot.id,
            org_id: org.id,
          },
          {
            bot_id: nonMemberOrgBot.id,
            org_id: org.id,
          },
        ],
      });
    });

    suiteTeardown(async () => {
      await app.prisma.bot_installations.deleteMany();
    });

    setup(async () => {
      response = await graphql(
        app,
        `
          query orgs {
            orgs {
              id
              bot_installations_count
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

    test('should return bot_installations_count', async () => {
      const {
        data: { orgs },
      } = response.json();

      assert.lengthOf(orgs, 2);

      assert.equal(orgs[0].bot_installations_count, 2);
      assert.equal(orgs[1].bot_installations_count, 0);
    });
  });

  suite('query botInstallations', () => {
    suiteSetup(async () => {
      await app.prisma.bot_installations.createMany({
        data: [
          {
            bot_id: bot.id,
            org_id: org.id,
          },
          {
            bot_id: secondOrgBot.id,
            org_id: org.id,
          },
          {
            bot_id: nonMemberOrgBot.id,
            org_id: org.id,
          },
          {
            bot_id: nonPublishedBot.id,
            org_id: org.id,
          },
        ],
      });
    });

    suiteTeardown(async () => {
      await app.prisma.bot_installations.deleteMany();
    });

    suite('member org', () => {
      let response: LightMyRequestResponse;

      suiteSetup(async () => {
        const tasks = await app.prisma.tasks.createManyAndReturn({
          data: [
            {
              title: 'task-0',
              token: '0',
              org_id: org.id,
            },
            {
              title: 'task-1',
              token: '1',
              org_id: secondOrg.id,
            },
            {
              title: 'task-2',
              token: '2',
              org_id: org.id,
              state: 'submitted',
            },
            {
              title: 'task-3',
              token: '3',
              org_id: org.id,
              state: 'completed',
            },
            {
              title: 'task-4',
              token: '4',
              org_id: org.id,
              state: 'skipped',
            },
            {
              title: 'task-5',
              token: '5',
              org_id: org.id,
              state: 'failed',
            },
          ],
        });

        await app.prisma.task_items.createMany({
          data: tasks
            .filter((task) => task.org_id === org.id)
            .map((task) => ({
              task_id: task.id,
              bot_id: bot.id,
              type: 'bot',
            })),
        });
      });

      suiteTeardown(async () => {
        await app.prisma.tasks.deleteMany();
      });

      setup(async () => {
        response = await graphql(
          app,
          `
            query botInstallations($org_id: Int!) {
              botInstallations(org_id: $org_id) {
                id
                created_at
                org {
                  name
                  provider_name
                }
                bot {
                  name
                  org {
                    name
                  }
                }
                tasks_count {
                  state
                  count
                }
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

      test('should return installed bots only', async () => {
        const {
          data: { botInstallations },
        } = response.json();

        assert.lengthOf(botInstallations, 4);

        assert.isNumber(botInstallations[0].id);
        assert.equal(botInstallations[0].org.name, org.name);
        assert.equal(botInstallations[0].org.provider_name, org.name);
        assert.equal(botInstallations[0].bot.name, bot.name);
        assert.equal(botInstallations[0].bot.org.name, org.name);
        assert.isString(botInstallations[0].created_at);
        assert.lengthOf(botInstallations[0].tasks_count, 5);
        assert.deepInclude(botInstallations[0].tasks_count, {
          state: 'started',
          count: 1,
        });
        assert.deepInclude(botInstallations[0].tasks_count, {
          state: 'submitted',
          count: 1,
        });
        assert.deepInclude(botInstallations[0].tasks_count, {
          state: 'completed',
          count: 1,
        });
        assert.deepInclude(botInstallations[0].tasks_count, {
          state: 'skipped',
          count: 1,
        });
        assert.deepInclude(botInstallations[0].tasks_count, {
          state: 'failed',
          count: 1,
        });

        assert.isNumber(botInstallations[1].id);
        assert.equal(botInstallations[1].org.name, org.name);
        assert.equal(botInstallations[1].org.provider_name, org.name);
        assert.equal(botInstallations[1].bot.name, secondOrgBot.name);
        assert.equal(botInstallations[1].bot.org.name, secondOrg.name);
        assert.isString(botInstallations[1].created_at);
        assert.lengthOf(botInstallations[1].tasks_count, 0);

        assert.isNumber(botInstallations[2].id);
        assert.equal(botInstallations[2].org.name, org.name);
        assert.equal(botInstallations[2].org.provider_name, org.name);
        assert.equal(botInstallations[2].bot.name, nonMemberOrgBot.name);
        assert.equal(botInstallations[2].bot.org.name, nonMemberOrg.name);
        assert.isString(botInstallations[2].created_at);
        assert.lengthOf(botInstallations[2].tasks_count, 0);

        assert.isNumber(botInstallations[3].id);
        assert.equal(botInstallations[3].org.name, org.name);
        assert.equal(botInstallations[3].org.provider_name, org.name);
        assert.equal(botInstallations[3].bot.name, nonPublishedBot.name);
        assert.equal(botInstallations[3].bot.org.name, org.name);
        assert.isString(botInstallations[3].created_at);
        assert.lengthOf(botInstallations[3].tasks_count, 0);
      });
    });

    test('for non-member org should fail', async () => {
      const response = await graphql(
        app,
        `
          query botInstallations($org_id: Int!) {
            botInstallations(org_id: $org_id) {
              id
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

    test('should return only manual bots with filter.type = manual', async () => {
      const response = await graphql(
        app,
        `
          query botInstallations($org_id: Int!) {
            botInstallations(org_id: $org_id, filter: { type: manual }) {
              id
              bot {
                name
              }
            }
          }
        `,
        {
          org_id: org.id,
        },
      );

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        errors,
        data: { botInstallations },
      } = response.json();

      assert.isUndefined(errors);

      assert.lengthOf(botInstallations, 2);

      assert.isNumber(botInstallations[0].id);
      assert.equal(botInstallations[0].bot.name, secondOrgBot.name);

      assert.isNumber(botInstallations[1].id);
      assert.equal(botInstallations[1].bot.name, nonMemberOrgBot.name);
    });

    test('should restrict PublicBot fields', async () => {
      const response = await graphql(
        app,
        `
          query botInstallations($org_id: Int!) {
            botInstallations(org_id: $org_id) {
              id
              bot {
                webhook_url
              }
            }
          }
        `,
        {
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

  suite('mutation botInstall', () => {
    setup(() => {
      publishStub = sandbox
        .stub(app.events.scheduleBotInstallation, 'publish')
        .resolves();
    });

    teardown(async () => {
      sandbox.restore();
      await app.prisma.bot_installations.deleteMany();

      await app.prisma.bots.update({
        where: {
          id: bot.id,
        },
        data: {
          type: 'manual',
        },
      });
    });

    suite('with valid input should succeed', () => {
      let response: LightMyRequestResponse;

      setup(async () => {
        response = await botInstall(app, org.id, {
          bot_id: bot.id,
        });
      });

      test('should be successful', () => {
        assert.equal(response.statusCode, 200);
      });

      test('should return botInstallation', async () => {
        assert.equal(
          response.headers['content-type'],
          'application/json; charset=utf-8',
        );

        const {
          errors,
          data: { botInstall: botInstallation },
        } = response.json();

        assert.isUndefined(errors);

        assert.isNumber(botInstallation.id);
        assert.isString(botInstallation.created_at);
        assert.equal(botInstallation.bot.name, bot.name);
        assert.equal(botInstallation.bot.org.name, org.name);
      });

      test('should create botInstallation', async () => {
        const count = await app.prisma.bot_installations.count();

        assert.equal(count, 1);
      });

      test('should not publish scheduleBotInstallation event', async () => {
        assert.equal(publishStub.callCount, 0);
      });
    });

    test('non-published bot on org should succeed', async () => {
      const response = await botInstall(app, org.id, {
        bot_id: nonPublishedBot.id,
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        errors,
        data: { botInstall: botInstallation },
      } = response.json();

      assert.isUndefined(errors);

      assert.isNumber(botInstallation.id);
      assert.isString(botInstallation.created_at);
      assert.equal(botInstallation.bot.name, nonPublishedBot.name);
      assert.equal(botInstallation.bot.org.name, org.name);

      const count = await app.prisma.bot_installations.count();

      assert.equal(count, 1);
    });

    test('non-member org should fail', async () => {
      const response = await botInstall(app, nonMemberOrg.id, {
        bot_id: bot.id,
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

      const count = await app.prisma.bot_installations.count();

      assert.equal(count, 0);
    });

    test('non-published bot on different org should fail', async () => {
      const response = await botInstall(app, secondOrg.id, {
        bot_id: nonPublishedBot.id,
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
          code: 'invalid',
          message: 'Bot not found',
          path: ['bot_id'],
        },
      ]);

      const count = await app.prisma.bot_installations.count();

      assert.equal(count, 0);
    });

    test('scheduled bot should publish scheduleBotInstallation event', async () => {
      await app.prisma.bots.update({
        where: {
          id: bot.id,
        },
        data: {
          type: 'scheduled',
        },
      });

      const timestamp = Date.now();
      sandbox.stub(Date, 'now').returns(timestamp);

      const response = await botInstall(app, org.id, {
        bot_id: bot.id,
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      assert.equal(publishStub.callCount, 1);

      assert.deepEqual(publishStub.args, [
        [
          `${bot.id}-${org.id}-${timestamp}`,
          { botId: bot.id, orgId: org.id, timestamp },
        ],
      ]);
    });
  });

  suite('mutation botUninstall', () => {
    setup(async () => {
      await app.prisma.bot_installations.create({
        data: {
          bot_id: bot.id,
          org_id: org.id,
        },
      });
    });

    teardown(async () => {
      await app.prisma.bot_installations.deleteMany();
    });

    test('with installed bot should succeed', async () => {
      const response = await botUninstall(app, org.id, bot.id);

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors, data } = response.json();

      assert.isUndefined(errors);

      assert.isTrue(data.botUninstall);

      const count = await app.prisma.bot_installations.count();

      assert.equal(count, 0);
    });

    test('with non-installed bot should succeed but return false', async () => {
      const response = await botUninstall(app, org.id, nonMemberOrgBot.id);

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors, data } = response.json();

      assert.isUndefined(errors);

      assert.isFalse(data.botUninstall);

      const count = await app.prisma.bot_installations.count();

      assert.equal(count, 1);
    });

    test('non-member org should fail', async () => {
      const response = await botUninstall(app, nonMemberOrg.id, bot.id);

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.equal(errors[0].message, 'Not Found');
      assert.equal(errors[0].extensions.code, 'NOT_FOUND');

      const count = await app.prisma.bot_installations.count();

      assert.equal(count, 1);
    });
  });
});

const botInstall = (app: FastifyInstance, orgId: number, input: any) =>
  graphql(
    app,
    `
      mutation botInstall($org_id: Int!, $input: BotInstallInput!) {
        botInstall(org_id: $org_id, input: $input) {
          id
          created_at
          bot {
            name
            org {
              name
            }
          }
        }
      }
    `,
    {
      org_id: orgId,
      input,
    },
  );

const botUninstall = (app: FastifyInstance, orgId: number, botId: number) =>
  graphql(
    app,
    `
      mutation botUninstall($org_id: Int!, $bot_id: Int!) {
        botUninstall(org_id: $org_id, bot_id: $bot_id)
      }
    `,
    {
      org_id: orgId,
      bot_id: botId,
    },
  );
