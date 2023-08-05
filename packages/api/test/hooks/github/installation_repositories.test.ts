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
    sandbox.restore();
  });

  teardown(async () => {
    sandbox.resetHistory();
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
        include: {
          orgs: true,
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
      assert.deepOwnInclude(repos[0].orgs, {
        name: 'automa',
        provider_type: 'github',
        provider_id: '65730741',
      });
    });

    suite('and removed', () => {
      setup(async () => {
        response = await callWithFixture(
          app,
          'installation_repositories',
          'removed',
        );
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should mark repository as inactive', async () => {
        const repos = await app.prisma.repos.findMany({
          include: {
            orgs: true,
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
        assert.deepOwnInclude(repos[0].orgs, {
          name: 'automa',
          provider_type: 'github',
          provider_id: '65730741',
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
            include: {
              orgs: true,
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
