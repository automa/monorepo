import { assert } from 'chai';
import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import axios from 'axios';
import { SinonSandbox, SinonStub, createSandbox } from 'sinon';

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

    test('should get information about repository', async () => {
      assert.equal(postStub.callCount, 1);
      assert.equal(
        postStub.firstCall.args[0],
        'https://api.github.com/app/installations/40335964/access_tokens',
      );

      assert.equal(getStub.callCount, 1);
      assert.equal(getStub.firstCall.args[0], '/repos/automa/tmp');
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
        name: 'tmp',
        provider_id: '674157076',
        is_private: true,
        is_archived: false,
        has_installation: true,
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

          assert.equal(getStub.callCount, 1);
          assert.equal(getStub.firstCall.args[0], '/repos/automa/tmp');
        });

        test('should mark repository as active', async () => {
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
            has_installation: true,
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
