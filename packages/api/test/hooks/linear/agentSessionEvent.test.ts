import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import { AgentActivityPayload, Issue, LinearClient } from '@linear/sdk';

import { bots, orgs, repos, users } from '@automa/prisma';

import { seedBots, seedOrgs, seedRepos, seedUsers, server } from '../../utils';

import { callWithFixture } from './utils';

suite('linear hook AgentSessionEvent event', () => {
  let app: FastifyInstance, response: LightMyRequestResponse;
  let user: users, org: orgs, repo: repos, bot: bots, secondBot: bots;
  let sandbox: SinonSandbox, issueStub: SinonStub, organizationStub: SinonStub;
  let createAgentActivityStub: SinonStub;

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
    await app.redis.flushall();

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

    createAgentActivityStub = sandbox
      .stub(LinearClient.prototype, 'createAgentActivity')
      .resolves({} as AgentActivityPayload);
  });

  teardown(async () => {
    sandbox.restore();
    await app.prisma.integrations.deleteMany();
    await app.prisma.tasks.deleteMany();
  });

  suite('created', () => {
    suite('assign', () => {
      setup(async () => {
        response = await callWithFixture(
          app,
          'AgentSessionEvent',
          'created/assign',
        );
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should not set comment event key in redis', async () => {
        const keys = await app.redis.keys('linear:event:comment_id:*');

        assert.isEmpty(keys);
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

      test('should send agent activity error about the task', async () => {
        assert.equal(createAgentActivityStub.callCount, 1);
        assert.deepEqual(createAgentActivityStub.firstCall.args[0], {
          agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
          content: {
            type: 'error',
            body: "We encountered the following issues while creating the task:\n- Bot not specified. Use `bot=name` to specify a bot.\n- Repo not specified. Use `repo=name` to specify a repo.\n\n*NOTE: We don't support assigning issues yet.*",
          },
        });
      });
    });

    suite('comment', () => {
      setup(async () => {
        response = await callWithFixture(
          app,
          'AgentSessionEvent',
          'created/comment',
        );
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should set comment event key in redis', async () => {
        const keys = await app.redis.keys('linear:event:comment_id:*');

        assert.equal(keys.length, 1);
        assert.equal(
          keys[0],
          'linear:event:comment_id:a41c315a-3130-4c8e-a9ca-6e9219c156b7',
        );

        const value = await app.redis.get(keys[0]);

        assert.equal(value, '@automa bot=bot-1 repo=repo-1');
      });

      test('should create task', async () => {
        const tasks = await app.prisma.tasks.findMany();

        assert.equal(tasks.length, 1);
        assert.deepOwnInclude(tasks[0], {
          org_id: org.id,
          title: 'Delete tokens when user revokes Github App',
          is_scheduled: false,
          state: 'started',
        });
        assert.isDefined(tasks[0].token);

        const taskItems = await app.prisma.task_items.findMany({
          where: {
            task_id: tasks[0].id,
          },
        });

        assert.equal(taskItems.length, 4);
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
            agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
          },
          actor_user_id: null,
        });
        assert.deepOwnInclude(taskItems[2], {
          type: 'repo',
          data: {
            integration: 'linear',
            userId: '5611201a-9594-4407-9490-731894376791',
            userName: 'Pavan Kumar Sunkara',
            userEmail: 'pavan@example.com',
          },
          actor_user_id: null,
          repo_id: repo.id,
        });
        assert.deepOwnInclude(taskItems[3], {
          type: 'bot',
          data: {
            integration: 'linear',
            userId: '5611201a-9594-4407-9490-731894376791',
            userName: 'Pavan Kumar Sunkara',
            userEmail: 'pavan@example.com',
          },
          actor_user_id: null,
          bot_id: secondBot.id,
        });
      });

      test('should get information about issue', async () => {
        assert.equal(issueStub.callCount, 1);
        assert.equal(
          issueStub.firstCall.args[0],
          'f2f72e62-b1a4-46c3-b605-0962d24792d8',
        );
      });

      test('should get information about organization', async () => {
        assert.equal(organizationStub.callCount, 1);
        assert.lengthOf(organizationStub.firstCall.args, 0);
      });

      test('should send agent activity action about the task', async () => {
        const tasks = await app.prisma.tasks.findMany();

        assert.equal(createAgentActivityStub.callCount, 1);
        assert.deepEqual(createAgentActivityStub.firstCall.args[0], {
          agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
          content: {
            type: 'action',
            action: 'Created task',
            parameter: 'org-0',
            result: `http://localhost:3000/org-0/tasks/${tasks[0].id}`,
            body: `Created task: http://localhost:3000/org-0/tasks/${tasks[0].id}`,
          },
        });
      });

      suite('comment on same issue again', () => {
        setup(async () => {
          response = await callWithFixture(
            app,
            'AgentSessionEvent',
            'created/comment',
          );
        });

        test('should return 200', async () => {
          assert.equal(response.statusCode, 200);
        });

        test('should set comment event key in redis', async () => {
          const keys = await app.redis.keys('linear:event:comment_id:*');

          assert.equal(keys.length, 1);
          assert.equal(
            keys[0],
            'linear:event:comment_id:a41c315a-3130-4c8e-a9ca-6e9219c156b7',
          );

          const value = await app.redis.get(keys[0]);

          assert.equal(value, '@automa bot=bot-1 repo=repo-1');
        });

        test('should not create task', async () => {
          const tasks = await app.prisma.tasks.findMany();

          assert.equal(tasks.length, 1);
        });

        test('should not get information about issue', async () => {
          assert.equal(issueStub.callCount, 1);
        });

        test('should not get information about organization', async () => {
          assert.equal(organizationStub.callCount, 1);
        });

        test('should send agent activity error about the task', async () => {
          const tasks = await app.prisma.tasks.findMany();

          assert.equal(createAgentActivityStub.callCount, 2);
          assert.deepEqual(createAgentActivityStub.secondCall.args[0], {
            agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
            content: {
              type: 'error',
              body: `A task already exists for this issue: http://localhost:3000/org-0/tasks/${tasks[0].id}`,
            },
          });
        });
      });

      suite('comment on same issue again with task being cancelled', () => {
        setup(async () => {
          await app.prisma.tasks.updateMany({
            data: {
              state: 'cancelled',
            },
          });

          response = await callWithFixture(
            app,
            'AgentSessionEvent',
            'created/comment',
          );
        });

        test('should return 200', async () => {
          assert.equal(response.statusCode, 200);
        });

        test('should set comment event key in redis', async () => {
          const keys = await app.redis.keys('linear:event:comment_id:*');

          assert.equal(keys.length, 1);
          assert.equal(
            keys[0],
            'linear:event:comment_id:a41c315a-3130-4c8e-a9ca-6e9219c156b7',
          );

          const value = await app.redis.get(keys[0]);

          assert.equal(value, '@automa bot=bot-1 repo=repo-1');
        });

        test('should create task', async () => {
          const tasks = await app.prisma.tasks.findMany({
            where: {
              state: {
                not: 'cancelled',
              },
            },
          });

          assert.equal(tasks.length, 1);
          assert.deepOwnInclude(tasks[0], {
            org_id: org.id,
            title: 'Delete tokens when user revokes Github App',
            is_scheduled: false,
            state: 'started',
          });
          assert.isDefined(tasks[0].token);

          const taskItems = await app.prisma.task_items.findMany({
            where: {
              task_id: tasks[0].id,
            },
          });

          assert.equal(taskItems.length, 4);
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
              agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
            },
            actor_user_id: null,
          });
          assert.deepOwnInclude(taskItems[2], {
            type: 'repo',
            data: {
              integration: 'linear',
              userId: '5611201a-9594-4407-9490-731894376791',
              userName: 'Pavan Kumar Sunkara',
              userEmail: 'pavan@example.com',
            },
            actor_user_id: null,
            repo_id: repo.id,
          });
          assert.deepOwnInclude(taskItems[3], {
            type: 'bot',
            data: {
              integration: 'linear',
              userId: '5611201a-9594-4407-9490-731894376791',
              userName: 'Pavan Kumar Sunkara',
              userEmail: 'pavan@example.com',
            },
            actor_user_id: null,
            bot_id: secondBot.id,
          });
        });

        test('should get information about issue', async () => {
          assert.equal(issueStub.callCount, 2);
          assert.equal(
            issueStub.secondCall.args[0],
            'f2f72e62-b1a4-46c3-b605-0962d24792d8',
          );
        });

        test('should get information about organization', async () => {
          assert.equal(organizationStub.callCount, 2);
          assert.lengthOf(organizationStub.secondCall.args, 0);
        });

        test('should send agent activity action about the task', async () => {
          const tasks = await app.prisma.tasks.findMany({
            where: {
              state: {
                not: 'cancelled',
              },
            },
          });

          assert.equal(createAgentActivityStub.callCount, 2);
          assert.deepEqual(createAgentActivityStub.secondCall.args[0], {
            agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
            content: {
              type: 'action',
              action: 'Created task',
              parameter: 'org-0',
              result: `http://localhost:3000/org-0/tasks/${tasks[0].id}`,
              body: `Created task: http://localhost:3000/org-0/tasks/${tasks[0].id}`,
            },
          });
        });
      });
    });

    suite('comment in thread', () => {
      setup(async () => {
        response = await callWithFixture(
          app,
          'AgentSessionEvent',
          'created/comment_with_parent',
        );
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should set comment event key in redis', async () => {
        const keys = await app.redis.keys('linear:event:comment_id:*');

        assert.equal(keys.length, 1);
        assert.equal(
          keys[0],
          'linear:event:comment_id:a41c315a-3130-4c8e-a9ca-6e9219c156b7',
        );

        const value = await app.redis.get(keys[0]);

        assert.equal(value, '@automa bot=bot-1 repo=repo-1');
      });

      test('should create task', async () => {
        const tasks = await app.prisma.tasks.findMany();

        assert.equal(tasks.length, 1);
        assert.deepOwnInclude(tasks[0], {
          org_id: org.id,
          title: 'Delete tokens when user revokes Github App',
          is_scheduled: false,
          state: 'started',
        });
        assert.isDefined(tasks[0].token);

        const taskItems = await app.prisma.task_items.findMany({
          where: {
            task_id: tasks[0].id,
          },
        });

        assert.equal(taskItems.length, 4);
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
            agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
          },
          actor_user_id: null,
        });
        assert.deepOwnInclude(taskItems[2], {
          type: 'repo',
          data: {
            integration: 'linear',
            userId: '5611201a-9594-4407-9490-731894376791',
            userName: 'Pavan Kumar Sunkara',
            userEmail: 'pavan@example.com',
          },
          actor_user_id: null,
          repo_id: repo.id,
        });
        assert.deepOwnInclude(taskItems[3], {
          type: 'bot',
          data: {
            integration: 'linear',
            userId: '5611201a-9594-4407-9490-731894376791',
            userName: 'Pavan Kumar Sunkara',
            userEmail: 'pavan@example.com',
          },
          actor_user_id: null,
          bot_id: secondBot.id,
        });
      });

      test('should get information about issue', async () => {
        assert.equal(issueStub.callCount, 1);
        assert.equal(
          issueStub.firstCall.args[0],
          'f2f72e62-b1a4-46c3-b605-0962d24792d8',
        );
      });

      test('should get information about organization', async () => {
        assert.equal(organizationStub.callCount, 1);
        assert.lengthOf(organizationStub.firstCall.args, 0);
      });

      test('should send agent activity action about the task', async () => {
        const tasks = await app.prisma.tasks.findMany();

        assert.equal(createAgentActivityStub.callCount, 1);
        assert.deepEqual(createAgentActivityStub.firstCall.args[0], {
          agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
          content: {
            type: 'action',
            action: 'Created task',
            parameter: 'org-0',
            result: `http://localhost:3000/org-0/tasks/${tasks[0].id}`,
            body: `Created task: http://localhost:3000/org-0/tasks/${tasks[0].id}`,
          },
        });
      });
    });

    suite('comment with no bot specified', () => {
      setup(async () => {
        response = await callWithFixture(
          app,
          'AgentSessionEvent',
          'created/comment_no_bot',
        );
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should set comment event key in redis', async () => {
        const keys = await app.redis.keys('linear:event:comment_id:*');

        assert.equal(keys.length, 1);
        assert.equal(
          keys[0],
          'linear:event:comment_id:a41c315a-3130-4c8e-a9ca-6e9219c156b7',
        );

        const value = await app.redis.get(keys[0]);

        assert.equal(value, '@automa repo=repo-1');
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

      test('should send agent activity error about the task', async () => {
        assert.equal(createAgentActivityStub.callCount, 1);
        assert.deepEqual(createAgentActivityStub.firstCall.args[0], {
          agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
          content: {
            type: 'error',
            body: "We encountered the following issues while creating the task:\n- Bot not specified. Use `bot=name` to specify a bot.\n\n*NOTE: We don't support assigning issues yet.*",
          },
        });
      });
    });

    suite('comment with wrong bot specified', () => {
      setup(async () => {
        response = await callWithFixture(
          app,
          'AgentSessionEvent',
          'created/comment_bot_bad',
        );
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should set comment event key in redis', async () => {
        const keys = await app.redis.keys('linear:event:comment_id:*');

        assert.equal(keys.length, 1);
        assert.equal(
          keys[0],
          'linear:event:comment_id:a41c315a-3130-4c8e-a9ca-6e9219c156b7',
        );

        const value = await app.redis.get(keys[0]);

        assert.equal(value, '@automa bot=bot-2 repo=repo-1');
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

      test('should send agent activity error about the task', async () => {
        assert.equal(createAgentActivityStub.callCount, 1);
        assert.deepEqual(createAgentActivityStub.firstCall.args[0], {
          agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
          content: {
            type: 'error',
            body: "We encountered the following issues while creating the task:\n- Bot `bot-2` not found.\n\n*NOTE: We don't support assigning issues yet.*",
          },
        });
      });
    });

    suite('comment with no repo specified', () => {
      setup(async () => {
        response = await callWithFixture(
          app,
          'AgentSessionEvent',
          'created/comment_no_repo',
        );
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should set comment event key in redis', async () => {
        const keys = await app.redis.keys('linear:event:comment_id:*');

        assert.equal(keys.length, 1);
        assert.equal(
          keys[0],
          'linear:event:comment_id:a41c315a-3130-4c8e-a9ca-6e9219c156b7',
        );

        const value = await app.redis.get(keys[0]);

        assert.equal(value, '@automa bot=bot-1');
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

      test('should send agent activity error about the task', async () => {
        assert.equal(createAgentActivityStub.callCount, 1);
        assert.deepEqual(createAgentActivityStub.firstCall.args[0], {
          agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
          content: {
            type: 'error',
            body: "We encountered the following issues while creating the task:\n- Repo not specified. Use `repo=name` to specify a repo.\n\n*NOTE: We don't support assigning issues yet.*",
          },
        });
      });
    });

    suite('comment with archived repo specified', () => {
      suiteSetup(async () => {
        await app.prisma.repos.update({
          where: {
            id: repo.id,
          },
          data: {
            is_archived: true,
          },
        });
      });

      suiteTeardown(async () => {
        await app.prisma.repos.update({
          where: {
            id: repo.id,
          },
          data: {
            is_archived: false,
          },
        });
      });

      setup(async () => {
        response = await callWithFixture(
          app,
          'AgentSessionEvent',
          'created/comment',
        );
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should set comment event key in redis', async () => {
        const keys = await app.redis.keys('linear:event:comment_id:*');

        assert.equal(keys.length, 1);
        assert.equal(
          keys[0],
          'linear:event:comment_id:a41c315a-3130-4c8e-a9ca-6e9219c156b7',
        );

        const value = await app.redis.get(keys[0]);

        assert.equal(value, '@automa bot=bot-1 repo=repo-1');
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

      test('should send agent activity error about the task', async () => {
        assert.equal(createAgentActivityStub.callCount, 1);
        assert.deepEqual(createAgentActivityStub.firstCall.args[0], {
          agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
          content: {
            type: 'error',
            body: "We encountered the following issues while creating the task:\n- Repo `repo-1` is archived.\n\n*NOTE: We don't support assigning issues yet.*",
          },
        });
      });
    });

    suite('comment with uninstalled repo specified', () => {
      suiteSetup(async () => {
        await app.prisma.repos.update({
          where: {
            id: repo.id,
          },
          data: {
            has_installation: false,
          },
        });
      });

      suiteTeardown(async () => {
        await app.prisma.repos.update({
          where: {
            id: repo.id,
          },
          data: {
            has_installation: true,
          },
        });
      });

      setup(async () => {
        response = await callWithFixture(
          app,
          'AgentSessionEvent',
          'created/comment',
        );
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should set comment event key in redis', async () => {
        const keys = await app.redis.keys('linear:event:comment_id:*');

        assert.equal(keys.length, 1);
        assert.equal(
          keys[0],
          'linear:event:comment_id:a41c315a-3130-4c8e-a9ca-6e9219c156b7',
        );

        const value = await app.redis.get(keys[0]);

        assert.equal(value, '@automa bot=bot-1 repo=repo-1');
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

      test('should send agent activity error about the task', async () => {
        assert.equal(createAgentActivityStub.callCount, 1);
        assert.deepEqual(createAgentActivityStub.firstCall.args[0], {
          agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
          content: {
            type: 'error',
            body: "We encountered the following issues while creating the task:\n- Repo `repo-1` is not connected to Automa.\n\n*NOTE: We don't support assigning issues yet.*",
          },
        });
      });
    });

    suite('comment with wrong repo specified', () => {
      setup(async () => {
        response = await callWithFixture(
          app,
          'AgentSessionEvent',
          'created/comment_repo_bad',
        );
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should set comment event key in redis', async () => {
        const keys = await app.redis.keys('linear:event:comment_id:*');

        assert.equal(keys.length, 1);
        assert.equal(
          keys[0],
          'linear:event:comment_id:a41c315a-3130-4c8e-a9ca-6e9219c156b7',
        );

        const value = await app.redis.get(keys[0]);

        assert.equal(value, '@automa bot=bot-1 repo=repo-2');
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

      test('should send agent activity error about the task', async () => {
        assert.equal(createAgentActivityStub.callCount, 1);
        assert.deepEqual(createAgentActivityStub.firstCall.args[0], {
          agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
          content: {
            type: 'error',
            body: "We encountered the following issues while creating the task:\n- Repo `repo-2` not found.\n\n*NOTE: We don't support assigning issues yet.*",
          },
        });
      });
    });

    suite('comment with no bot and no repo specified', () => {
      setup(async () => {
        response = await callWithFixture(
          app,
          'AgentSessionEvent',
          'created/comment_no_bot_repo',
        );
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should set comment event key in redis', async () => {
        const keys = await app.redis.keys('linear:event:comment_id:*');

        assert.equal(keys.length, 1);
        assert.equal(
          keys[0],
          'linear:event:comment_id:a41c315a-3130-4c8e-a9ca-6e9219c156b7',
        );

        const value = await app.redis.get(keys[0]);

        assert.equal(value, '@automa');
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

      test('should send agent activity error about the task', async () => {
        assert.equal(createAgentActivityStub.callCount, 1);
        assert.deepEqual(createAgentActivityStub.firstCall.args[0], {
          agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
          content: {
            type: 'error',
            body: "We encountered the following issues while creating the task:\n- Bot not specified. Use `bot=name` to specify a bot.\n- Repo not specified. Use `repo=name` to specify a repo.\n\n*NOTE: We don't support assigning issues yet.*",
          },
        });
      });
    });

    suite('comment with matching user', () => {
      setup(async () => {
        await app.prisma.users.update({
          where: {
            id: user.id,
          },
          data: {
            email: 'pavan@example.com',
          },
        });

        response = await callWithFixture(
          app,
          'AgentSessionEvent',
          'created/comment',
        );
      });

      teardown(async () => {
        await app.prisma.users.update({
          where: {
            id: user.id,
          },
          data: {
            email: 'user-0@example.com',
          },
        });
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should set comment event key in redis', async () => {
        const keys = await app.redis.keys('linear:event:comment_id:*');

        assert.equal(keys.length, 1);
        assert.equal(
          keys[0],
          'linear:event:comment_id:a41c315a-3130-4c8e-a9ca-6e9219c156b7',
        );

        const value = await app.redis.get(keys[0]);

        assert.equal(value, '@automa bot=bot-1 repo=repo-1');
      });

      test('should create task', async () => {
        const tasks = await app.prisma.tasks.findMany();

        assert.equal(tasks.length, 1);
        assert.deepOwnInclude(tasks[0], {
          org_id: org.id,
          title: 'Delete tokens when user revokes Github App',
          is_scheduled: false,
          state: 'started',
        });
        assert.isDefined(tasks[0].token);

        const taskItems = await app.prisma.task_items.findMany({
          where: {
            task_id: tasks[0].id,
          },
        });

        assert.equal(taskItems.length, 4);
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
            issueId: 'f2f72e62-b1a4-46c3-b605-0962d24792d8',
            issueIdentifier: 'PRO-93',
            issueTitle: 'Delete tokens when user revokes Github App',
            commentId: 'a41c315a-3130-4c8e-a9ca-6e9219c156b7',
            agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
          },
          actor_user_id: user.id,
        });
        assert.deepOwnInclude(taskItems[2], {
          type: 'repo',
          data: {},
          actor_user_id: user.id,
          repo_id: repo.id,
        });
        assert.deepOwnInclude(taskItems[3], {
          type: 'bot',
          data: {},
          actor_user_id: user.id,
          bot_id: secondBot.id,
        });
      });

      test('should get information about issue', async () => {
        assert.equal(issueStub.callCount, 1);
        assert.equal(
          issueStub.firstCall.args[0],
          'f2f72e62-b1a4-46c3-b605-0962d24792d8',
        );
      });

      test('should get information about organization', async () => {
        assert.equal(organizationStub.callCount, 1);
        assert.lengthOf(organizationStub.firstCall.args, 0);
      });

      test('should send agent activity action about the task', async () => {
        const tasks = await app.prisma.tasks.findMany();

        assert.equal(createAgentActivityStub.callCount, 1);
        assert.deepEqual(createAgentActivityStub.firstCall.args[0], {
          agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
          content: {
            type: 'action',
            action: 'Created task',
            parameter: 'org-0',
            result: `http://localhost:3000/org-0/tasks/${tasks[0].id}`,
            body: `Created task: http://localhost:3000/org-0/tasks/${tasks[0].id}`,
          },
        });
      });
    });

    suite('comment with missing integration', () => {
      setup(async () => {
        await app.prisma.integrations.update({
          where: {
            org_id_type: {
              org_id: org.id,
              type: 'linear',
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

        response = await callWithFixture(
          app,
          'AgentSessionEvent',
          'created/comment',
        );
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should set comment event key in redis', async () => {
        const keys = await app.redis.keys('linear:event:comment_id:*');

        assert.equal(keys.length, 1);
        assert.equal(
          keys[0],
          'linear:event:comment_id:a41c315a-3130-4c8e-a9ca-6e9219c156b7',
        );

        const value = await app.redis.get(keys[0]);

        assert.equal(value, '@automa bot=bot-1 repo=repo-1');
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

      test('should not send agent activity', async () => {
        assert.equal(createAgentActivityStub.callCount, 0);
      });
    });
  });

  suite('prompted', () => {
    suite('create after comment with no bot and no repo specified', () => {
      setup(async () => {
        await callWithFixture(
          app,
          'AgentSessionEvent',
          'created/comment_no_bot_repo',
        );
        sandbox.resetHistory();

        response = await callWithFixture(
          app,
          'AgentSessionEvent',
          'prompted/create',
        );
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should set comment event key in redis', async () => {
        const keys = await app.redis.keys('linear:event:comment_id:*');

        assert.equal(keys.length, 2);
        assert.include(
          keys,
          'linear:event:comment_id:7a527025-452a-4b05-8e6e-83b442a5e294',
        );
        assert.include(
          keys,
          'linear:event:comment_id:a41c315a-3130-4c8e-a9ca-6e9219c156b7',
        );

        const values = await Promise.all(keys.map((key) => app.redis.get(key)));

        assert.equal(values.length, 2);
        assert.include(values, '@automa bot=bot-1 repo=repo-1');
        assert.include(values, '@automa');
      });

      test('should create task', async () => {
        const tasks = await app.prisma.tasks.findMany();

        assert.equal(tasks.length, 1);
        assert.deepOwnInclude(tasks[0], {
          org_id: org.id,
          title: 'Delete tokens when user revokes Github App',
          is_scheduled: false,
          state: 'started',
        });
        assert.isDefined(tasks[0].token);

        const taskItems = await app.prisma.task_items.findMany({
          where: {
            task_id: tasks[0].id,
          },
        });

        assert.equal(taskItems.length, 4);
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
            commentId: '7a527025-452a-4b05-8e6e-83b442a5e294',
            agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
          },
          actor_user_id: null,
        });
        assert.deepOwnInclude(taskItems[2], {
          type: 'repo',
          data: {
            integration: 'linear',
            userId: '5611201a-9594-4407-9490-731894376791',
            userName: 'Pavan Kumar Sunkara',
            userEmail: 'pavan@example.com',
          },
          actor_user_id: null,
          repo_id: repo.id,
        });
        assert.deepOwnInclude(taskItems[3], {
          type: 'bot',
          data: {
            integration: 'linear',
            userId: '5611201a-9594-4407-9490-731894376791',
            userName: 'Pavan Kumar Sunkara',
            userEmail: 'pavan@example.com',
          },
          actor_user_id: null,
          bot_id: secondBot.id,
        });
      });

      test('should get information about issue', async () => {
        assert.equal(issueStub.callCount, 1);
        assert.equal(
          issueStub.firstCall.args[0],
          'f2f72e62-b1a4-46c3-b605-0962d24792d8',
        );
      });

      test('should get information about organization', async () => {
        assert.equal(organizationStub.callCount, 1);
        assert.lengthOf(organizationStub.firstCall.args, 0);
      });

      test('should send agent activity action about the task', async () => {
        const tasks = await app.prisma.tasks.findMany();

        assert.equal(createAgentActivityStub.callCount, 1);
        assert.deepEqual(createAgentActivityStub.firstCall.args[0], {
          agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
          content: {
            type: 'action',
            action: 'Created task',
            parameter: 'org-0',
            result: `http://localhost:3000/org-0/tasks/${tasks[0].id}`,
            body: `Created task: http://localhost:3000/org-0/tasks/${tasks[0].id}`,
          },
        });
      });
    });

    suite(
      'create after comment in thread with no bot and no repo specified',
      () => {
        setup(async () => {
          await callWithFixture(
            app,
            'AgentSessionEvent',
            'created/comment_no_bot_repo',
          );
          sandbox.resetHistory();

          response = await callWithFixture(
            app,
            'AgentSessionEvent',
            'prompted/create_with_parent',
          );
        });

        test('should return 200', async () => {
          assert.equal(response.statusCode, 200);
        });

        test('should set comment event key in redis', async () => {
          const keys = await app.redis.keys('linear:event:comment_id:*');

          assert.equal(keys.length, 2);
          assert.include(
            keys,
            'linear:event:comment_id:7a527025-452a-4b05-8e6e-83b442a5e294',
          );
          assert.include(
            keys,
            'linear:event:comment_id:a41c315a-3130-4c8e-a9ca-6e9219c156b7',
          );

          const values = await Promise.all(
            keys.map((key) => app.redis.get(key)),
          );

          assert.equal(values.length, 2);
          assert.include(values, '@automa bot=bot-1 repo=repo-1');
          assert.include(values, '@automa');
        });

        test('should create task', async () => {
          const tasks = await app.prisma.tasks.findMany();

          assert.equal(tasks.length, 1);
          assert.deepOwnInclude(tasks[0], {
            org_id: org.id,
            title: 'Delete tokens when user revokes Github App',
            is_scheduled: false,
            state: 'started',
          });
          assert.isDefined(tasks[0].token);

          const taskItems = await app.prisma.task_items.findMany({
            where: {
              task_id: tasks[0].id,
            },
          });

          assert.equal(taskItems.length, 4);
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
              commentId: '7a527025-452a-4b05-8e6e-83b442a5e294',
              agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
            },
            actor_user_id: null,
          });
          assert.deepOwnInclude(taskItems[2], {
            type: 'repo',
            data: {
              integration: 'linear',
              userId: '5611201a-9594-4407-9490-731894376791',
              userName: 'Pavan Kumar Sunkara',
              userEmail: 'pavan@example.com',
            },
            actor_user_id: null,
            repo_id: repo.id,
          });
          assert.deepOwnInclude(taskItems[3], {
            type: 'bot',
            data: {
              integration: 'linear',
              userId: '5611201a-9594-4407-9490-731894376791',
              userName: 'Pavan Kumar Sunkara',
              userEmail: 'pavan@example.com',
            },
            actor_user_id: null,
            bot_id: secondBot.id,
          });
        });

        test('should get information about issue', async () => {
          assert.equal(issueStub.callCount, 1);
          assert.equal(
            issueStub.firstCall.args[0],
            'f2f72e62-b1a4-46c3-b605-0962d24792d8',
          );
        });

        test('should get information about organization', async () => {
          assert.equal(organizationStub.callCount, 1);
          assert.lengthOf(organizationStub.firstCall.args, 0);
        });

        test('should send agent activity action about the task', async () => {
          const tasks = await app.prisma.tasks.findMany();

          assert.equal(createAgentActivityStub.callCount, 1);
          assert.deepEqual(createAgentActivityStub.firstCall.args[0], {
            agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
            content: {
              type: 'action',
              action: 'Created task',
              parameter: 'org-0',
              result: `http://localhost:3000/org-0/tasks/${tasks[0].id}`,
              body: `Created task: http://localhost:3000/org-0/tasks/${tasks[0].id}`,
            },
          });
        });
      },
    );

    suite(
      'create with no bot and no repo specified after comment with no bot and no repo specified',
      () => {
        setup(async () => {
          await callWithFixture(
            app,
            'AgentSessionEvent',
            'created/comment_no_bot_repo',
          );
          sandbox.resetHistory();

          response = await callWithFixture(
            app,
            'AgentSessionEvent',
            'prompted/create_no_bot_repo',
          );
        });

        test('should return 200', async () => {
          assert.equal(response.statusCode, 200);
        });

        test('should set comment event key in redis', async () => {
          const keys = await app.redis.keys('linear:event:comment_id:*');

          assert.equal(keys.length, 2);
          assert.include(
            keys,
            'linear:event:comment_id:7a527025-452a-4b05-8e6e-83b442a5e294',
          );
          assert.include(
            keys,
            'linear:event:comment_id:a41c315a-3130-4c8e-a9ca-6e9219c156b7',
          );

          const values = await Promise.all(
            keys.map((key) => app.redis.get(key)),
          );

          assert.equal(values.length, 2);
          assert.include(values, '@automa');
          assert.include(values, '@automa');
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

        test('should send agent activity error about the task', async () => {
          assert.equal(createAgentActivityStub.callCount, 1);
          assert.deepEqual(createAgentActivityStub.firstCall.args[0], {
            agentSessionId: '13ae8ec9-e210-4c31-8975-d1214483f138',
            content: {
              type: 'error',
              body: "We encountered the following issues while creating the task:\n- Bot not specified. Use `bot=name` to specify a bot.\n- Repo not specified. Use `repo=name` to specify a repo.\n\n*NOTE: We don't support assigning issues yet.*",
            },
          });
        });
      },
    );

    suite('create after comment', () => {
      setup(async () => {
        await callWithFixture(app, 'AgentSessionEvent', 'created/comment');
        sandbox.resetHistory();

        response = await callWithFixture(
          app,
          'AgentSessionEvent',
          'prompted/create',
        );
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should set comment event key in redis', async () => {
        const keys = await app.redis.keys('linear:event:comment_id:*');

        assert.equal(keys.length, 1);
        assert.equal(
          keys[0],
          'linear:event:comment_id:a41c315a-3130-4c8e-a9ca-6e9219c156b7',
        );

        const value = await app.redis.get(keys[0]);

        assert.equal(value, '@automa bot=bot-1 repo=repo-1');
      });

      test('should not create duplicate task', async () => {
        const tasks = await app.prisma.tasks.findMany();

        assert.equal(tasks.length, 1);
      });

      test('should not get information about issue', async () => {
        assert.equal(issueStub.callCount, 0);
      });

      test('should not get information about organization', async () => {
        assert.equal(organizationStub.callCount, 0);
      });

      test('should not send agent activity error about the task', async () => {
        assert.equal(createAgentActivityStub.callCount, 0);
      });
    });
  });
});
