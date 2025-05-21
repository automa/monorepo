import { FastifyInstance } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';

import { bot, bots, orgs } from '@automa/prisma';

import { seedBots, seedOrgs, server } from '../utils';

import scheduleBots from '../../src/events/jobs/scheduleBots';

suite('events/scheduleBots', () => {
  let app: FastifyInstance, sandbox: SinonSandbox, publishStub: SinonStub;
  let org: orgs, bots: bots[];

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
          { id: bots[0].id, input: { botId: bots[0].id } },
          { id: bots[1].id, input: { botId: bots[1].id } },
          { id: bots[2].id, input: { botId: bots[2].id } },
          { id: bots[3].id, input: { botId: bots[3].id } },
          { id: bots[4].id, input: { botId: bots[4].id } },
          { id: bots[6].id, input: { botId: bots[6].id } },
          { id: bots[7].id, input: { botId: bots[7].id } },
          { id: bots[8].id, input: { botId: bots[8].id } },
          { id: bots[9].id, input: { botId: bots[9].id } },
          { id: bots[11].id, input: { botId: bots[11].id } },
        ],
      ],
      [[{ id: bots[12].id, input: { botId: bots[12].id } }]],
    ]);
  });
});
