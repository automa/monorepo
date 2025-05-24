import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';

import { orgs, repos } from '@automa/prisma';

import {
  graphql,
  seedOrgs,
  seedRepos,
  seedUserOrgs,
  seedUsers,
  server,
} from '../utils';

suite('graphql repos', () => {
  let app: FastifyInstance;
  let org: orgs, secondOrg: orgs, nonMemberOrg: orgs;
  let repo: repos;

  suiteSetup(async () => {
    app = await server();

    const [user] = await seedUsers(app, 1);
    [org, secondOrg, nonMemberOrg] = await seedOrgs(app, 3);
    await seedUserOrgs(app, user, [org, secondOrg]);
    const repos = await seedRepos(
      app,
      [org, org, org, secondOrg, nonMemberOrg],
      [org],
    );
    repo = repos[0];

    await app.prisma.repos.update({
      where: {
        id: repo.id,
      },
      data: {
        is_private: true,
        is_archived: true,
      },
    });

    repos
      .filter(({ org_id }) => org_id === org.id)
      .filter(({ name }) => name !== 'repo-1')
      .forEach(async (repo) => {
        await app.prisma.user_repos.create({
          data: {
            user_id: user.id,
            repo_id: repo.id,
          },
        });
      });

    app.addHook('preValidation', async (request) => {
      request.session.userId = user.id;
    });
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.prisma.users.deleteMany();
    await app.close();
  });

  suite('query repos', () => {
    suite('member org', () => {
      let response: LightMyRequestResponse;

      suiteSetup(async () => {
        const tasks = await app.prisma.tasks.createManyAndReturn({
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
              org_id: org.id,
              state: 'submitted',
            },
            {
              title: 'task-3',
              token: '3',
              org_id: org.id,
              state: 'completed',
            },
            {
              title: 'task-4',
              token: '4',
              org_id: org.id,
              state: 'skipped',
            },
            {
              title: 'task-5',
              token: '5',
              org_id: org.id,
              state: 'failed',
            },
          ],
        });

        await app.prisma.task_items.createMany({
          data: tasks
            .filter((task) => task.org_id === org.id)
            .map((task) => ({
              task_id: task.id,
              repo_id: repo.id,
              type: 'repo',
            })),
        });
      });

      suiteTeardown(async () => {
        await app.prisma.tasks.deleteMany();
      });

      setup(async () => {
        response = await graphql(
          app,
          `
            query repos($org_id: Int!) {
              repos(org_id: $org_id) {
                id
                name
                created_at
                provider_id
                is_private
                is_archived
                has_installation
                org {
                  name
                  provider_name
                }
                tasks_count {
                  state
                  count
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

      test('should have no errors', () => {
        const { errors } = response.json();

        assert.isUndefined(errors);
      });

      test('should return repos for org user can access', () => {
        const {
          data: { repos },
        } = response.json();

        assert.lengthOf(repos, 3);

        assert.isNumber(repos[0].id);
        assert.equal(repos[0].name, 'repo-0');
        assert.equal(repos[0].org.name, org.name);
        assert.equal(repos[0].org.provider_name, org.name);
        assert.isString(repos[0].created_at);
        assert.equal(repos[0].provider_id, '0');
        assert.isTrue(repos[0].is_private);
        assert.isTrue(repos[0].is_archived);
        assert.isTrue(repos[0].has_installation);
        assert.lengthOf(repos[0].tasks_count, 5);
        assert.deepInclude(repos[0].tasks_count, {
          state: 'started',
          count: 1,
        });
        assert.deepInclude(repos[0].tasks_count, {
          state: 'submitted',
          count: 1,
        });
        assert.deepInclude(repos[0].tasks_count, {
          state: 'completed',
          count: 1,
        });
        assert.deepInclude(repos[0].tasks_count, {
          state: 'skipped',
          count: 1,
        });
        assert.deepInclude(repos[0].tasks_count, {
          state: 'failed',
          count: 1,
        });

        assert.isNumber(repos[1].id);
        assert.equal(repos[1].name, 'repo-2');
        assert.equal(repos[1].org.name, org.name);
        assert.equal(repos[1].org.provider_name, org.name);
        assert.isString(repos[1].created_at);
        assert.equal(repos[1].provider_id, '2');
        assert.isFalse(repos[1].is_private);
        assert.isFalse(repos[1].is_archived);
        assert.isTrue(repos[1].has_installation);
        assert.lengthOf(repos[1].tasks_count, 0);

        assert.isNumber(repos[2].id);
        assert.equal(repos[2].name, 'repo-5');
        assert.equal(repos[2].org.name, org.name);
        assert.equal(repos[2].org.provider_name, org.name);
        assert.isString(repos[2].created_at);
        assert.equal(repos[2].provider_id, '5');
        assert.isFalse(repos[2].is_private);
        assert.isFalse(repos[2].is_archived);
        assert.isFalse(repos[2].has_installation);
        assert.lengthOf(repos[2].tasks_count, 0);
      });
    });

    test('for non-member org should fail', async () => {
      const response = await graphql(
        app,
        `
          query repos($org_id: Int!) {
            repos(org_id: $org_id) {
              id
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

    test('should return only non-archived repos with filter.is_archived = false', async () => {
      const response = await graphql(
        app,
        `
          query repos($org_id: Int!, $filter: ReposFilter) {
            repos(org_id: $org_id, filter: $filter) {
              name
              is_archived
            }
          }
        `,
        {
          org_id: org.id,
          filter: {
            is_archived: false,
          },
        },
      );

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        data: { repos },
      } = response.json();

      assert.lengthOf(repos, 2);

      assert.equal(repos[0].name, 'repo-2');
      assert.isFalse(repos[0].is_archived);

      assert.equal(repos[1].name, 'repo-5');
      assert.isFalse(repos[1].is_archived);
    });

    test('should return only archived repos with filter.is_archived = true', async () => {
      const response = await graphql(
        app,
        `
          query repos($org_id: Int!, $filter: ReposFilter) {
            repos(org_id: $org_id, filter: $filter) {
              name
              is_archived
            }
          }
        `,
        {
          org_id: org.id,
          filter: {
            is_archived: true,
          },
        },
      );

      assert.equal(response.statusCode, 200);

      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      const {
        data: { repos },
      } = response.json();

      assert.lengthOf(repos, 1);

      assert.equal(repos[0].name, 'repo-0');
      assert.isTrue(repos[0].is_archived);
    });
  });

  suite('query repo', () => {
    suite('member org', () => {
      let response: LightMyRequestResponse;

      setup(async () => {
        response = await graphql(
          app,
          `
            query repo($org_id: Int!, $name: String!) {
              repo(org_id: $org_id, name: $name) {
                id
                name
              }
            }
          `,
          {
            org_id: org.id,
            name: repo.name,
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

      test('should return requested repo', async () => {
        const {
          data: { repo },
        } = response.json();

        assert.isNumber(repo.id);
        assert.equal(repo.name, 'repo-0');
      });
    });

    test('for non-member org should fail', async () => {
      const response = await graphql(
        app,
        `
          query repo($org_id: Int!, $name: String!) {
            repo(org_id: $org_id, name: $name) {
              id
              name
            }
          }
        `,
        {
          org_id: nonMemberOrg.id,
          name: repo.name,
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
