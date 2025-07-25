import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import axios from 'axios';

import { CauseType } from '@automa/common';
import { orgs, repos } from '@automa/prisma';

import { server, sleep, waitFor } from '../../utils';

import { callWithFixture, encodeSettings } from './utils';

suite('github hook installation event', () => {
  let app: FastifyInstance, response: LightMyRequestResponse;
  let sandbox: SinonSandbox, postStub: SinonStub, getStub: SinonStub;
  let syncOrgStub: SinonStub, syncRepoStub: SinonStub;

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();
  });

  suiteTeardown(async () => {
    await app.close();
  });

  setup(() => {
    syncOrgStub = sandbox
      .stub(app.events.syncGithubOrgUsers, 'publish')
      .resolves();
    syncRepoStub = sandbox
      .stub(app.events.syncGithubRepoUsers, 'publish')
      .resolves();

    postStub = sandbox
      .stub(axios, 'post')
      .resolves({ data: { token: 'abcdef' } });

    getStub = sandbox.stub(axios, 'get');
    getStub.withArgs('/repos/automa/automa').resolves({
      data: {
        id: 592296270,
        name: 'automa',
        full_name: 'automa/automa',
        private: true,
        archived: false,
        default_branch: 'master',
      },
    });
    getStub.withArgs('/repos/automa/automa/branches/master').resolves({
      data: {
        commit: { sha: 'a2006e2015d93931f00fc3a8a04d24d66b7059da' },
      },
    });
    getStub
      .withArgs('/repos/automa/automa/contents/automa.json')
      .resolves(encodeSettings('dependency'));

    // @ts-ignore
    sandbox.stub(axios, 'create').returns({
      get: getStub,
    });
  });

  teardown(async () => {
    sandbox.restore();
    await app.prisma.orgs.deleteMany();
  });

  suite('created', () => {
    let orgs: orgs[];

    setup(async () => {
      response = await callWithFixture(app, 'installation', 'created');
      orgs = await app.prisma.orgs.findMany();
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should create organization', async () => {
      assert.equal(orgs.length, 1);
      assert.deepOwnInclude(orgs[0], {
        name: 'automa',
        provider_type: 'github',
        provider_id: '65730741',
        provider_name: 'automa',
        is_user: false,
        has_installation: true,
        github_installation_id: 40335964,
      });
    });

    test('should get information about repository and settings', async () => {
      assert.equal(postStub.callCount, 1);
      assert.equal(
        postStub.firstCall.args[0],
        'https://api.github.com/app/installations/40335964/access_tokens',
      );

      await waitFor(() => getStub.callCount === 3);

      assert.equal(getStub.callCount, 3);
      assert.equal(getStub.withArgs('/repos/automa/automa').callCount, 1);
      assert.equal(
        getStub.withArgs('/repos/automa/automa/branches/master').callCount,
        1,
      );
      assert.equal(
        getStub.withArgs('/repos/automa/automa/contents/automa.json').callCount,
        1,
      );
    });

    test('should sync github org users', async () => {
      assert.equal(syncOrgStub.callCount, 1);

      assert.deepEqual(syncOrgStub.firstCall.args, [
        orgs[0].id,
        { orgId: orgs[0].id },
      ]);
    });

    suite('and repository', () => {
      let repos: repos[];

      setup(async () => {
        repos = await app.prisma.repos.findMany({
          where: {
            orgs: {
              provider_type: 'github',
              provider_id: '65730741',
            },
          },
        });
      });

      test('should be created', async () => {
        assert.equal(repos.length, 1);
        assert.deepOwnInclude(repos[0], {
          name: 'automa',
          provider_id: '592296270',
          is_private: true,
          is_archived: false,
          has_installation: true,
        });
      });

      test('should sync github repo users', async () => {
        assert.equal(syncRepoStub.callCount, 1);

        assert.deepEqual(syncRepoStub.firstCall.args, [
          repos[0].id,
          { repoId: repos[0].id },
        ]);
      });

      test('and settings should be created', async () => {
        await sleep(1000);

        const settings = await app.prisma.repo_settings.findMany({
          where: {
            repo_id: repos[0].id,
          },
          orderBy: {
            created_at: 'desc',
          },
        });

        assert.equal(settings.length, 1);

        assert.deepOwnInclude(settings[0], {
          repo_id: repos[0].id,
          cause: CauseType.APP_INSTALLED_WITH_REPOSITORY,
          commit: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
          validation_errors: null,
        });
        assert.deepEqual(settings[0].settings, { bots: { dependency: {} } });
      });
    });

    suite('and deleted', () => {
      setup(async () => {
        response = await callWithFixture(app, 'installation', 'deleted');
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should mark organization as inactive', async () => {
        const orgs = await app.prisma.orgs.findMany();

        assert.equal(orgs.length, 1);
        assert.deepOwnInclude(orgs[0], {
          name: 'automa',
          provider_type: 'github',
          provider_id: '65730741',
          provider_name: 'automa',
          is_user: false,
          has_installation: false,
          github_installation_id: null,
        });
      });

      test('should mark repository as inactive', async () => {
        const repos = await app.prisma.repos.findMany({
          where: {
            orgs: {
              provider_type: 'github',
              provider_id: '65730741',
            },
          },
        });

        assert.equal(repos.length, 1);
        assert.deepOwnInclude(repos[0], {
          name: 'automa',
          provider_id: '592296270',
          is_private: true,
          is_archived: false,
          has_installation: false,
        });
      });

      suite('and created', () => {
        setup(async () => {
          sandbox.resetHistory();
          response = await callWithFixture(
            app,
            'installation',
            'created_another_installation',
          );
          orgs = await app.prisma.orgs.findMany();
        });

        test('should return 200', async () => {
          assert.equal(response.statusCode, 200);
        });

        test('should mark organization as active and update it', async () => {
          assert.equal(orgs.length, 1);
          assert.deepOwnInclude(orgs[0], {
            name: 'automa',
            provider_type: 'github',
            provider_id: '65730741',
            provider_name: 'automa-app',
            is_user: true,
            has_installation: true,
            github_installation_id: 40401522,
          });
        });

        test('should get information about repository', async () => {
          assert.equal(postStub.callCount, 1);
          assert.equal(
            postStub.firstCall.args[0],
            'https://api.github.com/app/installations/40401522/access_tokens',
          );

          await waitFor(() => getStub.callCount === 3);

          assert.equal(getStub.callCount, 3);
          assert.equal(getStub.withArgs('/repos/automa/automa').callCount, 1);
          assert.equal(
            getStub.withArgs('/repos/automa/automa/branches/master').callCount,
            1,
          );
          assert.equal(
            getStub.withArgs('/repos/automa/automa/contents/automa.json')
              .callCount,
            1,
          );
        });

        test('should sync github org users', async () => {
          assert.equal(syncOrgStub.callCount, 1);

          assert.deepEqual(syncOrgStub.firstCall.args, [
            orgs[0].id,
            { orgId: orgs[0].id },
          ]);
        });

        suite('and repository', () => {
          let repos: repos[];

          setup(async () => {
            repos = await app.prisma.repos.findMany({
              where: {
                orgs: {
                  provider_type: 'github',
                  provider_id: '65730741',
                },
              },
            });
          });

          test('should be marked active', async () => {
            assert.equal(repos.length, 1);
            assert.deepOwnInclude(repos[0], {
              name: 'automa',
              provider_id: '592296270',
              is_private: true,
              is_archived: false,
              has_installation: true,
            });
          });

          test('should sync github repo users', async () => {
            assert.equal(syncRepoStub.callCount, 1);

            assert.deepEqual(syncRepoStub.firstCall.args, [
              repos[0].id,
              { repoId: repos[0].id },
            ]);
          });

          test('should create settings for repository', async () => {
            await sleep(1000);

            const settings = await app.prisma.repo_settings.findMany({
              where: {
                repo_id: repos[0].id,
              },
              orderBy: {
                created_at: 'desc',
              },
            });

            assert.equal(settings.length, 2);

            assert.deepOwnInclude(settings[0], {
              repo_id: repos[0].id,
              cause: CauseType.APP_INSTALLED_WITH_REPOSITORY,
              commit: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
              validation_errors: null,
            });
            assert.deepEqual(settings[0].settings, {
              bots: { dependency: {} },
            });

            assert.deepOwnInclude(settings[1], {
              repo_id: repos[0].id,
              cause: CauseType.APP_INSTALLED_WITH_REPOSITORY,
              commit: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
              validation_errors: null,
            });
            assert.deepEqual(settings[1].settings, {
              bots: { dependency: {} },
            });
          });
        });
      });
    });

    suite('and suspend', () => {
      setup(async () => {
        response = await callWithFixture(app, 'installation', 'suspend');
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should mark organization as inactive', async () => {
        const orgs = await app.prisma.orgs.findMany();

        assert.equal(orgs.length, 1);
        assert.deepOwnInclude(orgs[0], {
          name: 'automa',
          provider_type: 'github',
          provider_id: '65730741',
          provider_name: 'automa',
          is_user: false,
          has_installation: false,
          github_installation_id: 40335964,
        });
      });

      test('should mark repository as inactive', async () => {
        const repos = await app.prisma.repos.findMany({
          where: {
            orgs: {
              provider_type: 'github',
              provider_id: '65730741',
            },
          },
        });

        assert.equal(repos.length, 1);
        assert.deepOwnInclude(repos[0], {
          name: 'automa',
          provider_id: '592296270',
          is_private: true,
          is_archived: false,
          has_installation: false,
        });
      });

      suite('and unsuspend', () => {
        setup(async () => {
          sandbox.resetHistory();

          // Make sure to have 2 pages of repositories
          getStub.withArgs('/installation/repositories').resolves({
            config: {},
            headers: {
              link: '</installation/repositories?page=2>; rel="next"',
            },
            data: {
              repositories: [
                {
                  id: 592296270,
                  name: 'automa',
                  full_name: 'automa/automa',
                  private: false,
                  archived: true,
                  default_branch: 'master',
                },
              ],
            },
          });
          getStub.withArgs('/installation/repositories?page=2').resolves({
            config: {},
            headers: {},
            data: {
              repositories: [
                {
                  id: 674157076,
                  name: 'tmp',
                  full_name: 'automa/tmp',
                  private: true,
                  archived: false,
                  default_branch: 'production',
                },
              ],
            },
          });
          getStub.withArgs('/repos/automa/tmp/branches/production').resolves({
            data: {
              commit: { sha: 'a2006e2015d93931f00fc3a8a04d24d66b7059da' },
            },
          });
          getStub
            .withArgs('/repos/automa/tmp/contents/automa.json')
            .resolves(encodeSettings('dependency'));

          response = await callWithFixture(app, 'installation', 'unsuspend');
          orgs = await app.prisma.orgs.findMany();
        });

        test('should return 200', async () => {
          assert.equal(response.statusCode, 200);
        });

        test('should get information about all repositories and settings', async () => {
          assert.equal(postStub.callCount, 1);
          assert.equal(
            postStub.firstCall.args[0],
            'https://api.github.com/app/installations/40335964/access_tokens',
          );

          await waitFor(() => getStub.callCount === 6);

          assert.equal(getStub.callCount, 6);
          assert.equal(
            getStub.withArgs('/installation/repositories').callCount,
            1,
          );
          assert.equal(
            getStub.withArgs('/repos/automa/automa/branches/master').callCount,
            1,
          );
          assert.equal(
            getStub.withArgs('/repos/automa/automa/contents/automa.json')
              .callCount,
            1,
          );
          assert.equal(
            getStub.withArgs('/installation/repositories?page=2').callCount,
            1,
          );
          assert.equal(
            getStub.withArgs('/repos/automa/tmp/branches/production').callCount,
            1,
          );
          assert.equal(
            getStub.withArgs('/repos/automa/tmp/contents/automa.json')
              .callCount,
            1,
          );
        });

        test('should mark organization as active and update provider name', async () => {
          assert.equal(orgs.length, 1);
          assert.deepOwnInclude(orgs[0], {
            name: 'automa',
            provider_type: 'github',
            provider_id: '65730741',
            provider_name: 'automa-app',
            is_user: false,
            has_installation: true,
            github_installation_id: 40335964,
          });
        });

        test('should sync github org users', async () => {
          assert.equal(syncOrgStub.callCount, 1);

          assert.deepEqual(syncOrgStub.firstCall.args, [
            orgs[0].id,
            { orgId: orgs[0].id },
          ]);
        });

        suite('and checking repositories', () => {
          let repos: repos[];

          setup(async () => {
            repos = await app.prisma.repos.findMany({
              where: {
                orgs: {
                  provider_type: 'github',
                  provider_id: '65730741',
                },
              },
              orderBy: {
                id: 'asc',
              },
            });
          });

          test('should create another repository', () => {
            assert.equal(repos.length, 2);
            assert.deepOwnInclude(repos[1], {
              name: 'tmp',
              provider_id: '674157076',
              is_private: true,
              is_archived: false,
              has_installation: true,
            });
          });

          test('should mark existing repository as active', () => {
            assert.deepOwnInclude(repos[0], {
              name: 'automa',
              provider_id: '592296270',
              has_installation: true,
            });
          });

          test('should mark existing repository as archived & public', async () => {
            assert.deepOwnInclude(repos[0], {
              name: 'automa',
              provider_id: '592296270',
              is_private: false,
              is_archived: true,
            });
          });

          test('should sync github repo users', async () => {
            assert.equal(syncRepoStub.callCount, 2);

            assert.deepEqual(syncRepoStub.args, [
              [repos[0].id, { repoId: repos[0].id }],
              [repos[1].id, { repoId: repos[1].id }],
            ]);
          });

          test('should create settings for repositories', async () => {
            await sleep(1000);

            let settings = await app.prisma.repo_settings.findMany({
              where: {
                repo_id: repos[0].id,
              },
              orderBy: {
                created_at: 'desc',
              },
            });

            assert.equal(settings.length, 2);

            assert.deepOwnInclude(settings[0], {
              repo_id: repos[0].id,
              cause: CauseType.REPOSITORY_SYNCED_AFTER_UNSUSPENDED,
              commit: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
              validation_errors: null,
            });
            assert.deepEqual(settings[0].settings, {
              bots: { dependency: {} },
            });

            assert.deepOwnInclude(settings[1], {
              repo_id: repos[0].id,
              cause: CauseType.APP_INSTALLED_WITH_REPOSITORY,
              commit: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
              validation_errors: null,
            });
            assert.deepEqual(settings[1].settings, {
              bots: { dependency: {} },
            });

            settings = await app.prisma.repo_settings.findMany({
              where: {
                repo_id: repos[1].id,
              },
              orderBy: {
                created_at: 'desc',
              },
            });

            assert.equal(settings.length, 1);

            assert.deepOwnInclude(settings[0], {
              repo_id: repos[1].id,
              cause: CauseType.REPOSITORY_SYNCED_AFTER_UNSUSPENDED,
              commit: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
              validation_errors: null,
            });
            assert.deepEqual(settings[0].settings, {
              bots: { dependency: {} },
            });
          });
        });
      });
    });
  });
});
