import { FastifyInstance } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';

import { bots, orgs, repos, tasks } from '@automa/prisma';

import { seedBots, seedOrgs, seedRepos, server } from '../utils';

import scheduleTask from '../../src/events/jobs/scheduleTask';

suite('events/scheduleTask', () => {
  let app: FastifyInstance, sandbox: SinonSandbox, publishStub: SinonStub;
  let org: orgs, bot: bots, repo: repos, tasks: tasks[];

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();

    [org] = await seedOrgs(app, 1);
    [bot] = await seedBots(app, [org]);
    [repo] = await seedRepos(app, [org]);
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.close();
  });

  setup(async () => {
    publishStub = sandbox
      .stub(app.events.sendTaskWebhook, 'publish')
      .resolves();

    await scheduleTask.handler?.(app, {
      botId: bot.id,
      orgId: org.id,
      repoId: repo.id,
    });

    tasks = await app.prisma.tasks.findMany();
  });

  teardown(async () => {
    await app.prisma.tasks.deleteMany();
    sandbox.restore();
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
      repo_id: repo.id,
    });

    assert.deepOwnInclude(taskItems[1], {
      type: 'bot',
      data: {},
      bot_id: bot.id,
    });
  });

  test('should publish sendTaskWebhook event for the task', async () => {
    assert.isTrue(publishStub.calledOnce);
    assert.deepEqual(publishStub.firstCall.args, [
      tasks[0].id,
      { taskId: tasks[0].id },
    ]);
  });
});
