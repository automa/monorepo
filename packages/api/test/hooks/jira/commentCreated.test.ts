import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import axios from 'axios';

import { bots, orgs, repos, users } from '@automa/prisma';

import { seedBots, seedOrgs, seedRepos, seedUsers, server } from '../../utils';

import { callWithFixture } from './utils';

suite('jira hook comment_created event', () => {
  let app: FastifyInstance, response: LightMyRequestResponse;
  let user: users, org: orgs, repo: repos, bot: bots, secondBot: bots;
  let sandbox: SinonSandbox, issueStub: SinonStub, createCommentStub: SinonStub;

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
        integration_type: 'jira',
        secrets: {
          access_token: 'abcdef',
          refresh_token: 'zyxwvu',
        },
        config: {
          id: '6cb652a9-8f3f-40b7-9695-df81e161fe07',
          url: 'https://automa.atlassian.net',
          name: 'Automa',
          webhook_id: 123,
        },
        created_by: user.id,
      },
    });

    issueStub = sandbox.stub(axios, 'get').resolves({
      data: {
        id: '10281',
        key: 'PRO-93',
        fields: {
          summary: 'Delete tokens when user revokes Github App',
          description: {
            version: 1,
            type: 'doc',
            content: [
              {
                type: 'bulletList',
                content: [
                  {
                    type: 'listItem',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: 'Delete the github refresh token stored in DB',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'listItem',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: 'Clear all sessions for the user',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          issuetype: {
            id: '10002',
            name: 'Task',
          },
          project: {
            id: '10003',
            name: 'Product',
            key: 'PRO',
          },
        },
      },
    });

    createCommentStub = sandbox.stub(axios, 'post').resolves({});
  });

  teardown(async () => {
    sandbox.restore();
    await app.prisma.integrations.deleteMany();
    await app.prisma.tasks.deleteMany();
  });

  suite('create', () => {
    setup(async () => {
      response = await callWithFixture(app, 'comment_created', 'create');
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
            '  * Delete the github refresh token stored in DB\n  * Clear all sessions for the user',
        },
        actor_user_id: null,
      });
      assert.deepOwnInclude(taskItems[1], {
        type: 'origin',
        data: {
          integration: 'jira',
          organizationId: '6cb652a9-8f3f-40b7-9695-df81e161fe07',
          organizationUrl: 'https://automa.atlassian.net',
          organizationName: 'Automa',
          projectId: '10003',
          projectKey: 'PRO',
          projectName: 'Product',
          issuetypeId: '10002',
          issuetypeName: 'Task',
          userId: '712020:3dd57004-4041-4aca-ab80-ced34cc711ab',
          issueId: '10281',
          issueKey: 'PRO-93',
          issueTitle: 'Delete tokens when user revokes Github App',
          commentId: '10237',
        },
        actor_user_id: null,
      });
    });

    test('should get information about issue', async () => {
      assert.equal(issueStub.callCount, 1);
      assert.equal(
        issueStub.firstCall.args[0],
        'https://api.atlassian.com/ex/jira/6cb652a9-8f3f-40b7-9695-df81e161fe07/rest/api/3/issue/10281',
      );
      assert.deepEqual(issueStub.firstCall.args[1], {
        headers: {
          Authorization: 'Bearer abcdef',
        },
      });
    });

    test('should create comment about the task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(createCommentStub.callCount, 1);
      assert.equal(
        createCommentStub.firstCall.args[0],
        'https://api.atlassian.com/ex/jira/6cb652a9-8f3f-40b7-9695-df81e161fe07/rest/api/3/issue/10281/comment',
      );
      assert.deepEqual(createCommentStub.firstCall.args[1], {
        body: {
          version: 1,
          type: 'doc',
          content: [
            {
              content: [
                {
                  text: 'Created task: ',
                  type: 'text',
                },
                {
                  marks: [
                    {
                      attrs: {
                        href: `http://localhost:3000/org-0/tasks/${tasks[0].id}`,
                        title: 'Automa Task',
                      },
                      type: 'link',
                    },
                  ],
                  text: `http://localhost:3000/org-0/tasks/${tasks[0].id}`,
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
        },
      });
      assert.deepEqual(createCommentStub.firstCall.args[2], {
        headers: {
          Authorization: 'Bearer abcdef',
        },
      });
    });
  });

  suite('create with bot specified', () => {
    setup(async () => {
      response = await callWithFixture(app, 'comment_created', 'create_bot');
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
        'https://api.atlassian.com/ex/jira/6cb652a9-8f3f-40b7-9695-df81e161fe07/rest/api/3/issue/10281',
      );
      assert.deepEqual(issueStub.firstCall.args[1], {
        headers: {
          Authorization: 'Bearer abcdef',
        },
      });
    });

    test('should create comment about the task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(createCommentStub.callCount, 1);
      assert.equal(
        createCommentStub.firstCall.args[0],
        'https://api.atlassian.com/ex/jira/6cb652a9-8f3f-40b7-9695-df81e161fe07/rest/api/3/issue/10281/comment',
      );
      assert.deepEqual(createCommentStub.firstCall.args[1], {
        body: {
          version: 1,
          type: 'doc',
          content: [
            {
              content: [
                {
                  text: 'Created task: ',
                  type: 'text',
                },
                {
                  marks: [
                    {
                      attrs: {
                        href: `http://localhost:3000/org-0/tasks/${tasks[0].id}`,
                        title: 'Automa Task',
                      },
                      type: 'link',
                    },
                  ],
                  text: `http://localhost:3000/org-0/tasks/${tasks[0].id}`,
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
        },
      });
      assert.deepEqual(createCommentStub.firstCall.args[2], {
        headers: {
          Authorization: 'Bearer abcdef',
        },
      });
    });
  });

  suite('create with wrong bot specified', () => {
    setup(async () => {
      response = await callWithFixture(
        app,
        'comment_created',
        'create_bot_bad',
      );
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
        'https://api.atlassian.com/ex/jira/6cb652a9-8f3f-40b7-9695-df81e161fe07/rest/api/3/issue/10281',
      );
      assert.deepEqual(issueStub.firstCall.args[1], {
        headers: {
          Authorization: 'Bearer abcdef',
        },
      });
    });

    test('should create comment about the task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(createCommentStub.callCount, 1);
      assert.equal(
        createCommentStub.firstCall.args[0],
        'https://api.atlassian.com/ex/jira/6cb652a9-8f3f-40b7-9695-df81e161fe07/rest/api/3/issue/10281/comment',
      );
      assert.deepEqual(createCommentStub.firstCall.args[1], {
        body: {
          version: 1,
          type: 'doc',
          content: [
            {
              content: [
                {
                  text: 'Created task: ',
                  type: 'text',
                },
                {
                  marks: [
                    {
                      attrs: {
                        href: `http://localhost:3000/org-0/tasks/${tasks[0].id}`,
                        title: 'Automa Task',
                      },
                      type: 'link',
                    },
                  ],
                  text: `http://localhost:3000/org-0/tasks/${tasks[0].id}`,
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
            {
              content: [
                {
                  text: 'We encountered the following issues while creating the task:',
                  type: 'text',
                },
                {
                  content: [
                    {
                      content: [
                        {
                          content: [
                            {
                              text: 'Bot `bot-2` not found. Using AI to select bot.',
                              type: 'text',
                            },
                          ],
                          type: 'paragraph',
                        },
                      ],
                      type: 'listItem',
                    },
                  ],
                  type: 'bulletList',
                },
              ],
              type: 'paragraph',
            },
          ],
        },
      });
      assert.deepEqual(createCommentStub.firstCall.args[2], {
        headers: {
          Authorization: 'Bearer abcdef',
        },
      });
    });
  });

  suite('create with repo specified', () => {
    setup(async () => {
      response = await callWithFixture(app, 'comment_created', 'create_repo');
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
        'https://api.atlassian.com/ex/jira/6cb652a9-8f3f-40b7-9695-df81e161fe07/rest/api/3/issue/10281',
      );
      assert.deepEqual(issueStub.firstCall.args[1], {
        headers: {
          Authorization: 'Bearer abcdef',
        },
      });
    });

    test('should create comment about the task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(createCommentStub.callCount, 1);
      assert.equal(
        createCommentStub.firstCall.args[0],
        'https://api.atlassian.com/ex/jira/6cb652a9-8f3f-40b7-9695-df81e161fe07/rest/api/3/issue/10281/comment',
      );
      assert.deepEqual(createCommentStub.firstCall.args[1], {
        body: {
          version: 1,
          type: 'doc',
          content: [
            {
              content: [
                {
                  text: 'Created task: ',
                  type: 'text',
                },
                {
                  marks: [
                    {
                      attrs: {
                        href: `http://localhost:3000/org-0/tasks/${tasks[0].id}`,
                        title: 'Automa Task',
                      },
                      type: 'link',
                    },
                  ],
                  text: `http://localhost:3000/org-0/tasks/${tasks[0].id}`,
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
        },
      });
      assert.deepEqual(createCommentStub.firstCall.args[2], {
        headers: {
          Authorization: 'Bearer abcdef',
        },
      });
    });
  });

  suite('create with wrong repo specified', () => {
    setup(async () => {
      response = await callWithFixture(
        app,
        'comment_created',
        'create_repo_bad',
      );
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
        'https://api.atlassian.com/ex/jira/6cb652a9-8f3f-40b7-9695-df81e161fe07/rest/api/3/issue/10281',
      );
      assert.deepEqual(issueStub.firstCall.args[1], {
        headers: {
          Authorization: 'Bearer abcdef',
        },
      });
    });

    test('should create comment about the task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(createCommentStub.callCount, 1);
      assert.equal(
        createCommentStub.firstCall.args[0],
        'https://api.atlassian.com/ex/jira/6cb652a9-8f3f-40b7-9695-df81e161fe07/rest/api/3/issue/10281/comment',
      );
      assert.deepEqual(createCommentStub.firstCall.args[1], {
        body: {
          version: 1,
          type: 'doc',
          content: [
            {
              content: [
                {
                  text: 'Created task: ',
                  type: 'text',
                },
                {
                  marks: [
                    {
                      attrs: {
                        href: `http://localhost:3000/org-0/tasks/${tasks[0].id}`,
                        title: 'Automa Task',
                      },
                      type: 'link',
                    },
                  ],
                  text: `http://localhost:3000/org-0/tasks/${tasks[0].id}`,
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
            {
              content: [
                {
                  text: 'We encountered the following issues while creating the task:',
                  type: 'text',
                },
                {
                  content: [
                    {
                      content: [
                        {
                          content: [
                            {
                              text: 'Repo `repo-2` not found. Using AI to select repo.',
                              type: 'text',
                            },
                          ],
                          type: 'paragraph',
                        },
                      ],
                      type: 'listItem',
                    },
                  ],
                  type: 'bulletList',
                },
              ],
              type: 'paragraph',
            },
          ],
        },
      });
      assert.deepEqual(createCommentStub.firstCall.args[2], {
        headers: {
          Authorization: 'Bearer abcdef',
        },
      });
    });
  });

  suite('create with non-automa comment', () => {
    setup(async () => {
      response = await callWithFixture(app, 'comment_created', 'create_ignore');
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
            integration_type: 'jira',
          },
        },
        data: {
          config: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            url: 'https://workspace.atlassian.net',
            name: 'Workspace',
            webhook_id: 123,
          },
        },
      });

      response = await callWithFixture(app, 'comment_created', 'create');
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

    test('should not be able to create any comment', async () => {
      assert.equal(createCommentStub.callCount, 0);
    });
  });
});
