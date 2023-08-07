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
  });

  suiteTeardown(async () => {
    await app.close();
    sandbox.restore();
  });

  setup(() => {
    postStub = sandbox
      .stub(axios, 'post')
      .resolves({ data: { token: 'abcdef' } });

    getStub = sandbox
      .stub(axios, 'get')
      .resolves({ data: { archived: false } });

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

    test('should get information about repository', async () => {
      assert.equal(postStub.callCount, 1);
      assert.equal(
        postStub.firstCall.args[0],
        'https://api.github.com/app/installations/40335964/access_tokens',
      );

      assert.equal(getStub.callCount, 1);
      assert.equal(getStub.firstCall.args[0], '/repos/automa/automa');
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

      suite('and created', () => {
        setup(async () => {
          sandbox.resetHistory();
          response = await callWithFixture(app, 'installation', 'created2');
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

          assert.equal(getStub.callCount, 1);
          assert.equal(getStub.firstCall.args[0], '/repos/automa/automa');
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
            has_installation: true,
          });
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

          // Make sure to have 2 pages of repositories
          getStub.reset();
          getStub
            .onFirstCall()
            .resolves({
              config: {},
              headers: {
                link: '</installation/repositories?page=2>; rel="next"',
              },
              data: {
                repositories: [
                  {
                    id: 592296270,
                    name: 'automa',
                    private: false,
                    archived: true,
                  },
                ],
              },
            })
            .onSecondCall()
            .resolves({
              config: {},
              headers: {},
              data: {
                repositories: [
                  {
                    id: 674157076,
                    name: 'tmp',
                    private: true,
                    archived: false,
                  },
                ],
              },
            });

          response = await callWithFixture(app, 'installation', 'unsuspend');
        });

        test('should return 200', async () => {
          assert.equal(response.statusCode, 200);
        });

        test('should get information about all repositories', async () => {
          assert.equal(postStub.callCount, 1);
          assert.equal(
            postStub.firstCall.args[0],
            'https://api.github.com/app/installations/40335964/access_tokens',
          );

          assert.equal(getStub.callCount, 2);
          assert.equal(getStub.firstCall.args[0], '/installation/repositories');
          assert.equal(
            getStub.secondCall.args[0],
            '/installation/repositories?page=2',
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
