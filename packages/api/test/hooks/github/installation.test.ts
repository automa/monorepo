import { assert } from 'chai';
import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import axios from 'axios';
import { SinonSandbox, SinonStub, createSandbox } from 'sinon';

import { orgs } from '@automa/prisma';

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

  suiteTeardown(async () => {
    await app.close();
    sandbox.restore();
  });

  teardown(async () => {
    await app.prisma.orgs.deleteMany();
    sandbox.resetHistory();
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
          has_installation: false,
        });
        assert.deepOwnInclude(repos[0].orgs, {
          name: 'automa',
          provider_type: 'github',
          provider_id: '65730741',
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
          has_installation: false,
        });
        assert.deepOwnInclude(repos[0].orgs, {
          name: 'automa',
          provider_type: 'github',
          provider_id: '65730741',
        });
      });

      suite('and unsuspend', () => {
        setup(async () => {
          response = await callWithFixture(app, 'installation', 'unsuspend');
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

        test.skip('should mark repository as active', async () => {
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
  });
});
