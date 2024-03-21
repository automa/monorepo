import { assert } from 'chai';
import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import axios from 'axios';
import { SinonSandbox, SinonStub, createSandbox } from 'sinon';

import { CauseType } from '@automa/common';
import { orgs, repos } from '@automa/prisma';

import { server } from '../../utils';
import { callWithFixture, encodeSettings } from './utils';

suite('github hook repository event', () => {
  let app: FastifyInstance,
    response: LightMyRequestResponse,
    org: orgs,
    repository: repos;

  suiteSetup(async () => {
    app = await server();

    org = await app.prisma.orgs.create({
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
    await app.prisma.orgs.deleteMany();
    await app.close();
  });

  setup(async () => {
    repository = await app.prisma.repos.create({
      data: {
        org_id: org.id,
        name: 'tmp',
        provider_id: '674157076',
        is_private: true,
        is_archived: false,
        has_installation: true,
      },
    });
  });

  teardown(async () => {
    await app.prisma.repos.deleteMany();
  });

  suite('archived', () => {
    setup(async () => {
      response = await callWithFixture(app, 'repository', 'archived');
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should mark repository as archived', async () => {
      const repo = await app.prisma.repos.findFirstOrThrow({
        where: {
          id: repository.id,
        },
      });

      assert.deepOwnInclude(repo, {
        name: 'tmp',
        provider_id: '674157076',
        is_private: true,
        is_archived: true,
        has_installation: true,
      });
    });

    suite('and unarchived', () => {
      setup(async () => {
        response = await callWithFixture(app, 'repository', 'unarchived');
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should mark repository as unarchived', async () => {
        const repo = await app.prisma.repos.findFirstOrThrow({
          where: {
            id: repository.id,
          },
        });

        assert.deepOwnInclude(repo, {
          name: 'tmp',
          provider_id: '674157076',
          is_private: true,
          is_archived: false,
          has_installation: true,
        });
      });
    });
  });

  suite('publicized', () => {
    setup(async () => {
      response = await callWithFixture(app, 'repository', 'publicized');
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should mark repository as publicized', async () => {
      const repo = await app.prisma.repos.findFirstOrThrow({
        where: {
          id: repository.id,
        },
      });

      assert.deepOwnInclude(repo, {
        name: 'tmp',
        provider_id: '674157076',
        is_private: false,
        is_archived: false,
        has_installation: true,
      });
    });

    suite('and privatized', () => {
      setup(async () => {
        response = await callWithFixture(app, 'repository', 'privatized');
      });

      test('should return 200', async () => {
        assert.equal(response.statusCode, 200);
      });

      test('should mark repository as privatized', async () => {
        const repo = await app.prisma.repos.findFirstOrThrow({
          where: {
            id: repository.id,
          },
        });

        assert.deepOwnInclude(repo, {
          name: 'tmp',
          provider_id: '674157076',
          is_private: true,
          is_archived: false,
          has_installation: true,
        });
      });
    });
  });

  suite('renamed', () => {
    setup(async () => {
      response = await callWithFixture(app, 'repository', 'renamed');
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should rename repository', async () => {
      const repo = await app.prisma.repos.findFirstOrThrow({
        where: {
          id: repository.id,
        },
      });

      assert.deepOwnInclude(repo, {
        name: 'tmp-2',
        provider_id: '674157076',
        is_private: true,
        is_archived: false,
        has_installation: true,
      });
    });
  });

  suite('edited', () => {
    let sandbox: SinonSandbox, postStub: SinonStub, getStub: SinonStub;

    suiteSetup(async () => {
      sandbox = createSandbox();
    });

    suiteTeardown(async () => {
      sandbox.restore();
    });

    setup(async () => {
      postStub = sandbox
        .stub(axios, 'post')
        .resolves({ data: { token: 'abcdef' } });

      getStub = sandbox.stub(axios, 'get');
      getStub.withArgs('/repos/automa/tmp/branches/production').resolves({
        data: {
          commit: { sha: 'a2006e2015d93931f00fc3a8a04d24d66b7059da' },
        },
      });
      getStub
        .withArgs('/repos/automa/tmp/contents/automa.json')
        .resolves(encodeSettings('dependency'));

      // @ts-ignore
      sandbox.stub(axios, 'create').returns({
        get: getStub,
      });

      response = await callWithFixture(app, 'repository', 'edited');
    });

    teardown(async () => {
      sandbox.restore();
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should get information about settings', async () => {
      assert.equal(postStub.callCount, 1);
      assert.equal(
        postStub.firstCall.args[0],
        'https://api.github.com/app/installations/40335964/access_tokens',
      );

      assert.equal(getStub.callCount, 2);
      assert.equal(
        getStub.withArgs('/repos/automa/tmp/branches/production').callCount,
        1,
      );
      assert.equal(
        getStub.withArgs('/repos/automa/tmp/contents/automa.json').callCount,
        1,
      );
    });

    test('should update repository commit', async () => {
      const repo = await app.prisma.repos.findFirstOrThrow({
        where: {
          id: repository.id,
        },
      });

      assert.deepOwnInclude(repo, {
        name: 'tmp',
        provider_id: '674157076',
        is_private: true,
        is_archived: false,
        has_installation: true,
        last_commit_synced: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
      });
    });

    test('should create repository settings', async () => {
      const settings = await app.prisma.repo_settings.findMany({
        where: {
          repo_id: repository.id,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      assert.equal(settings.length, 1);

      assert.deepOwnInclude(settings[0], {
        repo_id: repository.id,
        cause: CauseType.DEFAULT_BRANCH_CHANGED,
        commit: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
        validation_errors: null,
        imported_from: null,
      });
      assert.deepEqual(settings[0].settings, { bots: { dependency: {} } });
    });
  });
});
