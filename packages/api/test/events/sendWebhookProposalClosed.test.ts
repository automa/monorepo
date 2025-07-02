import { FastifyInstance } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import axios from 'axios';

import {
  bots,
  orgs,
  repos,
  task_item,
  task_items,
  tasks,
} from '@automa/prisma';

import {
  generateWebhookSignature,
  regexTimestamp,
  seedBots,
  seedOrgs,
  seedRepos,
  server,
} from '../utils';

import sendWebhookProposalClosed from '../../src/events/jobs/sendWebhookProposalClosed';

suite('events/sendWebhookProposalClosed', () => {
  let app: FastifyInstance, sandbox: SinonSandbox;
  let org: orgs, repo: repos, bot: bots;
  let task: tasks, proposal: task_items, postStub: SinonStub;

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();

    [org] = await seedOrgs(app, 1);
    [repo] = await seedRepos(app, [org]);
    [bot] = await seedBots(app, [org]);

    await app.prisma.bot_installations.create({
      data: { bot_id: bot.id, org_id: org.id },
    });

    task = await app.prisma.tasks.create({
      data: {
        title: 'Test task',
        org_id: org.id,
        token: 'tok',
        state: 'submitted',
      },
    });

    proposal = await app.prisma.task_items.create({
      data: {
        task_id: task.id,
        type: task_item.proposal,
        repo_id: repo.id,
        bot_id: bot.id,
        data: {
          prId: 123,
          prNumber: 1,
          prTitle: 'Title',
          prState: 'closed',
          prMerged: true,
          prHead: 'head-ref',
          prBase: 'base-ref',
        },
      },
    });
  });

  suiteTeardown(async () => {
    await app.prisma.tasks.deleteMany();
    await app.prisma.orgs.deleteMany();
    await app.close();
  });

  setup(() => {
    postStub = sandbox.stub(axios, 'post').resolves();
  });

  teardown(() => {
    sandbox.restore();
  });

  suite('proposal.accepted', () => {
    setup(async () => {
      await sendWebhookProposalClosed.handler?.(app, {
        proposalItemId: proposal.id,
      });
    });

    test('should call bot webhook_url', async () => {
      const body = {
        id: `whmsg_proposal_accepted_${proposal.id}`,
        type: 'proposal.accepted',
        data: {
          proposal: {
            id: proposal.id,
            type: 'proposal',
            data: {
              prId: 123,
              prNumber: 1,
              prTitle: 'Title',
              prState: 'closed',
              prMerged: true,
              prHead: 'head-ref',
              prBase: 'base-ref',
            },
            bot_id: bot.id,
            repo_id: repo.id,
          },
          task: {
            id: task.id,
            title: 'Test task',
          },
          org: {
            id: org.id,
            name: 'org-0',
            provider_type: 'github',
          },
        },
      };

      assert.equal(postStub.callCount, 1);

      const timestamp = JSON.parse(postStub.firstCall.args[1]).timestamp;

      assert.equal(postStub.firstCall.args[0], 'http://test.local/webhook/0');
      assert.deepNestedInclude(JSON.parse(postStub.firstCall.args[1]), body);
      assert.match(timestamp, regexTimestamp);

      assert.deepEqual(postStub.firstCall.args[2], {
        headers: {
          'content-type': 'application/json',
          'webhook-id': body.id,
          'webhook-timestamp': Math.floor(new Date(timestamp).getTime() / 1000),
          'webhook-signature': generateWebhookSignature(
            'atma_whsec_0',
            timestamp,
            body,
          ),
          'x-automa-server-host': 'http://localhost:8080',
        },
      });
    });
  });

  suite('proposal.rejected', () => {
    setup(async () => {
      await app.prisma.task_items.update({
        where: { id: proposal.id },
        data: {
          data: {
            ...(proposal.data as object),
            prMerged: false,
          },
        },
      });

      await sendWebhookProposalClosed.handler?.(app, {
        proposalItemId: proposal.id,
      });
    });

    test('should call bot webhook_url', async () => {
      const body = {
        id: `whmsg_proposal_rejected_${proposal.id}`,
        type: 'proposal.rejected',
        data: {
          proposal: {
            id: proposal.id,
            type: 'proposal',
            data: {
              prId: 123,
              prNumber: 1,
              prTitle: 'Title',
              prState: 'closed',
              prMerged: false,
              prHead: 'head-ref',
              prBase: 'base-ref',
            },
            bot_id: bot.id,
            repo_id: repo.id,
          },
          task: {
            id: task.id,
            title: 'Test task',
          },
          org: {
            id: org.id,
            name: 'org-0',
            provider_type: 'github',
          },
        },
      };

      assert.equal(postStub.callCount, 1);

      const timestamp = JSON.parse(postStub.firstCall.args[1]).timestamp;

      assert.equal(postStub.firstCall.args[0], 'http://test.local/webhook/0');
      assert.deepNestedInclude(JSON.parse(postStub.firstCall.args[1]), body);
      assert.match(timestamp, regexTimestamp);

      assert.deepEqual(postStub.firstCall.args[2], {
        headers: {
          'content-type': 'application/json',
          'webhook-id': body.id,
          'webhook-timestamp': Math.floor(new Date(timestamp).getTime() / 1000),
          'webhook-signature': generateWebhookSignature(
            'atma_whsec_0',
            timestamp,
            body,
          ),
          'x-automa-server-host': 'http://localhost:8080',
        },
      });
    });
  });
});
