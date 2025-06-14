import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import { CommentPayload, Issue, LinearClient } from '@linear/sdk';

import { bots, orgs, repos, users } from '@automa/prisma';

import { seedBots, seedOrgs, seedRepos, seedUsers, server } from '../../utils';

import { callWithFixture } from './utils';

suite('linear hook AppUserNotification event', () => {
  let app: FastifyInstance, response: LightMyRequestResponse;
  let user: users, org: orgs, repo: repos, bot: bots, secondBot: bots;
  let sandbox: SinonSandbox,
    issueStub: SinonStub,
    organizationStub: SinonStub,
    createCommentStub: SinonStub;

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();

    [user] = await seedUsers(app, 1);
    [org] = await seedOrgs(app, 1);
    [, repo] = await seedRepos(app, [org, org]);
    [bot, secondBot] = await seedBots(app, [org, org]);

    await app.prisma.bot_installations.createMany({
      data: [
        {
          bot_id: bot.id,
          org_id: org.id,
        },
        {
          bot_id: secondBot.id,
          org_id: org.id,
        },
      ],
    });
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.prisma.users.deleteMany();
    await app.close();
  });

  setup(async () => {
    sandbox.stub(app.events.sendTaskWebhook, 'publish').resolves();

    await app.prisma.integrations.create({
      data: {
        org_id: org.id,
        type: 'linear',
        secrets: {
          access_token: 'abcdef',
        },
        config: {
          id: '6cb652a9-8f3f-40b7-9695-df81e161fe07',
          name: 'Automa',
          slug: 'automa',
        },
        created_by: user.id,
      },
    });

    issueStub = sandbox.stub(LinearClient.prototype, 'issue').resolves({
      id: 'f2f72e62-b1a4-46c3-b605-0962d24792d8',
      identifier: 'PRO-93',
      title: 'Delete tokens when user revokes Github App',
      description:
        '* Delete the github refresh token stored in DB\n* Clear all sessions for the user',
    } as Issue);

    organizationStub = sandbox.stub().resolves({
      id: '6cb652a9-8f3f-40b7-9695-df81e161fe07',
      name: 'Automa',
      urlKey: 'automa',
    });

    sandbox.stub(LinearClient.prototype, 'organization').get(organizationStub);

    createCommentStub = sandbox
      .stub(LinearClient.prototype, 'createComment')
      .resolves({} as CommentPayload);
  });

  teardown(async () => {
    sandbox.restore();
    await app.prisma.integrations.deleteMany();
    await app.prisma.tasks.deleteMany();
  });

  suite('issueAssignedToYou', () => {
    suite('assign', () => {
      setup(async () => {
        response = await callWithFixture(
          app,
          'AppUserNotification',
          'issueAssignedToYou/assign',
        );
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should not create task', async () => {
        const tasks = await app.prisma.tasks.findMany();

        assert.equal(tasks.length, 0);
      });

      test('should not get information about issue', async () => {
        assert.equal(issueStub.callCount, 0);
      });

      test('should not get information about organization', async () => {
        assert.equal(organizationStub.callCount, 0);
      });

      test('should create comment about the task', async () => {
        assert.equal(createCommentStub.callCount, 1);
        assert.deepEqual(createCommentStub.firstCall.args[0], {
          body: "We encountered the following issues while creating the task:\n- Bot not specified. Use `bot=name` to specify a bot.\n- Repo not specified. Use `repo=name` to specify a repo.\n\n*NOTE: We don't support assigning issues yet.*",
          issueId: 'f2f72e62-b1a4-46c3-b605-0962d24792d8',
          parentId: undefined,
        });
      });
    });
  });
});
