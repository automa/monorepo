import { assert } from 'chai';
import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import axios from 'axios';
import { SinonSandbox, SinonStub, createSandbox } from 'sinon';

import { CauseType } from '@automa/common';
import { repos } from '@automa/prisma';

import { server } from '../../utils';
import { callWithFixture } from './utils';

suite('github hook installation_repositories event', () => {
  let app: FastifyInstance,
    sandbox: SinonSandbox,
    response: LightMyRequestResponse,
    postStub: SinonStub,
    getStub: SinonStub;

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();

    await app.prisma.orgs.deleteMany();
    await app.prisma.orgs.create({
      data: {
        name: 'automa',
        provider_type: 'github',
        provider_id: '65730741',
        is_user: false,
        has_installation: true,
        github_installation_id: 40335964,
      },
    });
  });

  suiteTeardown(async () => {
    await app.close();
    await app.prisma.orgs.deleteMany();
  });

  setup(() => {
    postStub = sandbox
      .stub(axios, 'post')
      .resolves({ data: { token: 'abcdef' } });

    getStub = sandbox.stub(axios, 'get');
    getStub.withArgs('/repos/automa/tmp').resolves({
      data: {
        id: 674157076,
        name: 'tmp',
        full_name: 'automa/tmp',
        private: true,
        archived: false,
        default_branch: 'master',
      },
    });
    getStub.withArgs('/repos/automa/tmp/branches/master').resolves({
      data: {
        commit: { sha: 'a2006e2015d93931f00fc3a8a04d24d66b7059da' },
      },
    });
    getStub.withArgs('/repos/automa/tmp/contents/automa.json').resolves({
      data: {
        content: 'eyJib3RzIjp7ImRlcGVuZGVuY3kiOnt9fX0=',
      },
    });

    // @ts-ignore
    sandbox.stub(axios, 'create').returns({
      get: getStub,
    });
  });

  teardown(async () => {
    sandbox.restore();
    await app.prisma.orgs.updateMany({
      data: {
        has_installation: true,
      },
    });
    await app.prisma.repos.deleteMany();
  });

  suite('added', () => {
    setup(async () => {
      response = await callWithFixture(
        app,
        'installation_repositories',
        'added',
      );
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should get information about repository and settings', async () => {
      assert.equal(postStub.callCount, 1);
      assert.equal(
        postStub.firstCall.args[0],
        'https://api.github.com/app/installations/40335964/access_tokens',
      );

      assert.equal(getStub.callCount, 3);
      assert.equal(getStub.withArgs('/repos/automa/tmp').callCount, 1);
      assert.equal(
        getStub.withArgs('/repos/automa/tmp/branches/master').callCount,
        1,
      );
      assert.equal(
        getStub.withArgs('/repos/automa/tmp/contents/automa.json').callCount,
        1,
      );
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
          name: 'tmp',
          provider_id: '674157076',
          is_private: true,
          is_archived: false,
          has_installation: true,
          last_commit_synced: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
        });
      });

      test('and settings should be created', async () => {
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
          cause: CauseType.REPOSITORY_ADDED,
          commit: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
          validation_errors: null,
          imported_from: null,
        });
        assert.deepEqual(settings[0].settings, { bots: { dependency: {} } });
      });
    });

    suite('and removed', () => {
      setup(async () => {
        sandbox.resetHistory();
        response = await callWithFixture(
          app,
          'installation_repositories',
          'removed',
        );
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should not get information about repository', async () => {
        assert.equal(postStub.callCount, 0);
        assert.equal(getStub.callCount, 0);
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
          name: 'tmp',
          provider_id: '674157076',
          is_private: true,
          is_archived: false,
          has_installation: false,
        });
      });

      suite('and added', () => {
        setup(async () => {
          sandbox.resetHistory();
          response = await callWithFixture(
            app,
            'installation_repositories',
            'added',
          );
        });

        test('should return 200', async () => {
          assert.equal(response.statusCode, 200);
        });

        test('should get information about repository', async () => {
          assert.equal(postStub.callCount, 1);
          assert.equal(
            postStub.firstCall.args[0],
            'https://api.github.com/app/installations/40335964/access_tokens',
          );

          assert.equal(getStub.callCount, 3);
          assert.equal(getStub.withArgs('/repos/automa/tmp').callCount, 1);
          assert.equal(
            getStub.withArgs('/repos/automa/tmp/branches/master').callCount,
            1,
          );
          assert.equal(
            getStub.withArgs('/repos/automa/tmp/contents/automa.json')
              .callCount,
            1,
          );
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
              name: 'tmp',
              provider_id: '674157076',
              is_private: true,
              is_archived: false,
              has_installation: true,
              last_commit_synced: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
            });
          });

          test('should create settings for repository', async () => {
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
              cause: CauseType.REPOSITORY_ADDED,
              commit: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
              validation_errors: null,
              imported_from: null,
            });
            assert.deepEqual(settings[0].settings, {
              bots: { dependency: {} },
            });

            assert.deepOwnInclude(settings[1], {
              repo_id: repos[0].id,
              cause: CauseType.REPOSITORY_ADDED,
              commit: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
              validation_errors: null,
              imported_from: null,
            });
            assert.deepEqual(settings[1].settings, {
              bots: { dependency: {} },
            });
          });
        });
      });
    });

    suite('and removed while suspended', () => {
      setup(async () => {
        sandbox.resetHistory();

        await app.prisma.orgs.update({
          where: {
            provider_type_provider_id: {
              provider_type: 'github',
              provider_id: '65730741',
            },
          },
          data: {
            has_installation: false,
          },
        });

        await app.prisma.repos.updateMany({
          where: {
            orgs: {
              provider_type: 'github',
              provider_id: '65730741',
            },
          },
          data: {
            has_installation: false,
          },
        });

        postStub.throws();

        response = await callWithFixture(
          app,
          'installation_repositories',
          'removed',
        );
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should not get information about repository', async () => {
        assert.equal(postStub.callCount, 0);
        assert.equal(getStub.callCount, 0);
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
          name: 'tmp',
          provider_id: '674157076',
          is_private: true,
          is_archived: false,
          has_installation: false,
        });
      });
    });
  });

  suite('added while suspended', () => {
    setup(async () => {
      await app.prisma.orgs.update({
        where: {
          provider_type_provider_id: {
            provider_type: 'github',
            provider_id: '65730741',
          },
        },
        data: {
          has_installation: false,
        },
      });

      postStub.throws();

      response = await callWithFixture(
        app,
        'installation_repositories',
        'added',
      );
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should not get information about repository', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(getStub.callCount, 0);
    });

    test('should not create repository', async () => {
      const repos = await app.prisma.repos.findMany({});

      assert.equal(repos.length, 0);
    });
  });
});
