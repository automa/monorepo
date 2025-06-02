import { FastifyInstance } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';

import { bot, bots, orgs } from '@automa/prisma';

import { seedBots, seedOrgs, server } from '../utils';

import scheduleBots from '../../src/events/jobs/scheduleBots';

suite('events/scheduleBots', () => {
  let app: FastifyInstance, sandbox: SinonSandbox;
  let publishStub: SinonStub, timeStub: SinonStub;
  let org: orgs, bots: bots[], timestamp: number;

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();

    [org] = await seedOrgs(app, 2);
    bots = await seedBots(app, Array(6).fill(org), Array(7).fill(org));

    // Mark some bots as scheduled
    await app.prisma.bots.updateMany({
      where: {
        id: {
          in: bots
            .filter((bot, index) => !index || index % 5 !== 0)
            .map((bot) => bot.id),
        },
      },
      data: {
        type: bot.scheduled,
      },
    });
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.close();
  });

  setup(async () => {
    timestamp = Date.now();
    sandbox.stub(Date, 'now').returns(timestamp);

    publishStub = sandbox
      .stub(app.events.scheduleBot, 'bulkPublish')
      .resolves();
  });

  teardown(async () => {
    sandbox.restore();
  });

  test('publishes scheduleBot event for each scheduled bot', async () => {
    await scheduleBots.handler?.(app, {});

    assert.equal(publishStub.callCount, 2);

    assert.deepEqual(publishStub.args, [
      [
        [
          {
            id: `${bots[0].id}-${timestamp}`,
            input: { botId: bots[0].id, timestamp },
          },
          {
            id: `${bots[1].id}-${timestamp}`,
            input: { botId: bots[1].id, timestamp },
          },
          {
            id: `${bots[2].id}-${timestamp}`,
            input: { botId: bots[2].id, timestamp },
          },
          {
            id: `${bots[3].id}-${timestamp}`,
            input: { botId: bots[3].id, timestamp },
          },
          {
            id: `${bots[4].id}-${timestamp}`,
            input: { botId: bots[4].id, timestamp },
          },
          {
            id: `${bots[6].id}-${timestamp}`,
            input: { botId: bots[6].id, timestamp },
          },
          {
            id: `${bots[7].id}-${timestamp}`,
            input: { botId: bots[7].id, timestamp },
          },
          {
            id: `${bots[8].id}-${timestamp}`,
            input: { botId: bots[8].id, timestamp },
          },
          {
            id: `${bots[9].id}-${timestamp}`,
            input: { botId: bots[9].id, timestamp },
          },
          {
            id: `${bots[11].id}-${timestamp}`,
            input: { botId: bots[11].id, timestamp },
          },
        ],
      ],
      [
        [
          {
            id: `${bots[12].id}-${timestamp}`,
            input: { botId: bots[12].id, timestamp },
          },
        ],
      ],
    ]);
  });
});
