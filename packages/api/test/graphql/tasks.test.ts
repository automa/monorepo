import { assert } from 'chai';
import { FastifyInstance, LightMyRequestResponse } from 'fastify';

import { orgs, users } from '@automa/prisma';

import { server, graphql, seedUsers, seedOrgs } from '../utils';

suite.only('graphql tasks', () => {
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

    app.addHook('preHandler', async (request) => {
      request.user = user;
    });
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.prisma.users.deleteMany();
    await app.close();
  });

  suite('query tasks', () => {
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

      test("should return requested org's tasks", async () => {
        const {
          data: { tasks },
        } = response.json();

        assert.lengthOf(tasks, 2);

        assert.isNumber(tasks[0].id);
        assert.equal(tasks[0].title, 'task-0');
        assert.isString(tasks[0].created_at);
        assert.equal(tasks[0].author.id, user.id);

        assert.isNumber(tasks[1].id);
        assert.equal(tasks[1].title, 'task-3');
        assert.isString(tasks[1].created_at);
        assert.isNull(tasks[1].author);
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
});
