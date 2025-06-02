import { FastifyInstance } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';

import { bots, orgs, repos, tasks } from '@automa/prisma';

import { seedBots, seedOrgs, seedRepos, server } from '../utils';

import scheduleTask from '../../src/events/jobs/scheduleTask';

suite('events/scheduleTask', () => {
  let app: FastifyInstance, sandbox: SinonSandbox, publishStub: SinonStub;
  let org: orgs, bots: bots[], repos: repos[], tasks: tasks[];

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();

    [org] = await seedOrgs(app, 1);
    bots = await seedBots(app, [org, org]);
    repos = await seedRepos(app, [org, org]);
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.close();
  });

  setup(async () => {
    publishStub = sandbox
      .stub(app.events.sendTaskWebhook, 'publish')
      .resolves();
  });

  teardown(async () => {
    sandbox.restore();
  });

  suite('with no existing tasks', () => {
    setup(async () => {
      await scheduleTask.handler?.(app, {
        botId: bots[0].id,
        orgId: org.id,
        repoId: repos[0].id,
      });

      tasks = await app.prisma.tasks.findMany();
    });

    teardown(async () => {
      await app.prisma.tasks.deleteMany();
    });

    test('should create task', async () => {
      assert.equal(tasks.length, 1);
      assert.deepOwnInclude(tasks[0], {
        org_id: org.id,
        title: 'Running org-0/bot-0 on repo-0',
        is_scheduled: true,
        state: 'started',
      });
      assert.isDefined(tasks[0].token);

      const taskItems = await app.prisma.task_items.findMany({
        where: {
          task_id: tasks[0].id,
        },
        orderBy: {
          id: 'asc',
        },
      });

      assert.equal(taskItems.length, 2);

      assert.deepOwnInclude(taskItems[0], {
        type: 'repo',
        data: {},
        repo_id: repos[0].id,
      });

      assert.deepOwnInclude(taskItems[1], {
        type: 'bot',
        data: {},
        bot_id: bots[0].id,
      });
    });

    test('should publish sendTaskWebhook event for the task', async () => {
      assert.isTrue(publishStub.calledOnce);
      assert.deepEqual(publishStub.firstCall.args, [
        tasks[0].id,
        { taskId: tasks[0].id },
        {
          attempts: 10,
        },
      ]);
    });
  });

  suite('with unrelated task', () => {
    setup(async () => {
      await app.prisma.tasks.create({
        data: {
          org_id: org.id,
          title: 'Submitted Task',
          is_scheduled: true,
          token: 'abcdef',
          state: 'submitted',
          task_items: {
            create: [
              {
                type: 'repo',
                repo_id: repos[1].id,
              },
              {
                type: 'bot',
                bot_id: bots[0].id,
              },
            ],
          },
        },
      });

      await scheduleTask.handler?.(app, {
        botId: bots[0].id,
        orgId: org.id,
        repoId: repos[0].id,
      });

      tasks = await app.prisma.tasks.findMany({ orderBy: { id: 'desc' } });
    });

    teardown(async () => {
      await app.prisma.tasks.deleteMany();
    });

    test('should create task', async () => {
      assert.equal(tasks.length, 2);
      assert.deepOwnInclude(tasks[0], {
        org_id: org.id,
        title: 'Running org-0/bot-0 on repo-0',
        is_scheduled: true,
        state: 'started',
      });
      assert.isDefined(tasks[0].token);

      const taskItems = await app.prisma.task_items.findMany({
        where: {
          task_id: tasks[0].id,
        },
        orderBy: {
          id: 'asc',
        },
      });

      assert.equal(taskItems.length, 2);

      assert.deepOwnInclude(taskItems[0], {
        type: 'repo',
        data: {},
        repo_id: repos[0].id,
      });

      assert.deepOwnInclude(taskItems[1], {
        type: 'bot',
        data: {},
        bot_id: bots[0].id,
      });
    });

    test('should publish sendTaskWebhook event for the task', async () => {
      assert.isTrue(publishStub.calledOnce);
      assert.deepEqual(publishStub.firstCall.args, [
        tasks[0].id,
        { taskId: tasks[0].id },
        {
          attempts: 10,
        },
      ]);
    });
  });

  suite('with unrelated bot', () => {
    setup(async () => {
      await app.prisma.tasks.create({
        data: {
          org_id: org.id,
          title: 'Submitted Task',
          is_scheduled: true,
          token: 'abcdef',
          state: 'submitted',
          task_items: {
            create: [
              {
                type: 'repo',
                repo_id: repos[0].id,
              },
              {
                type: 'bot',
                bot_id: bots[1].id,
              },
            ],
          },
        },
      });

      await scheduleTask.handler?.(app, {
        botId: bots[0].id,
        orgId: org.id,
        repoId: repos[0].id,
      });

      tasks = await app.prisma.tasks.findMany({ orderBy: { id: 'desc' } });
    });

    teardown(async () => {
      await app.prisma.tasks.deleteMany();
    });

    test('should create task', async () => {
      assert.equal(tasks.length, 2);
      assert.deepOwnInclude(tasks[0], {
        org_id: org.id,
        title: 'Running org-0/bot-0 on repo-0',
        is_scheduled: true,
        state: 'started',
      });
      assert.isDefined(tasks[0].token);

      const taskItems = await app.prisma.task_items.findMany({
        where: {
          task_id: tasks[0].id,
        },
        orderBy: {
          id: 'asc',
        },
      });

      assert.equal(taskItems.length, 2);

      assert.deepOwnInclude(taskItems[0], {
        type: 'repo',
        data: {},
        repo_id: repos[0].id,
      });

      assert.deepOwnInclude(taskItems[1], {
        type: 'bot',
        data: {},
        bot_id: bots[0].id,
      });
    });

    test('should publish sendTaskWebhook event for the task', async () => {
      assert.isTrue(publishStub.calledOnce);
      assert.deepEqual(publishStub.firstCall.args, [
        tasks[0].id,
        { taskId: tasks[0].id },
        {
          attempts: 10,
        },
      ]);
    });
  });

  suite('with existing task in submitted state', () => {
    setup(async () => {
      await app.prisma.tasks.create({
        data: {
          org_id: org.id,
          title: 'Submitted Task',
          is_scheduled: true,
          token: 'abcdef',
          state: 'submitted',
          task_items: {
            create: [
              {
                type: 'repo',
                repo_id: repos[0].id,
              },
              {
                type: 'bot',
                bot_id: bots[0].id,
              },
            ],
          },
        },
      });

      await scheduleTask.handler?.(app, {
        botId: bots[0].id,
        orgId: org.id,
        repoId: repos[0].id,
      });

      tasks = await app.prisma.tasks.findMany();
    });

    teardown(async () => {
      await app.prisma.tasks.deleteMany();
    });

    test('should not create a new task', async () => {
      assert.equal(tasks.length, 1);
    });

    test('should not publish sendTaskWebhook event', async () => {
      assert.isFalse(publishStub.called);
    });
  });

  suite('with existing task in started state', () => {
    setup(async () => {
      await app.prisma.tasks.create({
        data: {
          org_id: org.id,
          title: 'Started Task',
          is_scheduled: true,
          token: 'abcdef',
          state: 'started',
          task_items: {
            create: [
              {
                type: 'repo',
                repo_id: repos[0].id,
              },
              {
                type: 'bot',
                bot_id: bots[0].id,
              },
            ],
          },
        },
      });

      await scheduleTask.handler?.(app, {
        botId: bots[0].id,
        orgId: org.id,
        repoId: repos[0].id,
      });

      tasks = await app.prisma.tasks.findMany();
    });

    teardown(async () => {
      await app.prisma.tasks.deleteMany();
    });

    test('should not create a new task', async () => {
      assert.equal(tasks.length, 1);
    });

    test('should not publish sendTaskWebhook event', async () => {
      assert.isFalse(publishStub.called);
    });
  });
});
