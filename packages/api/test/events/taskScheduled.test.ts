import { FastifyInstance } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';

import { bots, orgs, repos, tasks } from '@automa/prisma';

import { seedBots, seedOrgs, seedRepos, server } from '../utils';

import taskScheduled from '../../src/events/queues/taskScheduled';

suite('events/taskScheduled', () => {
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
    publishStub = sandbox.stub(app.events.taskCreated, 'publish').resolves();

    await taskScheduled.handler?.(app, {
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
      completed_at: null,
    });

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
      data: {
        repoId: repo.id,
        repoName: 'repo-0',
        repoOrgId: repo.org_id,
        repoOrgName: 'org-0',
        repoOrgProviderType: 'github',
        repoOrgProviderId: '0',
        repoProviderId: '0',
      },
    });

    assert.deepOwnInclude(taskItems[1], {
      type: 'bot',
      data: {
        botId: bot.id,
        botName: 'bot-0',
        botImageUrl: 'https://example.com/image/0.png',
        botOrgId: bot.org_id,
        botOrgName: 'org-0',
      },
    });
  });

  test('should publish taskCreated event for the task', async () => {
    assert.isTrue(publishStub.calledOnce);
    assert.deepEqual(publishStub.firstCall.args, [{ id: tasks[0].id }]);
  });
});
