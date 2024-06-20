import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';

import { orgs, users } from '@automa/prisma';

import { graphql, seedOrgs, seedUsers, server } from '../utils';

suite('graphql tasks', () => {
  let app: FastifyInstance,
    user: users,
    org: orgs,
    secondOrg: orgs,
    nonMemberOrg: orgs;

  suiteSetup(async () => {
    app = await server();

    [user] = await seedUsers(app, 1);
    [org, secondOrg, nonMemberOrg] = await seedOrgs(app, 3);

    await app.prisma.user_orgs.createMany({
      data: [
        {
          org_id: org.id,
          user_id: user.id,
        },
        {
          org_id: secondOrg.id,
          user_id: user.id,
        },
      ],
    });

    app.addHook('preHandler', async (request) => {
      request.userId = user.id;
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
            org_id: org.id,
            created_by: user.id,
          },
          {
            title: 'task-1',
            org_id: secondOrg.id,
            created_by: user.id,
          },
          {
            title: 'task-2',
            org_id: nonMemberOrg.id,
            created_by: user.id,
          },
          {
            title: 'task-3',
            org_id: org.id,
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
                created_at
                author {
                  id
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

      test("should return requested org's tasks", async () => {
        const {
          data: { tasks },
        } = response.json();

        assert.lengthOf(tasks, 2);

        assert.isNumber(tasks[0].id);
        assert.equal(tasks[0].title, 'task-3');
        assert.isString(tasks[0].created_at);
        assert.isNull(tasks[0].author);

        assert.isNumber(tasks[1].id);
        assert.equal(tasks[1].title, 'task-0');
        assert.isString(tasks[1].created_at);
        assert.equal(tasks[1].author.id, user.id);
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
  });

  suite('mutation taskCreate', () => {
    teardown(async () => {
      await app.prisma.tasks.deleteMany();
    });

    test('with valid input should succeed', async () => {
      const response = await taskCreate(app, org.id, {
        content:
          'Send an analytic event when user clicks on "Create Task" button',
      });

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        errors,
        data: { taskCreate: task },
      } = response.json();

      assert.isUndefined(errors);

      assert.isNumber(task.id);
      assert.equal(
        task.title,
        'Send an analytic event when user clicks on "Create Task" button',
      );
      assert.isString(task.created_at);

      const count = await app.prisma.tasks.count();

      assert.equal(count, 1);
    });

    test('non-member org should fail', async () => {
      const response = await taskCreate(app, nonMemberOrg.id, {
        content:
          'Send an analytic event when user clicks on "Create Task" button',
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
