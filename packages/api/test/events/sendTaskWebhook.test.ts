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
  users,
} from '@automa/prisma';

import {
  generateSignature,
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
  let repo: repos, bot: bots;

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();

    [user] = await seedUsers(app, 1);
    [org, nonMemberOrg] = await seedOrgs(app, 2);
    [repo] = await seedRepos(app, [org]);
    [bot] = await seedBots(app, [nonMemberOrg]);

    await app.prisma.bot_installations.createMany({
      data: [
        {
          bot_id: bot.id,
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
          title: 'Write test for handling "example" event',
          token: 'example',
          task_items: {
            create: [
              {
                actor_user_id: user.id,
                type: task_item.message,
                data: {
                  content: 'Write test for handling "example" event',
                },
              },
              {
                type: 'repo',
                repo_id: repo.id,
              },
              {
                type: 'bot',
                bot_id: bot.id,
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
        task: {
          id: task.id,
          token: 'example',
          title: 'Write test for handling "example" event',
          items: [
            {
              id: task.task_items[0].id,
              type: 'message',
              data: {
                content: 'Write test for handling "example" event',
              },
            },
          ],
        },
        repo: {
          id: repo.id,
          name: 'repo-0',
          is_private: false,
        },
        org: {
          id: org.id,
          name: 'org-0',
          provider_type: 'github',
        },
      };

      assert.equal(postStub.callCount, 1);
      assert.equal(postStub.firstCall.args[0], 'https://example.com/webhook/0');
      assert.deepEqual(postStub.firstCall.args[1], body);
      assert.deepEqual(postStub.firstCall.args[2], {
        headers: {
          'x-automa-server-host': 'http://localhost:8080',
          'x-automa-signature': generateSignature(
            'atma_whsec_0',
            JSON.stringify(body),
          ),
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
          title: 'Write test for handling "example" event',
          token: 'example',
          task_items: {
            create: [
              {
                type: task_item.message,
                data: {
                  content:
                    '- Delete the github refresh token stored in DB\n- Clear all sessions for the user',
                },
              },
              {
                type: task_item.origin,
                data: {
                  integration: 'linear',
                  organizationId: '6cb652a9-8f3f-40b7-9695-df81e161fe07',
                  organizationName: 'Automa',
                  teamId: 'b7e7eb03-9d67-41b3-a268-84c14a6757d6',
                  userId: '5611201a-9594-4407-9490-731894376791',
                  issueId: 'f2f72e62-b1a4-46c3-b605-0962d24792d8',
                  issueIdentifier: 'PRO-93',
                  issueTitle: 'Write test for handling "example" event',
                  commentId: 'a41c315a-3130-4c8e-a9ca-6e9219c156b7',
                  url: 'https://linear.app/automa/issue/PRO-93/handle-when-user-revokes-github-app#comment-a41c315a',
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
          task: {
            id: task.id,
            token: 'example',
            title: 'Write test for handling "example" event',
            items: [
              {
                id: task.task_items[0].id,
                type: 'message',
                data: {
                  content:
                    '- Delete the github refresh token stored in DB\n- Clear all sessions for the user',
                },
              },
              {
                id: task.task_items[1].id,
                type: 'origin',
                data: {
                  url: 'https://linear.app/automa/issue/PRO-93/handle-when-user-revokes-github-app#comment-a41c315a',
                  teamId: 'b7e7eb03-9d67-41b3-a268-84c14a6757d6',
                  userId: '5611201a-9594-4407-9490-731894376791',
                  issueId: 'f2f72e62-b1a4-46c3-b605-0962d24792d8',
                  commentId: 'a41c315a-3130-4c8e-a9ca-6e9219c156b7',
                  issueTitle: 'Write test for handling "example" event',
                  integration: 'linear',
                  organizationId: '6cb652a9-8f3f-40b7-9695-df81e161fe07',
                  issueIdentifier: 'PRO-93',
                  organizationName: 'Automa',
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
        };

        assert.equal(postStub.callCount, 1);
        assert.equal(
          postStub.firstCall.args[0],
          'https://example.com/webhook/0',
        );
        assert.deepEqual(postStub.firstCall.args[1], body);
        assert.deepEqual(postStub.firstCall.args[2], {
          headers: {
            'x-automa-server-host': 'http://localhost:8080',
            'x-automa-signature': generateSignature(
              'atma_whsec_0',
              JSON.stringify(body),
            ),
          },
        });
      });
    });

    suite('with only archived repo', () => {
      setup(async () => {
        await app.prisma.repos.update({
          where: {
            id: repo.id,
          },
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
        await app.prisma.repos.update({
          where: {
            id: repo.id,
          },
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
});
