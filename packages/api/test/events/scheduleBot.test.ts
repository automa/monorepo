import { FastifyInstance } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';

import { bots, orgs } from '@automa/prisma';

import { seedBots, seedOrgs, server } from '../utils';

import scheduleBot from '../../src/events/jobs/scheduleBot';

suite('events/scheduleBot', () => {
  let app: FastifyInstance, sandbox: SinonSandbox, publishStub: SinonStub;
  let orgs: orgs[], bot: bots, timestamp: number;

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();

    orgs = await seedOrgs(app, 13);
    [bot] = await seedBots(app, [orgs[0]]);
    timestamp = Date.now();

    // Mark some orgs as having an installation
    await app.prisma.orgs.updateMany({
      where: {
        id: {
          in: orgs
            .filter((org, index) => !index || index % 5 !== 0)
            .map((org) => org.id),
        },
      },
      data: {
        has_installation: true,
      },
    });

    await app.prisma.bot_installations.createMany({
      data: orgs.map((org) => ({
        bot_id: bot.id,
        org_id: org.id,
      })),
    });
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.close();
  });

  setup(async () => {
    publishStub = sandbox
      .stub(app.events.scheduleBotInstallation, 'bulkPublish')
      .resolves();
  });

  teardown(async () => {
    sandbox.restore();
  });

  test('should publish scheduleBotInstallation events for all bot installations', async () => {
    await scheduleBot.handler?.(app, { botId: bot.id, timestamp });

    assert.equal(publishStub.callCount, 2);

    assert.deepEqual(publishStub.args, [
      [
        [
          {
            id: `${bot.id}-${orgs[0].id}-${timestamp}`,
            input: { botId: bot.id, orgId: orgs[0].id, timestamp },
          },
          {
            id: `${bot.id}-${orgs[1].id}-${timestamp}`,
            input: { botId: bot.id, orgId: orgs[1].id, timestamp },
          },
          {
            id: `${bot.id}-${orgs[2].id}-${timestamp}`,
            input: { botId: bot.id, orgId: orgs[2].id, timestamp },
          },
          {
            id: `${bot.id}-${orgs[3].id}-${timestamp}`,
            input: { botId: bot.id, orgId: orgs[3].id, timestamp },
          },
          {
            id: `${bot.id}-${orgs[4].id}-${timestamp}`,
            input: { botId: bot.id, orgId: orgs[4].id, timestamp },
          },
          {
            id: `${bot.id}-${orgs[6].id}-${timestamp}`,
            input: { botId: bot.id, orgId: orgs[6].id, timestamp },
          },
          {
            id: `${bot.id}-${orgs[7].id}-${timestamp}`,
            input: { botId: bot.id, orgId: orgs[7].id, timestamp },
          },
          {
            id: `${bot.id}-${orgs[8].id}-${timestamp}`,
            input: { botId: bot.id, orgId: orgs[8].id, timestamp },
          },
          {
            id: `${bot.id}-${orgs[9].id}-${timestamp}`,
            input: { botId: bot.id, orgId: orgs[9].id, timestamp },
          },
          {
            id: `${bot.id}-${orgs[11].id}-${timestamp}`,
            input: { botId: bot.id, orgId: orgs[11].id, timestamp },
          },
        ],
      ],
      [
        [
          {
            id: `${bot.id}-${orgs[12].id}-${timestamp}`,
            input: { botId: bot.id, orgId: orgs[12].id, timestamp },
          },
        ],
      ],
    ]);
  });
});
