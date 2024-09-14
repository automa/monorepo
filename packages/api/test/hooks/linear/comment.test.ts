import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import { CommentPayload, Issue, LinearClient, Team, User } from '@linear/sdk';

import { bots, orgs, repos, users } from '@automa/prisma';

import { seedBots, seedOrgs, seedRepos, seedUsers, server } from '../../utils';

import { callWithFixture } from './utils';

suite('linear hook Comment event', () => {
  let app: FastifyInstance, response: LightMyRequestResponse;
  let user: users, org: orgs, repo: repos, bot: bots, secondBot: bots;
  let sandbox: SinonSandbox,
    issueStub: SinonStub,
    teamStub: SinonStub,
    userStub: SinonStub,
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
    sandbox.stub(app.events.taskCreated, 'publish').resolves();

    await app.prisma.integrations.create({
      data: {
        org_id: org.id,
        integration_type: 'linear',
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

    teamStub = sandbox.stub(LinearClient.prototype, 'team').resolves({
      id: 'b7e7eb03-9d67-41b3-a268-84c14a6757d6',
      key: 'PRO',
      name: 'Product',
    } as Team);

    userStub = sandbox.stub(LinearClient.prototype, 'user').resolves({
      id: '5611201a-9594-4407-9490-731894376791',
      name: 'Pavan Kumar Sunkara',
      email: 'pavan@example.com',
    } as User);

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

  suite('create', () => {
    setup(async () => {
      response = await callWithFixture(app, 'Comment', 'create');
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should create task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(tasks.length, 1);
      assert.deepOwnInclude(tasks[0], {
        org_id: org.id,
        title: 'Delete tokens when user revokes Github App',
        is_scheduled: false,
        completed_at: null,
      });
      assert.isDefined(tasks[0].token);

      const taskItems = await app.prisma.task_items.findMany({
        where: {
          task_id: tasks[0].id,
        },
      });

      assert.equal(taskItems.length, 2);
      assert.deepOwnInclude(taskItems[0], {
        type: 'message',
        data: {
          content:
            '* Delete the github refresh token stored in DB\n* Clear all sessions for the user',
        },
        actor_user_id: null,
      });
      assert.deepOwnInclude(taskItems[1], {
        type: 'origin',
        data: {
          integration: 'linear',
          organizationId: '6cb652a9-8f3f-40b7-9695-df81e161fe07',
          organizationUrlKey: 'automa',
          organizationName: 'Automa',
          teamId: 'b7e7eb03-9d67-41b3-a268-84c14a6757d6',
          teamKey: 'PRO',
          teamName: 'Product',
          userId: '5611201a-9594-4407-9490-731894376791',
          userName: 'Pavan Kumar Sunkara',
          userEmail: 'pavan@example.com',
          issueId: 'f2f72e62-b1a4-46c3-b605-0962d24792d8',
          issueIdentifier: 'PRO-93',
          issueTitle: 'Delete tokens when user revokes Github App',
          commentId: 'a41c315a-3130-4c8e-a9ca-6e9219c156b7',
        },
        actor_user_id: null,
      });
    });

    test('should get information about issue', async () => {
      assert.equal(issueStub.callCount, 1);
      assert.equal(
        issueStub.firstCall.args[0],
        'f2f72e62-b1a4-46c3-b605-0962d24792d8',
      );
    });

    test('should get information about team', async () => {
      assert.equal(teamStub.callCount, 1);
      assert.equal(
        teamStub.firstCall.args[0],
        'b7e7eb03-9d67-41b3-a268-84c14a6757d6',
      );
    });

    test('should get information about user', async () => {
      assert.equal(userStub.callCount, 1);
      assert.equal(
        userStub.firstCall.args[0],
        '5611201a-9594-4407-9490-731894376791',
      );
    });

    test('should get information about organization', async () => {
      assert.equal(organizationStub.callCount, 1);
      assert.lengthOf(organizationStub.firstCall.args, 0);
    });

    test('should create comment about the task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(createCommentStub.callCount, 1);
      assert.deepEqual(createCommentStub.firstCall.args[0], {
        body: `Created task: http://localhost:3000/org-0/tasks/${tasks[0].id}`,
        issueId: 'f2f72e62-b1a4-46c3-b605-0962d24792d8',
        parentId: 'a41c315a-3130-4c8e-a9ca-6e9219c156b7',
      });
    });
  });

  suite('create in comment thread', () => {
    setup(async () => {
      response = await callWithFixture(app, 'Comment', 'create_with_parent');
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should create task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(tasks.length, 1);
      assert.deepOwnInclude(tasks[0], {
        org_id: org.id,
        title: 'Delete tokens when user revokes Github App',
        is_scheduled: false,
        completed_at: null,
      });
      assert.isDefined(tasks[0].token);

      const taskItems = await app.prisma.task_items.findMany({
        where: {
          task_id: tasks[0].id,
        },
      });

      assert.equal(taskItems.length, 2);
      assert.deepOwnInclude(taskItems[0], {
        type: 'message',
        data: {
          content:
            '* Delete the github refresh token stored in DB\n* Clear all sessions for the user',
        },
      });
      assert.deepOwnInclude(taskItems[1], {
        type: 'origin',
        data: {
          integration: 'linear',
          organizationId: '6cb652a9-8f3f-40b7-9695-df81e161fe07',
          organizationUrlKey: 'automa',
          organizationName: 'Automa',
          teamId: 'b7e7eb03-9d67-41b3-a268-84c14a6757d6',
          teamKey: 'PRO',
          teamName: 'Product',
          userId: '5611201a-9594-4407-9490-731894376791',
          userName: 'Pavan Kumar Sunkara',
          userEmail: 'pavan@example.com',
          issueId: 'f2f72e62-b1a4-46c3-b605-0962d24792d8',
          issueIdentifier: 'PRO-93',
          issueTitle: 'Delete tokens when user revokes Github App',
          commentId: '9ab4e3ef-0728-4972-a7a8-01775a9a51b6',
          parentId: 'a41c315a-3130-4c8e-a9ca-6e9219c156b7',
        },
      });
    });

    test('should get information about issue', async () => {
      assert.equal(issueStub.callCount, 1);
      assert.equal(
        issueStub.firstCall.args[0],
        'f2f72e62-b1a4-46c3-b605-0962d24792d8',
      );
    });

    test('should get information about team', async () => {
      assert.equal(teamStub.callCount, 1);
      assert.equal(
        teamStub.firstCall.args[0],
        'b7e7eb03-9d67-41b3-a268-84c14a6757d6',
      );
    });

    test('should get information about user', async () => {
      assert.equal(userStub.callCount, 1);
      assert.equal(
        userStub.firstCall.args[0],
        '5611201a-9594-4407-9490-731894376791',
      );
    });

    test('should get information about organization', async () => {
      assert.equal(organizationStub.callCount, 1);
      assert.lengthOf(organizationStub.firstCall.args, 0);
    });

    test('should create comment about the task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(createCommentStub.callCount, 1);
      assert.deepEqual(createCommentStub.firstCall.args[0], {
        body: `Created task: http://localhost:3000/org-0/tasks/${tasks[0].id}`,
        issueId: 'f2f72e62-b1a4-46c3-b605-0962d24792d8',
        parentId: 'a41c315a-3130-4c8e-a9ca-6e9219c156b7',
      });
    });
  });

  suite('create with bot specified', () => {
    setup(async () => {
      response = await callWithFixture(app, 'Comment', 'create_bot');
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should create task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(tasks.length, 1);
      assert.deepOwnInclude(tasks[0], {
        org_id: org.id,
        title: 'Delete tokens when user revokes Github App',
      });
    });

    test('should assign task to bot', async () => {
      const taskItems = await app.prisma.task_items.findMany({
        where: {
          type: 'bot',
        },
      });

      assert.equal(taskItems.length, 1);

      assert.deepOwnInclude(taskItems[0], {
        type: 'bot',
        data: {
          integration: 'linear',
          userId: '5611201a-9594-4407-9490-731894376791',
          userName: 'Pavan Kumar Sunkara',
          userEmail: 'pavan@example.com',
          botId: secondBot.id,
          botName: 'bot-1',
          botImageUrl: 'https://example.com/image/1.png',
          botOrgId: org.id,
          botOrgName: 'org-0',
        },
        actor_user_id: null,
      });
    });

    test('should get information about issue', async () => {
      assert.equal(issueStub.callCount, 1);
      assert.equal(
        issueStub.firstCall.args[0],
        'f2f72e62-b1a4-46c3-b605-0962d24792d8',
      );
    });

    test('should get information about team', async () => {
      assert.equal(teamStub.callCount, 1);
      assert.equal(
        teamStub.firstCall.args[0],
        'b7e7eb03-9d67-41b3-a268-84c14a6757d6',
      );
    });

    test('should get information about user', async () => {
      assert.equal(userStub.callCount, 1);
      assert.equal(
        userStub.firstCall.args[0],
        '5611201a-9594-4407-9490-731894376791',
      );
    });

    test('should get information about organization', async () => {
      assert.equal(organizationStub.callCount, 1);
      assert.lengthOf(organizationStub.firstCall.args, 0);
    });

    test('should create comment about the task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(createCommentStub.callCount, 1);
      assert.deepEqual(createCommentStub.firstCall.args[0], {
        body: `Created task: http://localhost:3000/org-0/tasks/${tasks[0].id}`,
        issueId: 'f2f72e62-b1a4-46c3-b605-0962d24792d8',
        parentId: 'a41c315a-3130-4c8e-a9ca-6e9219c156b7',
      });
    });
  });

  suite('create with wrong bot specified', () => {
    setup(async () => {
      response = await callWithFixture(app, 'Comment', 'create_bot_bad');
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should create task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(tasks.length, 1);
      assert.deepOwnInclude(tasks[0], {
        org_id: org.id,
        title: 'Delete tokens when user revokes Github App',
      });
    });

    test('should not assign task to bot', async () => {
      const taskItems = await app.prisma.task_items.findMany({
        where: {
          type: 'bot',
        },
      });

      assert.isEmpty(taskItems);
    });

    test('should get information about issue', async () => {
      assert.equal(issueStub.callCount, 1);
      assert.equal(
        issueStub.firstCall.args[0],
        'f2f72e62-b1a4-46c3-b605-0962d24792d8',
      );
    });

    test('should get information about team', async () => {
      assert.equal(teamStub.callCount, 1);
      assert.equal(
        teamStub.firstCall.args[0],
        'b7e7eb03-9d67-41b3-a268-84c14a6757d6',
      );
    });

    test('should get information about user', async () => {
      assert.equal(userStub.callCount, 1);
      assert.equal(
        userStub.firstCall.args[0],
        '5611201a-9594-4407-9490-731894376791',
      );
    });

    test('should get information about organization', async () => {
      assert.equal(organizationStub.callCount, 1);
      assert.lengthOf(organizationStub.firstCall.args, 0);
    });

    test('should create comment about the task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(createCommentStub.callCount, 1);
      assert.deepEqual(createCommentStub.firstCall.args[0], {
        body: `Created task: http://localhost:3000/org-0/tasks/${tasks[0].id}\n\nWe encountered the following issues while creating the task:\n- Bot \`bot-2\` not found. Using AI to select bot.`,
        issueId: 'f2f72e62-b1a4-46c3-b605-0962d24792d8',
        parentId: 'a41c315a-3130-4c8e-a9ca-6e9219c156b7',
      });
    });
  });

  suite('create with repo specified', () => {
    setup(async () => {
      response = await callWithFixture(app, 'Comment', 'create_repo');
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should create task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(tasks.length, 1);
      assert.deepOwnInclude(tasks[0], {
        org_id: org.id,
        title: 'Delete tokens when user revokes Github App',
      });
    });

    test('should select repo for the task', async () => {
      const taskItems = await app.prisma.task_items.findMany({
        where: {
          type: 'repo',
        },
      });

      assert.equal(taskItems.length, 1);

      assert.deepOwnInclude(taskItems[0], {
        type: 'repo',
        data: {
          integration: 'linear',
          userId: '5611201a-9594-4407-9490-731894376791',
          userName: 'Pavan Kumar Sunkara',
          userEmail: 'pavan@example.com',
          repoId: repo.id,
          repoName: 'repo-1',
          repoOrgId: org.id,
          repoOrgName: 'org-0',
          repoOrgProviderType: 'github',
          repoOrgProviderId: '0',
          repoProviderId: '1',
        },
        actor_user_id: null,
      });
    });

    test('should get information about issue', async () => {
      assert.equal(issueStub.callCount, 1);
      assert.equal(
        issueStub.firstCall.args[0],
        'f2f72e62-b1a4-46c3-b605-0962d24792d8',
      );
    });

    test('should get information about team', async () => {
      assert.equal(teamStub.callCount, 1);
      assert.equal(
        teamStub.firstCall.args[0],
        'b7e7eb03-9d67-41b3-a268-84c14a6757d6',
      );
    });

    test('should get information about user', async () => {
      assert.equal(userStub.callCount, 1);
      assert.equal(
        userStub.firstCall.args[0],
        '5611201a-9594-4407-9490-731894376791',
      );
    });

    test('should get information about organization', async () => {
      assert.equal(organizationStub.callCount, 1);
      assert.lengthOf(organizationStub.firstCall.args, 0);
    });

    test('should create comment about the task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(createCommentStub.callCount, 1);
      assert.deepEqual(createCommentStub.firstCall.args[0], {
        body: `Created task: http://localhost:3000/org-0/tasks/${tasks[0].id}`,
        issueId: 'f2f72e62-b1a4-46c3-b605-0962d24792d8',
        parentId: 'a41c315a-3130-4c8e-a9ca-6e9219c156b7',
      });
    });
  });

  suite('create with wrong repo specified', () => {
    setup(async () => {
      response = await callWithFixture(app, 'Comment', 'create_repo_bad');
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should create task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(tasks.length, 1);
      assert.deepOwnInclude(tasks[0], {
        org_id: org.id,
        title: 'Delete tokens when user revokes Github App',
      });
    });

    test('should not select repo for the task', async () => {
      const taskItems = await app.prisma.task_items.findMany({
        where: {
          type: 'repo',
        },
      });

      assert.isEmpty(taskItems);
    });

    test('should get information about issue', async () => {
      assert.equal(issueStub.callCount, 1);
      assert.equal(
        issueStub.firstCall.args[0],
        'f2f72e62-b1a4-46c3-b605-0962d24792d8',
      );
    });

    test('should get information about team', async () => {
      assert.equal(teamStub.callCount, 1);
      assert.equal(
        teamStub.firstCall.args[0],
        'b7e7eb03-9d67-41b3-a268-84c14a6757d6',
      );
    });

    test('should get information about user', async () => {
      assert.equal(userStub.callCount, 1);
      assert.equal(
        userStub.firstCall.args[0],
        '5611201a-9594-4407-9490-731894376791',
      );
    });

    test('should get information about organization', async () => {
      assert.equal(organizationStub.callCount, 1);
      assert.lengthOf(organizationStub.firstCall.args, 0);
    });

    test('should create comment about the task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(createCommentStub.callCount, 1);
      assert.deepEqual(createCommentStub.firstCall.args[0], {
        body: `Created task: http://localhost:3000/org-0/tasks/${tasks[0].id}\n\nWe encountered the following issues while creating the task:\n- Repo \`repo-2\` not found. Using AI to select repo.`,
        issueId: 'f2f72e62-b1a4-46c3-b605-0962d24792d8',
        parentId: 'a41c315a-3130-4c8e-a9ca-6e9219c156b7',
      });
    });
  });

  suite('create with non-automa comment', () => {
    setup(async () => {
      response = await callWithFixture(app, 'Comment', 'create_ignore');
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

    test('should not get information about team', async () => {
      assert.equal(teamStub.callCount, 0);
    });

    test('should not get information about user', async () => {
      assert.equal(userStub.callCount, 0);
    });

    test('should not get information about organization', async () => {
      assert.equal(organizationStub.callCount, 0);
    });

    test('should not be able to create any comment', async () => {
      assert.equal(createCommentStub.callCount, 0);
    });
  });

  suite('create with missing integration', () => {
    setup(async () => {
      await app.prisma.integrations.update({
        where: {
          org_id_integration_type: {
            org_id: org.id,
            integration_type: 'linear',
          },
        },
        data: {
          config: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Workspace',
            slug: 'workspace',
          },
        },
      });

      response = await callWithFixture(app, 'Comment', 'create');
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

    test('should not get information about team', async () => {
      assert.equal(teamStub.callCount, 0);
    });

    test('should not get information about user', async () => {
      assert.equal(userStub.callCount, 0);
    });

    test('should not get information about organization', async () => {
      assert.equal(organizationStub.callCount, 0);
    });

    test('should not be able to create any comment', async () => {
      assert.equal(createCommentStub.callCount, 0);
    });
  });
});
