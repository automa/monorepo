import { FastifyInstance } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';

import { bots, orgs, repos } from '@automa/prisma';

import { seedBots, seedOrgs, seedRepos, server } from '../utils';

import botInstallationScheduled from '../../src/events/jobs/botInstallationScheduled';

suite('events/botInstallationScheduled', () => {
  let app: FastifyInstance, sandbox: SinonSandbox, publishStub: SinonStub;
  let org: orgs, bot: bots, repos: repos[];

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();

    [org] = await seedOrgs(app, 1);
    [bot] = await seedBots(app, [org]);
    repos = await seedRepos(app, Array(13).fill(org), [org, org]);

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
    publishStub = sandbox.stub(app.events.taskScheduled, 'publish').resolves();
  });

  teardown(async () => {
    sandbox.restore();
  });

  test('should publish taskScheduled events for all repos with an installation', async () => {
    await botInstallationScheduled.handler?.(app, {
      botId: bot.id,
      orgId: org.id,
    });

    assert.equal(publishStub.callCount, 11);

    assert.deepEqual(publishStub.args, [
      [
        `${bot.id}-${org.id}-${repos[0].id}`,
        { botId: bot.id, orgId: org.id, repoId: repos[0].id },
      ],
      [
        `${bot.id}-${org.id}-${repos[1].id}`,
        { botId: bot.id, orgId: org.id, repoId: repos[1].id },
      ],
      [
        `${bot.id}-${org.id}-${repos[2].id}`,
        { botId: bot.id, orgId: org.id, repoId: repos[2].id },
      ],
      [
        `${bot.id}-${org.id}-${repos[3].id}`,
        { botId: bot.id, orgId: org.id, repoId: repos[3].id },
      ],
      [
        `${bot.id}-${org.id}-${repos[4].id}`,
        { botId: bot.id, orgId: org.id, repoId: repos[4].id },
      ],
      [
        `${bot.id}-${org.id}-${repos[6].id}`,
        { botId: bot.id, orgId: org.id, repoId: repos[6].id },
      ],
      [
        `${bot.id}-${org.id}-${repos[7].id}`,
        { botId: bot.id, orgId: org.id, repoId: repos[7].id },
      ],
      [
        `${bot.id}-${org.id}-${repos[8].id}`,
        { botId: bot.id, orgId: org.id, repoId: repos[8].id },
      ],
      [
        `${bot.id}-${org.id}-${repos[9].id}`,
        { botId: bot.id, orgId: org.id, repoId: repos[9].id },
      ],
      [
        `${bot.id}-${org.id}-${repos[11].id}`,
        { botId: bot.id, orgId: org.id, repoId: repos[11].id },
      ],
      [
        `${bot.id}-${org.id}-${repos[12].id}`,
        { botId: bot.id, orgId: org.id, repoId: repos[12].id },
      ],
    ]);
  });
});
