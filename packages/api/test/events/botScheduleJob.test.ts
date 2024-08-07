import { FastifyInstance } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';

import { bot, bots, orgs } from '@automa/prisma';

import { seedBots, seedOrgs, server } from '../utils';

import botScheduleJob from '../../src/events/queues/botScheduleJob';

suite('events/botScheduleJob', () => {
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
    publishStub = sandbox.stub(app.events.botScheduled, 'publish').resolves();
  });

  teardown(async () => {
    sandbox.restore();
  });

  test('publishes botScheduled event for each scheduled bot', async () => {
    await botScheduleJob.handler?.(app, {});

    assert.equal(publishStub.callCount, 11);

    assert.deepEqual(publishStub.args, [
      [{ botId: bots[0].id }],
      [{ botId: bots[1].id }],
      [{ botId: bots[2].id }],
      [{ botId: bots[3].id }],
      [{ botId: bots[4].id }],
      [{ botId: bots[6].id }],
      [{ botId: bots[7].id }],
      [{ botId: bots[8].id }],
      [{ botId: bots[9].id }],
      [{ botId: bots[11].id }],
      [{ botId: bots[12].id }],
    ]);
  });
});
