// Tests to check the constraints of the database schema

import { FastifyInstance } from 'fastify';
import { assert } from 'chai';

import { bots, orgs, Prisma, repos, users } from '@automa/prisma';

import { seedBots, seedOrgs, seedRepos, seedUsers, server } from './utils';

suite('db', () => {
  let app: FastifyInstance;
  let user: users, secondUser: users, org: orgs, repo: repos, bot: bots;

  suiteSetup(async () => {
    app = await server();

    [user, secondUser] = await seedUsers(app, 2);
    [org] = await seedOrgs(app, 1);
    [repo] = await seedRepos(app, [org]);
    [bot] = await seedBots(app, [], [org]);
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.prisma.users.deleteMany();
    await app.close();
  });

  suite('users', () => {
    test('email is unique', async () => {
      try {
        await seedUsers(app, 1);
        assert.fail('expected to throw');
      } catch (err) {
        const error = err as Prisma.PrismaClientKnownRequestError;

        assert.equal(error.code, 'P2002');
        assert.equal(error.meta?.modelName, ['users']);
        assert.deepEqual(error.meta?.target, ['email']);
      }
    });
  });

  suite('user_providers', () => {
    test('provider_type is unique per user', async () => {
      try {
        await app.prisma.user_providers.create({
          data: {
            user_id: user.id,
            provider_type: 'github',
            provider_id: '0',
            provider_email: 'user-0@example.com',
          },
        });
        await app.prisma.user_providers.create({
          data: {
            user_id: user.id,
            provider_type: 'github',
            provider_id: '1',
            provider_email: 'user-1@example.com',
          },
        });

        assert.fail('expected to throw');
      } catch (err) {
        const error = err as Prisma.PrismaClientKnownRequestError;

        assert.equal(error.code, 'P2002');
        assert.equal(error.meta?.modelName, ['user_providers']);
        assert.deepEqual(error.meta?.target, ['user_id', 'provider_type']);
      }
    });

    test('provider_id is unique per provider_type', async () => {
      try {
        await app.prisma.user_providers.create({
          data: {
            user_id: secondUser.id,
            provider_type: 'github',
            provider_id: '0',
            provider_email: 'user-1@example.com',
          },
        });

        assert.fail('expected to throw');
      } catch (err) {
        const error = err as Prisma.PrismaClientKnownRequestError;

        assert.equal(error.code, 'P2002');
        assert.equal(error.meta?.modelName, ['user_providers']);
        assert.deepEqual(error.meta?.target, ['provider_type', 'provider_id']);
      }
    });
  });

  suite('orgs', () => {
    test('name is unique', async () => {
      try {
        await seedOrgs(app, 1);
        assert.fail('expected to throw');
      } catch (err) {
        const error = err as Prisma.PrismaClientKnownRequestError;

        assert.equal(error.code, 'P2002');
        assert.equal(error.meta?.modelName, ['orgs']);
        assert.deepEqual(error.meta?.target, ['name']);
      }
    });

    test('provider_id is unique per provider_type', async () => {
      try {
        await app.prisma.orgs.create({
          data: {
            name: 'org-1',
            provider_type: 'github',
            provider_id: '0',
            provider_name: 'org-1',
          },
        });

        assert.fail('expected to throw');
      } catch (err) {
        const error = err as Prisma.PrismaClientKnownRequestError;

        assert.equal(error.code, 'P2002');
        assert.equal(error.meta?.modelName, ['orgs']);
        assert.deepEqual(error.meta?.target, ['provider_type', 'provider_id']);
      }
    });

    test('github_installation_id is unique', async () => {
      try {
        await app.prisma.orgs.update({
          where: { id: org.id },
          data: { github_installation_id: 1 },
        });

        await app.prisma.orgs.create({
          data: {
            name: 'org-2',
            provider_type: 'github',
            provider_id: '2',
            provider_name: 'org-2',
            github_installation_id: 1,
          },
        });

        assert.fail('expected to throw');
      } catch (err) {
        const error = err as Prisma.PrismaClientKnownRequestError;

        assert.equal(error.code, 'P2002');
        assert.equal(error.meta?.modelName, ['orgs']);
        assert.deepEqual(error.meta?.target, ['github_installation_id']);
      }
    });
  });

  suite('repos', () => {
    test('provider_id is unique per org', async () => {
      try {
        await seedRepos(app, [org]);
        assert.fail('expected to throw');
      } catch (err) {
        const error = err as Prisma.PrismaClientKnownRequestError;

        assert.equal(error.code, 'P2002');
        assert.equal(error.meta?.modelName, ['repos']);
        assert.deepEqual(error.meta?.target, ['org_id', 'provider_id']);
      }
    });
  });

  suite('user_orgs', () => {
    test('user_id and org_id is unique', async () => {
      try {
        await app.prisma.user_orgs.create({
          data: {
            user_id: user.id,
            org_id: org.id,
          },
        });
        await app.prisma.user_orgs.create({
          data: {
            user_id: user.id,
            org_id: org.id,
          },
        });

        assert.fail('expected to throw');
      } catch (err) {
        const error = err as Prisma.PrismaClientKnownRequestError;

        assert.equal(error.code, 'P2002');
        assert.equal(error.meta?.modelName, ['user_orgs']);
        assert.deepEqual(error.meta?.target, ['user_id', 'org_id']);
      }
    });
  });

  suite('user_repos', () => {
    test('user_id and org_id is unique', async () => {
      try {
        await app.prisma.user_repos.create({
          data: {
            user_id: user.id,
            repo_id: repo.id,
          },
        });
        await app.prisma.user_repos.create({
          data: {
            user_id: user.id,
            repo_id: repo.id,
          },
        });

        assert.fail('expected to throw');
      } catch (err) {
        const error = err as Prisma.PrismaClientKnownRequestError;

        assert.equal(error.code, 'P2002');
        assert.equal(error.meta?.modelName, ['user_repos']);
        assert.deepEqual(error.meta?.target, ['user_id', 'repo_id']);
      }
    });
  });

  suite('bots', () => {
    test('name is unique per org', async () => {
      try {
        await seedBots(app, [org]);
        assert.fail('expected to throw');
      } catch (err) {
        const error = err as Prisma.PrismaClientKnownRequestError;

        assert.equal(error.code, 'P2002');
        assert.equal(error.meta?.modelName, ['bots']);
        assert.deepEqual(error.meta?.target, ['org_id', 'name']);
      }
    });
  });

  suite('bot_installations', () => {
    test('bot_id and org_id is unique', async () => {
      try {
        await app.prisma.bot_installations.create({
          data: {
            bot_id: bot.id,
            org_id: org.id,
          },
        });
        await app.prisma.bot_installations.create({
          data: {
            bot_id: bot.id,
            org_id: org.id,
          },
        });

        assert.fail('expected to throw');
      } catch (err) {
        const error = err as Prisma.PrismaClientKnownRequestError;

        assert.equal(error.code, 'P2002');
        assert.equal(error.meta?.modelName, ['bot_installations']);
        assert.deepEqual(error.meta?.target, ['bot_id', 'org_id']);
      }
    });
  });

  suite('integrations', () => {
    test('type is unique per org', async () => {
      try {
        await app.prisma.integrations.create({
          data: {
            org_id: org.id,
            type: 'github',
            created_by: user.id,
          },
        });
        await app.prisma.integrations.create({
          data: {
            org_id: org.id,
            type: 'github',
            created_by: user.id,
          },
        });

        assert.fail('expected to throw');
      } catch (err) {
        const error = err as Prisma.PrismaClientKnownRequestError;

        assert.equal(error.code, 'P2002');
        assert.equal(error.meta?.modelName, ['integrations']);
        assert.deepEqual(error.meta?.target, ['org_id', 'type']);
      }
    });
  });

  suite('task_activities', () => {
    suite('state_activity', () => {
      test('missing all', async () => {
        try {
          await app.prisma.task_activities.create({
            data: {
              type: 'state',
            },
          });

          assert.fail('expected to throw');
        } catch (err) {
          const error = err as Prisma.PrismaClientUnknownRequestError;

          assert.include(
            error.message,
            'new row for relation \\"task_activities\\" violates check constraint \\"state_activity\\"',
          );
        }
      });

      test('missing from_state', async () => {
        try {
          await app.prisma.task_activities.create({
            data: {
              type: 'state',
              to_state: 'completed',
            },
          });

          assert.fail('expected to throw');
        } catch (err) {
          const error = err as Prisma.PrismaClientUnknownRequestError;

          assert.include(
            error.message,
            'new row for relation \\"task_activities\\" violates check constraint \\"state_activity\\"',
          );
        }
      });

      test('missing to_state', async () => {
        try {
          await app.prisma.task_activities.create({
            data: {
              type: 'state',
              from_state: 'submitted',
            },
          });

          assert.fail('expected to throw');
        } catch (err) {
          const error = err as Prisma.PrismaClientUnknownRequestError;

          assert.include(
            error.message,
            'new row for relation \\"task_activities\\" violates check constraint \\"state_activity\\"',
          );
        }
      });
    });
  });

  suite('task_items', () => {
    test('repo_item', async () => {
      try {
        await app.prisma.task_items.create({
          data: {
            task_id: 1,
            type: 'repo',
          },
        });

        assert.fail('expected to throw');
      } catch (err) {
        const error = err as Prisma.PrismaClientUnknownRequestError;

        assert.include(
          error.message,
          'new row for relation \\"task_items\\" violates check constraint \\"repo_item\\"',
        );
      }
    });

    test('bot_item', async () => {
      try {
        await app.prisma.task_items.create({
          data: {
            task_id: 1,
            type: 'bot',
          },
        });

        assert.fail('expected to throw');
      } catch (err) {
        const error = err as Prisma.PrismaClientUnknownRequestError;

        assert.include(
          error.message,
          'new row for relation \\"task_items\\" violates check constraint \\"bot_item\\"',
        );
      }
    });

    suite('proposal_item', () => {
      test('missing all', async () => {
        try {
          await app.prisma.task_items.create({
            data: {
              task_id: 1,
              type: 'proposal',
            },
          });

          assert.fail('expected to throw');
        } catch (err) {
          const error = err as Prisma.PrismaClientUnknownRequestError;

          assert.include(
            error.message,
            'new row for relation \\"task_items\\" violates check constraint \\"proposal_item\\"',
          );
        }
      });

      test('missing bot', async () => {
        try {
          await app.prisma.task_items.create({
            data: {
              task_id: 1,
              type: 'proposal',
              repo_id: repo.id,
            },
          });

          assert.fail('expected to throw');
        } catch (err) {
          const error = err as Prisma.PrismaClientUnknownRequestError;

          assert.include(
            error.message,
            'new row for relation \\"task_items\\" violates check constraint \\"proposal_item\\"',
          );
        }
      });

      test('missing repo', async () => {
        try {
          await app.prisma.task_items.create({
            data: {
              task_id: 1,
              type: 'proposal',
              bot_id: bot.id,
            },
          });

          assert.fail('expected to throw');
        } catch (err) {
          const error = err as Prisma.PrismaClientUnknownRequestError;

          assert.include(
            error.message,
            'new row for relation \\"task_items\\" violates check constraint \\"proposal_item\\"',
          );
        }
      });
    });

    test('activity_item', async () => {
      try {
        await app.prisma.task_items.create({
          data: {
            task_id: 1,
            type: 'activity',
          },
        });

        assert.fail('expected to throw');
      } catch (err) {
        const error = err as Prisma.PrismaClientUnknownRequestError;

        assert.include(
          error.message,
          'new row for relation \\"task_items\\" violates check constraint \\"activity_item\\"',
        );
      }
    });
  });
});
