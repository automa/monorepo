import { FastifyInstance } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import { CommentConnection, Issue, LinearClient, User } from '@linear/sdk';
import axios from 'axios';

import {
  bots,
  orgs,
  repos,
  task_item,
  task_items,
  tasks,
  users,
} from '@automa/prisma';

import {
  generateWebhookSignature,
  regexTimestamp,
  seedBots,
  seedOrgs,
  seedRepos,
  seedUsers,
  server,
} from '../utils';

import sendTaskWebhook from '../../src/events/jobs/sendTaskWebhook';

suite('events/sendTaskWebhook', () => {
  let app: FastifyInstance, sandbox: SinonSandbox, user: users;
  let org: orgs, nonMemberOrg: orgs;
  let repo: repos, secondRepo: repos, bot: bots, secondBot: bots;

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();

    [user] = await seedUsers(app, 1);
    [org, nonMemberOrg] = await seedOrgs(app, 2);
    [repo, secondRepo] = await seedRepos(app, [org, org]);
    [bot, secondBot] = await seedBots(app, [nonMemberOrg, nonMemberOrg]);

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

  teardown(async () => {
    await app.prisma.tasks.deleteMany({});
    sandbox.restore();
  });

  suite('with bot and repo', () => {
    let task: tasks & { task_items: task_items[] }, postStub: SinonStub;

    setup(async () => {
      postStub = sandbox.stub(axios, 'post').resolves({});

      task = await app.prisma.tasks.create({
        data: {
          org_id: org.id,
          title: 'Delete tokens when user revokes Github App',
          token: 'example',
          task_items: {
            create: [
              {
                actor_user_id: user.id,
                type: task_item.message,
                data: {
                  content:
                    '* Delete the github refresh token stored in DB\n* Clear all sessions for the user',
                },
              },
              {
                type: 'repo',
                repo_id: secondRepo.id,
              },
              {
                type: 'bot',
                bot_id: secondBot.id,
              },
            ],
          },
        },
        include: {
          task_items: true,
        },
      });

      await sendTaskWebhook.handler?.(app, {
        taskId: task.id,
      });
    });

    test('should call bot webhook_url', () => {
      const body = {
        id: `whmsg_task_created_${task.id}`,
        type: 'task.created',
        data: {
          task: {
            id: task.id,
            token: 'example',
            title: 'Delete tokens when user revokes Github App',
            items: [
              {
                id: task.task_items[0].id,
                type: 'message',
                data: {
                  content:
                    '* Delete the github refresh token stored in DB\n* Clear all sessions for the user',
                },
              },
            ],
          },
          repo: {
            id: secondRepo.id,
            name: 'repo-1',
            is_private: false,
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

      assert.equal(postStub.firstCall.args[0], 'http://test.local/webhook/1');
      assert.deepNestedInclude(JSON.parse(postStub.firstCall.args[1]), body);
      assert.match(timestamp, regexTimestamp);

      assert.deepEqual(postStub.firstCall.args[2], {
        headers: {
          'content-type': 'application/json',
          'webhook-id': body.id,
          'webhook-timestamp': Math.floor(new Date(timestamp).getTime() / 1000),
          'webhook-signature': generateWebhookSignature(
            'atma_whsec_1',
            timestamp,
            body,
          ),
          'x-automa-server-host': 'http://localhost:8080',
        },
      });
    });
  });

  suite('without bot and repo', () => {
    let task: tasks & { task_items: task_items[] }, postStub: SinonStub;

    setup(async () => {
      postStub = sandbox.stub(axios, 'post').resolves({});

      await app.prisma.repos.updateMany({
        data: {
          is_private: true,
        },
      });

      task = await app.prisma.tasks.create({
        data: {
          org_id: org.id,
          title: 'Delete tokens when user revokes Github App',
          token: 'example',
          task_items: {
            create: [
              {
                type: task_item.message,
                data: {
                  content:
                    '* Delete the github refresh token stored in DB\n* Clear all sessions for the user',
                },
              },
            ],
          },
        },
        include: {
          task_items: true,
        },
      });
    });

    teardown(async () => {
      await app.prisma.repos.updateMany({
        data: {
          is_private: false,
          is_archived: false,
          has_installation: true,
        },
      });
    });

    suite('with normal repo', () => {
      setup(async () => {
        await sendTaskWebhook.handler?.(app, {
          taskId: task.id,
        });
      });

      test('should assign repo to task', async () => {
        const taskItems = await app.prisma.task_items.findMany({
          where: {
            task_id: task.id,
            type: 'repo',
          },
        });

        assert.lengthOf(taskItems, 1);

        assert.deepEqual(taskItems[0].data, {});
        assert.equal(taskItems[0].repo_id, repo.id);
      });

      test('should assign bot to task', async () => {
        const taskItems = await app.prisma.task_items.findMany({
          where: {
            task_id: task.id,
            type: 'bot',
          },
        });

        assert.lengthOf(taskItems, 1);

        assert.deepEqual(taskItems[0].data, {});
        assert.equal(taskItems[0].bot_id, bot.id);
      });

      test('should call bot webhook_url', () => {
        const body = {
          id: `whmsg_task_created_${task.id}`,
          type: 'task.created',
          data: {
            task: {
              id: task.id,
              token: 'example',
              title: 'Delete tokens when user revokes Github App',
              items: [
                {
                  id: task.task_items[0].id,
                  type: 'message',
                  data: {
                    content:
                      '* Delete the github refresh token stored in DB\n* Clear all sessions for the user',
                  },
                },
              ],
            },
            repo: {
              id: repo.id,
              name: 'repo-0',
              is_private: true,
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
            'webhook-id': `whmsg_task_created_${task.id}`,
            'webhook-timestamp': Math.floor(
              new Date(timestamp).getTime() / 1000,
            ),
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

    suite('with only archived repo', () => {
      setup(async () => {
        await app.prisma.repos.updateMany({
          data: {
            is_archived: true,
          },
        });

        await sendTaskWebhook.handler?.(app, {
          taskId: task.id,
        });
      });

      test('should not assign repo to task', async () => {
        const taskItems = await app.prisma.task_items.findMany({
          where: {
            task_id: task.id,
            type: 'repo',
          },
        });

        assert.lengthOf(taskItems, 0);
      });

      test('should not call bot webhook_url', () => {
        assert.equal(postStub.callCount, 0);
      });
    });

    suite('with only uninstalled repo', () => {
      setup(async () => {
        await app.prisma.repos.updateMany({
          data: {
            has_installation: false,
          },
        });

        await sendTaskWebhook.handler?.(app, {
          taskId: task.id,
        });
      });

      test('should not assign repo to task', async () => {
        const taskItems = await app.prisma.task_items.findMany({
          where: {
            task_id: task.id,
            type: 'repo',
          },
        });

        assert.lengthOf(taskItems, 0);
      });

      test('should not call bot webhook_url', () => {
        assert.equal(postStub.callCount, 0);
      });
    });
  });

  suite('with linear origin', () => {
    let task: tasks & { task_items: task_items[] }, body: any;
    let postStub: SinonStub, issueStub: SinonStub, commentsStub: SinonStub;
    let userStub: SinonStub, externalUserStub: SinonStub;

    setup(async () => {
      postStub = sandbox.stub(axios, 'post').resolves({});

      task = await app.prisma.tasks.create({
        data: {
          org_id: org.id,
          title: 'Delete tokens when user revokes Github App',
          token: 'example',
          task_items: {
            create: [
              {
                type: task_item.origin,
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
              },
              {
                type: 'repo',
                repo_id: secondRepo.id,
              },
              {
                type: 'bot',
                bot_id: secondBot.id,
              },
            ],
          },
        },
        include: {
          task_items: true,
        },
      });

      userStub = sandbox
        .stub()
        .resolves({ name: 'Pavan Kumar Sunkara' } as User)
        .onThirdCall()
        .resolves({ name: 'Automa' } as User);

      externalUserStub = sandbox.stub().resolves({ name: 'John Doe' } as User);

      commentsStub = sandbox.stub().resolves({
        nodes: [
          {
            body: 'This is a comment',
            get user() {
              return userStub();
            },
          },
          {
            body: 'This is another comment',
            get externalUser() {
              return externalUserStub();
            },
          },
          {
            body: '@automa bot=bot-0 repo=repo-0',
            get user() {
              return userStub();
            },
          },
          {
            body: 'Created task: https://console.automa.app/automa/tasks/123',
            get user() {
              return userStub();
            },
          },
        ],
      } as unknown as CommentConnection);

      issueStub = sandbox.stub(LinearClient.prototype, 'issue').resolves({
        id: 'f2f72e62-b1a4-46c3-b605-0962d24792d8',
        identifier: 'PRO-93',
        title: 'Delete tokens when user revokes Github App',
        description:
          '* Delete the github refresh token stored in DB\n* Clear all sessions for the user',
        comments: commentsStub,
      } as unknown as Issue);

      body = {
        id: `whmsg_task_created_${task.id}`,
        type: 'task.created',
        data: {
          task: {
            id: task.id,
            token: 'example',
            title: 'Delete tokens when user revokes Github App',
            items: [
              {
                id: task.task_items[0].id,
                type: task_item.origin,
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
              },
            ],
          },
          repo: {
            id: secondRepo.id,
            name: 'repo-1',
            is_private: false,
          },
          org: {
            id: org.id,
            name: 'org-0',
            provider_type: 'github',
          },
        },
      };
    });

    suite('with disconnected linear integration', () => {
      setup(async () => {
        await sendTaskWebhook.handler?.(app, {
          taskId: task.id,
        });
      });

      test('should not fetch comments', () => {
        assert.equal(issueStub.callCount, 0);
        assert.equal(commentsStub.callCount, 0);
        assert.equal(userStub.callCount, 0);
        assert.equal(externalUserStub.callCount, 0);
      });

      test('should call bot webhook_url', () => {
        assert.equal(postStub.callCount, 1);

        const timestamp = JSON.parse(postStub.firstCall.args[1]).timestamp;

        assert.equal(postStub.firstCall.args[0], 'http://test.local/webhook/1');
        assert.deepNestedInclude(JSON.parse(postStub.firstCall.args[1]), body);
        assert.match(timestamp, regexTimestamp);

        assert.deepEqual(postStub.firstCall.args[2], {
          headers: {
            'content-type': 'application/json',
            'webhook-id': body.id,
            'webhook-timestamp': Math.floor(
              new Date(timestamp).getTime() / 1000,
            ),
            'webhook-signature': generateWebhookSignature(
              'atma_whsec_1',
              timestamp,
              body,
            ),
            'x-automa-server-host': 'http://localhost:8080',
          },
        });
      });
    });

    suite('with connected linear integration', () => {
      suiteSetup(async () => {
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
      });

      suiteTeardown(async () => {
        await app.prisma.integrations.deleteMany();
      });

      suite('without error', () => {
        setup(async () => {
          await sendTaskWebhook.handler?.(app, {
            taskId: task.id,
          });
        });

        test('should fetch comments', () => {
          assert.equal(issueStub.callCount, 1);
          assert.equal(
            issueStub.firstCall.args[0],
            'f2f72e62-b1a4-46c3-b605-0962d24792d8',
          );

          assert.equal(commentsStub.callCount, 1);
          assert.isEmpty(commentsStub.firstCall.args);

          assert.equal(userStub.callCount, 3);
          assert.equal(externalUserStub.callCount, 1);
        });

        test('should call bot webhook_url', () => {
          body = body = {
            id: `whmsg_task_created_${task.id}`,
            type: 'task.created',
            data: {
              task: {
                id: task.id,
                token: 'example',
                title: 'Delete tokens when user revokes Github App',
                items: [
                  {
                    id: task.task_items[0].id,
                    type: task_item.origin,
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
                      issueComments: [
                        {
                          body: 'This is a comment',
                          userName: 'Pavan Kumar Sunkara',
                        },
                        {
                          body: 'This is another comment',
                          userName: 'John Doe',
                        },
                      ],
                    },
                  },
                ],
              },
              repo: {
                id: secondRepo.id,
                name: 'repo-1',
                is_private: false,
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

          assert.equal(
            postStub.firstCall.args[0],
            'http://test.local/webhook/1',
          );
          assert.deepNestedInclude(
            JSON.parse(postStub.firstCall.args[1]),
            body,
          );
          assert.match(timestamp, regexTimestamp);

          assert.deepEqual(postStub.firstCall.args[2], {
            headers: {
              'content-type': 'application/json',
              'webhook-id': body.id,
              'webhook-timestamp': Math.floor(
                new Date(timestamp).getTime() / 1000,
              ),
              'webhook-signature': generateWebhookSignature(
                'atma_whsec_1',
                timestamp,
                body,
              ),
              'x-automa-server-host': 'http://localhost:8080',
            },
          });
        });
      });

      suite('with linear error', () => {
        setup(async () => {
          commentsStub.rejects(new Error('Linear API error'));

          await sendTaskWebhook.handler?.(app, {
            taskId: task.id,
          });
        });

        test('should try to fetch comments', () => {
          assert.equal(issueStub.callCount, 1);
          assert.equal(
            issueStub.firstCall.args[0],
            'f2f72e62-b1a4-46c3-b605-0962d24792d8',
          );

          assert.equal(commentsStub.callCount, 1);
          assert.isEmpty(commentsStub.firstCall.args);

          assert.equal(userStub.callCount, 0);
          assert.equal(externalUserStub.callCount, 0);
        });

        test('should call bot webhook_url', () => {
          assert.equal(postStub.callCount, 1);

          const timestamp = JSON.parse(postStub.firstCall.args[1]).timestamp;

          assert.equal(
            postStub.firstCall.args[0],
            'http://test.local/webhook/1',
          );
          assert.deepNestedInclude(
            JSON.parse(postStub.firstCall.args[1]),
            body,
          );
          assert.match(timestamp, regexTimestamp);

          assert.deepEqual(postStub.firstCall.args[2], {
            headers: {
              'content-type': 'application/json',
              'webhook-id': body.id,
              'webhook-timestamp': Math.floor(
                new Date(timestamp).getTime() / 1000,
              ),
              'webhook-signature': generateWebhookSignature(
                'atma_whsec_1',
                timestamp,
                body,
              ),
              'x-automa-server-host': 'http://localhost:8080',
            },
          });
        });
      });
    });
  });
});
