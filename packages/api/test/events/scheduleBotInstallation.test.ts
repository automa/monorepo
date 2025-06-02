import { FastifyInstance } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';

import { bots, orgs, repos } from '@automa/prisma';

import { seedBots, seedOrgs, seedRepos, server } from '../utils';

import scheduleBotInstallation from '../../src/events/jobs/scheduleBotInstallation';

suite('events/scheduleBotInstallation', () => {
  let app: FastifyInstance, sandbox: SinonSandbox, publishStub: SinonStub;
  let org: orgs, bot: bots, repos: repos[], timestamp: number;

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();

    [org] = await seedOrgs(app, 1);
    [bot] = await seedBots(app, [org]);
    repos = await seedRepos(app, Array(13).fill(org), [org, org]);
    timestamp = Date.now();

    // Mark some repos as archived
    await app.prisma.repos.updateMany({
      where: {
        id: {
          in: repos
            .filter((repo, index) => index && index % 5 === 0)
            .map((repo) => repo.id),
        },
      },
      data: {
        is_archived: true,
      },
    });
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.close();
  });

  setup(async () => {
    publishStub = sandbox
      .stub(app.events.scheduleTask, 'bulkPublish')
      .resolves();
  });

  teardown(async () => {
    sandbox.restore();
  });

  test('should publish scheduleTask events for all repos with an installation', async () => {
    await scheduleBotInstallation.handler?.(app, {
      botId: bot.id,
      orgId: org.id,
      timestamp,
    });

    assert.equal(publishStub.callCount, 2);

    assert.deepEqual(publishStub.args, [
      [
        [
          {
            id: `${bot.id}-${org.id}-${repos[0].id}-${timestamp}`,
            input: { botId: bot.id, orgId: org.id, repoId: repos[0].id },
          },
          {
            id: `${bot.id}-${org.id}-${repos[1].id}-${timestamp}`,
            input: { botId: bot.id, orgId: org.id, repoId: repos[1].id },
          },
          {
            id: `${bot.id}-${org.id}-${repos[2].id}-${timestamp}`,
            input: { botId: bot.id, orgId: org.id, repoId: repos[2].id },
          },
          {
            id: `${bot.id}-${org.id}-${repos[3].id}-${timestamp}`,
            input: { botId: bot.id, orgId: org.id, repoId: repos[3].id },
          },
          {
            id: `${bot.id}-${org.id}-${repos[4].id}-${timestamp}`,
            input: { botId: bot.id, orgId: org.id, repoId: repos[4].id },
          },
          {
            id: `${bot.id}-${org.id}-${repos[6].id}-${timestamp}`,
            input: { botId: bot.id, orgId: org.id, repoId: repos[6].id },
          },
          {
            id: `${bot.id}-${org.id}-${repos[7].id}-${timestamp}`,
            input: { botId: bot.id, orgId: org.id, repoId: repos[7].id },
          },
          {
            id: `${bot.id}-${org.id}-${repos[8].id}-${timestamp}`,
            input: { botId: bot.id, orgId: org.id, repoId: repos[8].id },
          },
          {
            id: `${bot.id}-${org.id}-${repos[9].id}-${timestamp}`,
            input: { botId: bot.id, orgId: org.id, repoId: repos[9].id },
          },
          {
            id: `${bot.id}-${org.id}-${repos[11].id}-${timestamp}`,
            input: { botId: bot.id, orgId: org.id, repoId: repos[11].id },
          },
        ],
      ],
      [
        [
          {
            id: `${bot.id}-${org.id}-${repos[12].id}-${timestamp}`,
            input: { botId: bot.id, orgId: org.id, repoId: repos[12].id },
          },
        ],
      ],
    ]);
  });
});
