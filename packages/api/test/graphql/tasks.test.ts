import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';

import {
  bots,
  orgs,
  repos,
  task_activities,
  tasks,
  users,
} from '@automa/prisma';

import {
  graphql,
  seedBots,
  seedOrgs,
  seedRepos,
  seedUserOrgs,
  seedUsers,
  server,
} from '../utils';

suite('graphql tasks', () => {
  let app: FastifyInstance, user: users;
  let org: orgs, secondOrg: orgs, nonMemberOrg: orgs;
  let repo: repos, bot: bots;

  suiteSetup(async () => {
    app = await server();

    [user] = await seedUsers(app, 1);
    [org, secondOrg, nonMemberOrg] = await seedOrgs(app, 3);
    await seedUserOrgs(app, user, [org, secondOrg]);
    [repo] = await seedRepos(app, [org]);
    [bot] = await seedBots(app, [nonMemberOrg]);

    app.addHook('preValidation', async (request) => {
      request.session.userId = user.id;
    });
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.prisma.users.deleteMany();
    await app.close();
  });

  suite('query tasks', () => {
    suiteSetup(async () => {
      await app.prisma.tasks.createMany({
        data: [
          {
            title: 'task-0',
            token: '0',
            org_id: org.id,
          },
          {
            title: 'task-1',
            token: '1',
            org_id: secondOrg.id,
          },
          {
            title: 'task-2',
            token: '2',
            org_id: nonMemberOrg.id,
          },
          {
            title: 'task-3',
            token: '3',
            is_scheduled: true,
            org_id: org.id,
            state: 'completed',
          },
        ],
      });
    });

    suiteTeardown(async () => {
      await app.prisma.tasks.deleteMany();
    });

    suite('member org', () => {
      let response: LightMyRequestResponse;

      setup(async () => {
        response = await graphql(
          app,
          `
            query tasks($org_id: Int!) {
              tasks(org_id: $org_id) {
                id
                title
                state
                created_at
              }
            }
          `,
          {
            org_id: org.id,
          },
        );
      });

      test('should be successful', () => {
        assert.equal(response.statusCode, 200);

        assert.equal(
          response.headers['content-type'],
          'application/json; charset=utf-8',
        );
      });

      test('should have no errors', async () => {
        const { errors } = response.json();

        assert.isUndefined(errors);
      });

      test("should return requested org's tasks", async () => {
        const {
          data: { tasks },
        } = response.json();

        assert.lengthOf(tasks, 2);

        assert.isNumber(tasks[0].id);
        assert.equal(tasks[0].title, 'task-3');
        assert.isString(tasks[0].created_at);
        assert.equal(tasks[0].state, 'completed');

        assert.isNumber(tasks[1].id);
        assert.equal(tasks[1].title, 'task-0');
        assert.isString(tasks[1].created_at);
        assert.equal(tasks[1].state, 'started');
      });
    });

    test('for non-member org should fail', async () => {
      const response = await graphql(
        app,
        `
          query tasks($org_id: Int!) {
            tasks(org_id: $org_id) {
              id
              title
            }
          }
        `,
        {
          org_id: nonMemberOrg.id,
        },
      );

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.equal(errors[0].message, 'Not Found');
      assert.equal(errors[0].extensions.code, 'NOT_FOUND');
    });

    test('should return only non-scheduled tasks with filter.is_scheduled = false', async () => {
      const response = await graphql(
        app,
        `
          query tasks($org_id: Int!, $filter: TasksFilter) {
            tasks(org_id: $org_id, filter: $filter) {
              id
              title
              is_scheduled
            }
          }
        `,
        {
          org_id: org.id,
          filter: {
            is_scheduled: false,
          },
        },
      );

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        data: { tasks },
      } = response.json();

      assert.lengthOf(tasks, 1);

      assert.equal(tasks[0].title, 'task-0');
      assert.isFalse(tasks[0].is_scheduled);
    });

    suite('items', () => {
      let response: LightMyRequestResponse, activity: task_activities;

      suiteSetup(async () => {
        const task = await app.prisma.tasks.findFirstOrThrow({
          where: {
            title: 'task-3',
          },
        });

        activity = await app.prisma.task_activities.create({
          data: {
            type: 'state',
            from_state: 'submitted',
            to_state: 'completed',
          },
        });

        await app.prisma.task_items.createMany({
          data: [
            {
              task_id: task.id,
              type: 'message',
              data: { content: 'task-3' },
            },
            {
              task_id: task.id,
              type: 'origin',
              data: {
                integration: 'linear',
                issueIdentifier: 'DEMO-123',
                issueTitle: 'Demo Issue',
              },
              actor_user_id: user.id,
            },
            {
              task_id: task.id,
              type: 'repo',
              repo_id: repo.id,
            },
            {
              task_id: task.id,
              type: 'bot',
              bot_id: bot.id,
            },
            {
              task_id: task.id,
              type: 'activity',
              task_activity_id: activity.id,
            },
          ],
        });

        response = await graphql(
          app,
          `
            query tasks($org_id: Int!) {
              tasks(org_id: $org_id) {
                id
                title
                items {
                  type
                  data
                  created_at
                  actor_user {
                    id
                  }
                  repo {
                    id
                  }
                  bot {
                    id
                    org {
                      id
                    }
                  }
                  activity {
                    id
                    type
                    from_state
                    to_state
                  }
                }
              }
            }
          `,
          {
            org_id: org.id,
          },
        );
      });

      test('should be successful', () => {
        assert.equal(response.statusCode, 200);

        assert.equal(
          response.headers['content-type'],
          'application/json; charset=utf-8',
        );
      });

      test('should have no errors', async () => {
        const { errors } = response.json();

        assert.isUndefined(errors);
      });

      test('should return task items', async () => {
        const {
          data: { tasks },
        } = response.json();

        assert.lengthOf(tasks, 2);

        const { items } = tasks[0];

        assert.lengthOf(items, 5);

        assert.equal(items[0].type, 'message');
        assert.isString(items[0].created_at);
        assert.deepEqual(items[0].data, { content: 'task-3' });
        assert.isNull(items[0].actor_user);
        assert.isNull(items[4].repo);
        assert.isNull(items[4].bot);

        assert.equal(items[1].type, 'origin');
        assert.isString(items[1].created_at);
        assert.deepEqual(items[1].data, {
          integration: 'linear',
          issueIdentifier: 'DEMO-123',
          issueTitle: 'Demo Issue',
        });
        assert.equal(items[1].actor_user.id, user.id);
        assert.isNull(items[4].repo);
        assert.isNull(items[4].bot);

        assert.equal(items[2].type, 'repo');
        assert.isString(items[2].created_at);
        assert.deepEqual(items[2].data, {});
        assert.isNull(items[2].actor_user);
        assert.equal(items[2].repo.id, repo.id);
        assert.isNull(items[4].bot);

        assert.equal(items[3].type, 'bot');
        assert.isString(items[3].created_at);
        assert.deepEqual(items[3].data, {});
        assert.isNull(items[3].actor_user);
        assert.isNull(items[4].repo);
        assert.equal(items[3].bot.id, bot.id);
        assert.equal(items[3].bot.org.id, nonMemberOrg.id);

        assert.equal(items[4].type, 'activity');
        assert.isString(items[4].created_at);
        assert.deepEqual(items[4].data, {});
        assert.isNull(items[4].actor_user);
        assert.isNull(items[4].repo);
        assert.isNull(items[4].bot);
        assert.deepEqual(items[4].activity, {
          id: activity.id,
          type: 'state',
          from_state: 'submitted',
          to_state: 'completed',
        });
      });

      test('should restrict PublicBot fields for task item bot', async () => {
        const response = await graphql(
          app,
          `
            query tasks($org_id: Int!) {
              tasks(org_id: $org_id) {
                id
                title
                items {
                  bot {
                    id
                    webhook_url
                  }
                }
              }
            }
          `,
        );

        assert.equal(response.statusCode, 400);

        assert.equal(
          response.headers['content-type'],
          'application/json; charset=utf-8',
        );

        const { errors } = response.json();

        assert.lengthOf(errors, 1);
        assert.include(
          errors[0].message,
          'Cannot query field "webhook_url" on type "PublicBot".',
        );
        assert.equal(errors[0].extensions.code, 'GRAPHQL_VALIDATION_FAILED');
      });
    });
  });

  suite('query task', () => {
    let task: tasks;

    suiteSetup(async () => {
      task = await app.prisma.tasks.create({
        data: {
          title: 'task-0',
          token: '0',
          org_id: org.id,
        },
      });
    });

    suiteTeardown(async () => {
      await app.prisma.tasks.deleteMany();
    });

    suite('member org', () => {
      let response: LightMyRequestResponse;

      setup(async () => {
        response = await graphql(
          app,
          `
            query task($org_id: Int!, $id: Int!) {
              task(org_id: $org_id, id: $id) {
                id
                title
                state
                created_at
              }
            }
          `,
          {
            org_id: org.id,
            id: task.id,
          },
        );
      });

      test('should be successful', () => {
        assert.equal(response.statusCode, 200);

        assert.equal(
          response.headers['content-type'],
          'application/json; charset=utf-8',
        );
      });

      test('should have no errors', async () => {
        const { errors } = response.json();

        assert.isUndefined(errors);
      });

      test('should return requested task', async () => {
        const {
          data: { task },
        } = response.json();

        assert.isNumber(task.id);
        assert.equal(task.title, 'task-0');
        assert.isString(task.created_at);
        assert.equal(task.state, 'started');
      });
    });

    test('for non-member org should fail', async () => {
      const response = await graphql(
        app,
        `
          query task($org_id: Int!, $id: Int!) {
            task(org_id: $org_id, id: $id) {
              id
              title
            }
          }
        `,
        {
          org_id: nonMemberOrg.id,
          id: task.id,
        },
      );

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.equal(errors[0].message, 'Not Found');
      assert.equal(errors[0].extensions.code, 'NOT_FOUND');
    });
  });

  suite('mutation taskCreate', () => {
    suite('with valid input', () => {
      let response: LightMyRequestResponse;

      setup(async () => {
        response = await taskCreate(app, org.id, {
          content:
            'Send an analytics event when user clicks on "Create Task" button',
        });
      });

      teardown(async () => {
        await app.prisma.tasks.deleteMany();
      });

      test('should succeed', async () => {
        assert.equal(response.statusCode, 200);

        assert.equal(
          response.headers['content-type'],
          'application/json; charset=utf-8',
        );
      });

      test('should return task', async () => {
        const {
          errors,
          data: { taskCreate: task },
        } = response.json();

        assert.isUndefined(errors);

        assert.isNumber(task.id);
        assert.equal(
          task.title,
          'Send an analytics event when user clicks on "Create Task" button',
        );
        assert.isString(task.created_at);
      });

      test('should create task', async () => {
        const [task] = await app.prisma.tasks.findMany();

        assert.deepOwnInclude(task, {
          org_id: org.id,
          title:
            'Send an analytics event when user clicks on "Create Task" button',
          is_scheduled: false,
          state: 'started',
        });
        assert.isDefined(task.token);
      });

      test('should create task item', async () => {
        const [taskItem] = await app.prisma.task_items.findMany();

        assert.equal(taskItem.type, 'message');
        assert.deepEqual(taskItem.data, {
          content:
            'Send an analytics event when user clicks on "Create Task" button',
        });
        assert.equal(taskItem.actor_user_id, user.id);
      });
    });

    test('non-member org should fail', async () => {
      const response = await taskCreate(app, nonMemberOrg.id, {
        content:
          'Send an analytics event when user clicks on "Create Task" button',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.equal(errors[0].message, 'Not Found');
      assert.equal(errors[0].extensions.code, 'NOT_FOUND');

      const count = await app.prisma.tasks.count();

      assert.equal(count, 0);
    });

    test('with missing content should fail', async () => {
      const response = await taskCreate(app, org.id, {});

      assert.equal(response.statusCode, 400);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.include(
        errors[0].message,
        'Field "content" of required type "String!" was not provided',
      );
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');

      const count = await app.prisma.tasks.count();

      assert.equal(count, 0);
    });

    test('with short content should fail', async () => {
      const response = await taskCreate(app, org.id, {
        content: 'abc',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();

      assert.lengthOf(errors, 1);
      assert.include(errors[0].message, 'Unprocessable Entity');
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');

      assert.deepEqual(errors[0].extensions.errors, [
        {
          code: 'too_small',
          message: 'String must contain at least 5 character(s)',
          path: ['content'],
          type: 'string',
          inclusive: true,
          exact: false,
          minimum: 5,
        },
      ]);

      const count = await app.prisma.tasks.count();

      assert.equal(count, 0);
    });

    test('with content containing only spaces should fail', async () => {
      const response = await taskCreate(app, org.id, {
        content: '     ',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const { errors } = response.json();
      assert.lengthOf(errors, 1);
      assert.include(errors[0].message, 'Unprocessable Entity');
      assert.equal(errors[0].extensions.code, 'BAD_USER_INPUT');

      assert.deepEqual(errors[0].extensions.errors, [
        {
          code: 'too_small',
          message: 'String must contain at least 5 character(s)',
          path: ['content'],
          type: 'string',
          inclusive: true,
          exact: false,
          minimum: 5,
        },
      ]);

      const count = await app.prisma.tasks.count();

      assert.equal(count, 0);
    });
  });
});

const taskCreate = (app: FastifyInstance, orgId: number, input: any) =>
  graphql(
    app,
    `
      mutation taskCreate($org_id: Int!, $input: TaskMessageInput!) {
        taskCreate(org_id: $org_id, input: $input) {
          id
          title
          created_at
        }
      }
    `,
    {
      org_id: orgId,
      input,
    },
  );
