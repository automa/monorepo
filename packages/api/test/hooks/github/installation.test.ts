import { assert } from 'chai';
import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import axios from 'axios';
import { SinonSandbox, SinonStub, createSandbox } from 'sinon';

import { orgs, repos } from '@automa/prisma';

import { server } from '../../utils';
import { callWithFixture } from './utils';

suite('github hook installation event', () => {
  let app: FastifyInstance,
    sandbox: SinonSandbox,
    response: LightMyRequestResponse,
    postStub: SinonStub,
    getStub: SinonStub;

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();
    await app.prisma.orgs.deleteMany();
  });

  suiteTeardown(async () => {
    await app.close();
    sandbox.restore();
  });

  setup(() => {
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
    getStub.withArgs('/repos/automa/automa/contents/automa.json').resolves({
      data: {
        content: 'eyJib3RzIjp7ImRlcGVuZGVuY3kiOnt9fX0=',
      },
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
    setup(async () => {
      response = await callWithFixture(app, 'installation', 'created');
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should create organization', async () => {
      const orgs = await app.prisma.orgs.findMany();

      assert.equal(orgs.length, 1);
      assert.deepOwnInclude(orgs[0], {
        name: 'automa',
        provider_type: 'github',
        provider_id: '65730741',
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

    test('should create repository', async () => {
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
        has_installation: true,
        last_commit_synced: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
      });
      assert.deepEqual(repos[0].settings, { bots: { dependency: {} } });
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
        });

        test('should return 200', async () => {
          assert.equal(response.statusCode, 200);
        });

        suite('should mark organization', () => {
          let orgs: orgs[];

          setup(async () => {
            orgs = await app.prisma.orgs.findMany();
          });

          test('as active', () => {
            assert.equal(orgs.length, 1);
            assert.deepOwnInclude(orgs[0], {
              has_installation: true,
            });
          });

          test('with new github installation id', () => {
            assert.equal(orgs.length, 1);
            assert.deepOwnInclude(orgs[0], {
              github_installation_id: 40401522,
            });
          });
        });

        test('should get information about repository', async () => {
          assert.equal(postStub.callCount, 1);
          assert.equal(
            postStub.firstCall.args[0],
            'https://api.github.com/app/installations/40401522/access_tokens',
          );

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

        test('should mark repository as active', async () => {
          const repos = await app.prisma.repos.findMany({
            include: {
              orgs: true,
            },
          });

          assert.equal(repos.length, 1);
          assert.deepOwnInclude(repos[0], {
            name: 'automa',
            provider_id: '592296270',
            is_private: true,
            is_archived: false,
            last_commit_synced: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
          });
          assert.deepEqual(repos[0].settings, { bots: { dependency: {} } });
          assert.deepOwnInclude(repos[0].orgs, {
            name: 'automa',
            provider_type: 'github',
            provider_id: '65730741',
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
          postStub.resetHistory();
          getStub.resetHistory();

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
          getStub.withArgs('/repos/automa/tmp/contents/automa.json').resolves({
            data: {
              content: 'eyJib3RzIjp7ImRlcGVuZGVuY3kiOnt9fX0=',
            },
          });

          response = await callWithFixture(app, 'installation', 'unsuspend');
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

        test('should mark organization as active', async () => {
          const orgs = await app.prisma.orgs.findMany();

          assert.equal(orgs.length, 1);
          assert.deepOwnInclude(orgs[0], {
            name: 'automa',
            provider_type: 'github',
            provider_id: '65730741',
            is_user: false,
            has_installation: true,
            github_installation_id: 40335964,
          });
        });

        suite('and checking repositories', () => {
          let repositories: repos[];

          setup(async () => {
            repositories = await app.prisma.repos.findMany({
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
            assert.equal(repositories.length, 2);
            assert.deepOwnInclude(repositories[1], {
              name: 'tmp',
              provider_id: '674157076',
              is_private: true,
              is_archived: false,
              has_installation: true,
              last_commit_synced: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
            });
            assert.deepEqual(repositories[0].settings, {
              bots: { dependency: {} },
            });
          });

          test('should mark repository as active', () => {
            assert.deepOwnInclude(repositories[0], {
              name: 'automa',
              provider_id: '592296270',
              has_installation: true,
            });
          });

          test('should mark repository as archived & public', async () => {
            assert.deepOwnInclude(repositories[0], {
              name: 'automa',
              provider_id: '592296270',
              is_private: false,
              is_archived: true,
            });
          });
        });
      });
    });
  });
});
