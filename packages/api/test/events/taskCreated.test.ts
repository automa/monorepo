import { FastifyInstance } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import axios from 'axios';

import { bots, orgs, repos, task_item, tasks, users } from '@automa/prisma';

import { seedBots, seedOrgs, seedRepos, seedUsers, server } from '../utils';

import taskCreated from '../../src/events/queues/taskCreated';

suite('events/taskCreated', () => {
  let app: FastifyInstance, sandbox: SinonSandbox, user: users;
  let org: orgs, nonMemberOrg: orgs;
  let repo: repos, bot: bots;

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();

    [user] = await seedUsers(app, 1);
    [org, nonMemberOrg] = await seedOrgs(app, 2);
    [repo] = await seedRepos(app, [org], []);
    [bot] = await seedBots(app, [nonMemberOrg], []);

    await app.prisma.bot_installations.createMany({
      data: [
        {
          bot_id: bot.id,
          org_id: org.id,
        },
      ],
    });
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.prisma.users.deleteMany();
    await app.close();
  });

  teardown(async () => {
    await app.prisma.tasks.deleteMany({});
    sandbox.restore();
  });

  suite('with bot and repo', () => {
    let task: tasks, postStub: SinonStub;

    setup(async () => {
      postStub = sandbox.stub(axios, 'post').resolves({});

      task = await app.prisma.tasks.create({
        data: {
          org_id: org.id,
          title: 'Write test for handling "example" event',
          task_items: {
            create: [
              {
                actor_user_id: user.id,
                type: task_item.message,
                data: {
                  content: 'Write test for handling "example" event',
                },
              },
              {
                type: 'repo',
                data: {
                  repoId: repo.id,
                  repoName: repo.name,
                  repoOrgId: org.id,
                  repoOrgName: org.name,
                  repoOrgProviderType: org.provider_type,
                  repoOrgProviderId: org.provider_id,
                  repoProviderId: repo.provider_id,
                },
              },
              {
                type: 'bot',
                data: {
                  botId: bot.id,
                  botName: bot.name,
                  botOrgId: nonMemberOrg.id,
                  botOrgName: nonMemberOrg.name,
                },
              },
            ],
          },
        },
      });

      await taskCreated.handler?.(app, {
        id: task.id,
      });
    });

    test('should call bot webhook_url', () => {
      assert.equal(postStub.callCount, 1);
      assert.equal(postStub.firstCall.args[0], 'https://example.com/webhook/0');
      assert.deepEqual(postStub.firstCall.args[1], {
        task: {
          id: task.id,
          title: task.title,
        },
      });
      assert.deepEqual(postStub.firstCall.args[2], {
        headers: {},
      });
    });
  });

  suite('without bot and repo', () => {
    let task: tasks, postStub: SinonStub;

    setup(async () => {
      postStub = sandbox.stub(axios, 'post').resolves({});

      task = await app.prisma.tasks.create({
        data: {
          org_id: org.id,
          title: 'Write test for handling "example" event',
          task_items: {
            create: [
              {
                actor_user_id: user.id,
                type: task_item.message,
                data: {
                  content: 'Write test for handling "example" event',
                },
              },
            ],
          },
        },
      });

      await taskCreated.handler?.(app, {
        id: task.id,
      });
    });

    test('should assign repo to task', async () => {
      const taskItems = await app.prisma.task_items.findMany({
        where: {
          task_id: task.id,
          type: 'repo',
        },
      });

      assert.lengthOf(taskItems, 1);

      assert.deepEqual(taskItems[0].data, {
        repoId: repo.id,
        repoName: repo.name,
        repoOrgId: org.id,
        repoOrgName: org.name,
        repoOrgProviderType: org.provider_type,
        repoOrgProviderId: org.provider_id,
        repoProviderId: repo.provider_id,
      });
    });

    test('should assign bot to task', async () => {
      const taskItems = await app.prisma.task_items.findMany({
        where: {
          task_id: task.id,
          type: 'bot',
        },
      });

      assert.lengthOf(taskItems, 1);

      assert.deepEqual(taskItems[0].data, {
        botId: bot.id,
        botName: bot.name,
        botOrgId: nonMemberOrg.id,
        botOrgName: nonMemberOrg.name,
      });
    });

    test('should call bot webhook_url', () => {
      assert.equal(postStub.callCount, 1);
      assert.equal(postStub.firstCall.args[0], 'https://example.com/webhook/0');
      assert.deepEqual(postStub.firstCall.args[1], {
        task: {
          id: task.id,
          title: task.title,
        },
      });
      assert.deepEqual(postStub.firstCall.args[2], {
        headers: {},
      });
    });
  });
});
