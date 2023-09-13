import { assert } from 'chai';
import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import axios from 'axios';
import { SinonSandbox, SinonStub, createSandbox } from 'sinon';

import { CauseType } from '@automa/common';
import { orgs, repos } from '@automa/prisma';

import { server } from '../../utils';
import { callWithFixture } from './utils';

suite('github hook push event', () => {
  let app: FastifyInstance,
    sandbox: SinonSandbox,
    response: LightMyRequestResponse,
    org: orgs,
    repository: repos;

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();

    await app.prisma.orgs.deleteMany();
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
    await app.close();
    await app.prisma.orgs.deleteMany();
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
        last_commit_synced: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
      },
    });
    await app.prisma.repo_settings.create({
      data: {
        repo_id: repository.id,
        cause: CauseType.APP_INSTALLED_WITH_REPOSITORY,
        commit: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
        settings: {},
      },
    });
  });

  teardown(async () => {
    await app.prisma.repos.deleteMany();
  });

  suite('on non default branch', () => {
    setup(async () => {
      response = await callWithFixture(app, 'push', 'push_non_default_branch');
    });

    test('should return 200', () => {
      assert.equal(response.statusCode, 200);
    });

    test('should not update repository commit', async () => {
      repository = await app.prisma.repos.findFirstOrThrow({
        where: {
          id: repository.id,
        },
      });

      assert.equal(
        repository.last_commit_synced,
        'a2006e2015d93931f00fc3a8a04d24d66b7059da',
      );
    });

    test('should not create new repository settings', async () => {
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
        cause: CauseType.APP_INSTALLED_WITH_REPOSITORY,
        commit: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
        validation_errors: null,
        imported_from_dependabot: false,
        imported_from_renovate: false,
      });
      assert.deepEqual(settings[0].settings, {});
    });
  });

  suite('with new commits', () => {
    let postStub: SinonStub, getStub: SinonStub;

    setup(async () => {
      postStub = sandbox
        .stub(axios, 'post')
        .resolves({ data: { token: 'abcdef' } });

      getStub = sandbox.stub(axios, 'get');
      getStub
        .withArgs('/repos/automa/tmp/contents/automa.json', {
          params: {
            ref: 'e184e26a8e0d519ea0f17c6e4e32832b43870714',
          },
        })
        .resolves({
          data: {
            content: 'eyJib3RzIjp7ImRlcGVuZGVuY3kiOnt9fX0=',
          },
        });

      // @ts-ignore
      sandbox.stub(axios, 'create').returns({
        get: getStub,
      });

      response = await callWithFixture(app, 'push', 'push');
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

      assert.equal(getStub.callCount, 1);
      assert.equal(
        getStub.withArgs('/repos/automa/tmp/contents/automa.json', {
          params: {
            ref: 'e184e26a8e0d519ea0f17c6e4e32832b43870714',
          },
        }).callCount,
        1,
      );
    });

    test('should update repository commit', async () => {
      repository = await app.prisma.repos.findFirstOrThrow({
        where: {
          id: repository.id,
        },
      });

      assert.equal(
        repository.last_commit_synced,
        'e184e26a8e0d519ea0f17c6e4e32832b43870714',
      );
    });

    test('should create new repository settings', async () => {
      const settings = await app.prisma.repo_settings.findMany({
        where: {
          repo_id: repository.id,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      assert.equal(settings.length, 2);

      assert.deepOwnInclude(settings[0], {
        repo_id: repository.id,
        cause: CauseType.COMMIT_SETTINGS_CHANGED,
        commit: 'e184e26a8e0d519ea0f17c6e4e32832b43870714',
        validation_errors: null,
        imported_from_dependabot: false,
        imported_from_renovate: false,
      });
      assert.deepEqual(settings[0].settings, { bots: { dependency: {} } });

      assert.deepOwnInclude(settings[1], {
        repo_id: repository.id,
        cause: CauseType.APP_INSTALLED_WITH_REPOSITORY,
        commit: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
        validation_errors: null,
        imported_from_dependabot: false,
        imported_from_renovate: false,
      });
      assert.deepEqual(settings[1].settings, {});
    });
  });

  suite('with no changes to settings files', () => {
    setup(async () => {
      response = await callWithFixture(app, 'push', 'push_no_changes');
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should update repository commit', async () => {
      repository = await app.prisma.repos.findFirstOrThrow({
        where: {
          id: repository.id,
        },
      });

      assert.deepEqual(
        repository.last_commit_synced,
        'e184e26a8e0d519ea0f17c6e4e32832b43870714',
      );
    });

    test('should not create new repository settings', async () => {
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
        cause: CauseType.APP_INSTALLED_WITH_REPOSITORY,
        commit: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
        validation_errors: null,
        imported_from_dependabot: false,
        imported_from_renovate: false,
      });
      assert.deepEqual(settings[0].settings, {});
    });
  });

  suite('with no changes but different base', () => {
    let postStub: SinonStub, getStub: SinonStub;

    setup(async () => {
      postStub = sandbox
        .stub(axios, 'post')
        .resolves({ data: { token: 'abcdef' } });

      getStub = sandbox.stub(axios, 'get');
      getStub
        .withArgs('/repos/automa/tmp/contents/automa.json', {
          params: {
            ref: 'e184e26a8e0d519ea0f17c6e4e32832b43870714',
          },
        })
        .resolves({
          data: {
            content: 'eyJib3RzIjp7ImRlcGVuZGVuY3kiOnt9fX0=',
          },
        });

      // @ts-ignore
      sandbox.stub(axios, 'create').returns({
        get: getStub,
      });

      response = await callWithFixture(app, 'push', 'push_lost_commits');
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

      assert.equal(getStub.callCount, 1);
      assert.equal(
        getStub.withArgs('/repos/automa/tmp/contents/automa.json', {
          params: {
            ref: 'e184e26a8e0d519ea0f17c6e4e32832b43870714',
          },
        }).callCount,
        1,
      );
    });

    test('should update repository commit', async () => {
      repository = await app.prisma.repos.findFirstOrThrow({
        where: {
          id: repository.id,
        },
      });

      assert.deepEqual(
        repository.last_commit_synced,
        'e184e26a8e0d519ea0f17c6e4e32832b43870714',
      );
    });

    test('should create new repository settings', async () => {
      const settings = await app.prisma.repo_settings.findMany({
        where: {
          repo_id: repository.id,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      assert.equal(settings.length, 2);

      assert.deepOwnInclude(settings[0], {
        repo_id: repository.id,
        cause: CauseType.COMMIT_UNKNOWN_BASE,
        commit: 'e184e26a8e0d519ea0f17c6e4e32832b43870714',
        validation_errors: null,
        imported_from_dependabot: false,
        imported_from_renovate: false,
      });
      assert.deepEqual(settings[0].settings, { bots: { dependency: {} } });

      assert.deepOwnInclude(settings[1], {
        repo_id: repository.id,
        cause: CauseType.APP_INSTALLED_WITH_REPOSITORY,
        commit: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
        validation_errors: null,
        imported_from_dependabot: false,
        imported_from_renovate: false,
      });
      assert.deepEqual(settings[1].settings, {});
    });
  });

  suite('with force push', () => {
    let postStub: SinonStub, getStub: SinonStub;

    setup(async () => {
      postStub = sandbox
        .stub(axios, 'post')
        .resolves({ data: { token: 'abcdef' } });

      getStub = sandbox.stub(axios, 'get');
      getStub
        .withArgs('/repos/automa/tmp/contents/automa.json', {
          params: {
            ref: 'e184e26a8e0d519ea0f17c6e4e32832b43870714',
          },
        })
        .resolves({
          data: {
            content: 'eyJib3RzIjp7ImRlcGVuZGVuY3kiOnt9fX0=',
          },
        });

      // @ts-ignore
      sandbox.stub(axios, 'create').returns({
        get: getStub,
      });

      response = await callWithFixture(app, 'push', 'push_force');
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

      assert.equal(getStub.callCount, 1);
      assert.equal(
        getStub.withArgs('/repos/automa/tmp/contents/automa.json', {
          params: {
            ref: 'e184e26a8e0d519ea0f17c6e4e32832b43870714',
          },
        }).callCount,
        1,
      );
    });

    test('should update repository commit', async () => {
      repository = await app.prisma.repos.findFirstOrThrow({
        where: {
          id: repository.id,
        },
      });

      assert.deepEqual(
        repository.last_commit_synced,
        'e184e26a8e0d519ea0f17c6e4e32832b43870714',
      );
    });

    test('should create new repository settings', async () => {
      const settings = await app.prisma.repo_settings.findMany({
        where: {
          repo_id: repository.id,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      assert.equal(settings.length, 2);

      assert.deepOwnInclude(settings[0], {
        repo_id: repository.id,
        cause: CauseType.COMMIT_FORCE_PUSHED,
        commit: 'e184e26a8e0d519ea0f17c6e4e32832b43870714',
        validation_errors: null,
        imported_from_dependabot: false,
        imported_from_renovate: false,
      });
      assert.deepEqual(settings[0].settings, { bots: { dependency: {} } });

      assert.deepOwnInclude(settings[1], {
        repo_id: repository.id,
        cause: CauseType.APP_INSTALLED_WITH_REPOSITORY,
        commit: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
        validation_errors: null,
        imported_from_dependabot: false,
        imported_from_renovate: false,
      });
      assert.deepEqual(settings[1].settings, {});
    });
  });

  suite('with JSON errors', () => {
    let postStub: SinonStub, getStub: SinonStub;

    setup(async () => {
      postStub = sandbox
        .stub(axios, 'post')
        .resolves({ data: { token: 'abcdef' } });

      getStub = sandbox.stub(axios, 'get');
      getStub
        .withArgs('/repos/automa/tmp/contents/automa.json', {
          params: {
            ref: 'e184e26a8e0d519ea0f17c6e4e32832b43870714',
          },
        })
        .resolves({
          data: {
            content: 'eyJib3RzIjp7fQ==',
          },
        });

      // @ts-ignore
      sandbox.stub(axios, 'create').returns({
        get: getStub,
      });

      response = await callWithFixture(app, 'push', 'push');
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

      assert.equal(getStub.callCount, 1);
      assert.equal(
        getStub.withArgs('/repos/automa/tmp/contents/automa.json', {
          params: {
            ref: 'e184e26a8e0d519ea0f17c6e4e32832b43870714',
          },
        }).callCount,
        1,
      );
    });

    test('should update repository commit', async () => {
      repository = await app.prisma.repos.findFirstOrThrow({
        where: {
          id: repository.id,
        },
      });

      assert.equal(
        repository.last_commit_synced,
        'e184e26a8e0d519ea0f17c6e4e32832b43870714',
      );
    });

    test('should create new repository settings', async () => {
      const settings = await app.prisma.repo_settings.findMany({
        where: {
          repo_id: repository.id,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      assert.equal(settings.length, 2);

      assert.deepOwnInclude(settings[0], {
        repo_id: repository.id,
        cause: CauseType.COMMIT_SETTINGS_CHANGED,
        commit: 'e184e26a8e0d519ea0f17c6e4e32832b43870714',
        imported_from_dependabot: false,
        imported_from_renovate: false,
      });
      assert.deepEqual(settings[0].settings, null);
      assert.deepEqual(settings[0].validation_errors, {
        deserialize: 'Unexpected end of JSON input',
      });

      assert.deepOwnInclude(settings[1], {
        repo_id: repository.id,
        cause: CauseType.APP_INSTALLED_WITH_REPOSITORY,
        commit: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
        validation_errors: null,
        imported_from_dependabot: false,
        imported_from_renovate: false,
      });
      assert.deepEqual(settings[1].settings, {});
    });
  });

  suite('with validation errors', () => {
    let postStub: SinonStub, getStub: SinonStub;

    setup(async () => {
      postStub = sandbox
        .stub(axios, 'post')
        .resolves({ data: { token: 'abcdef' } });

      getStub = sandbox.stub(axios, 'get');
      getStub
        .withArgs('/repos/automa/tmp/contents/automa.json', {
          params: {
            ref: 'e184e26a8e0d519ea0f17c6e4e32832b43870714',
          },
        })
        .resolves({
          data: {
            content: 'eyJib3RzIjp7ImZpbGVzIjp7fX19',
          },
        });

      // @ts-ignore
      sandbox.stub(axios, 'create').returns({
        get: getStub,
      });

      response = await callWithFixture(app, 'push', 'push');
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

      assert.equal(getStub.callCount, 1);
      assert.equal(
        getStub.withArgs('/repos/automa/tmp/contents/automa.json', {
          params: {
            ref: 'e184e26a8e0d519ea0f17c6e4e32832b43870714',
          },
        }).callCount,
        1,
      );
    });

    test('should update repository commit', async () => {
      repository = await app.prisma.repos.findFirstOrThrow({
        where: {
          id: repository.id,
        },
      });

      assert.equal(
        repository.last_commit_synced,
        'e184e26a8e0d519ea0f17c6e4e32832b43870714',
      );
    });

    test('should create new repository settings', async () => {
      const settings = await app.prisma.repo_settings.findMany({
        where: {
          repo_id: repository.id,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      assert.equal(settings.length, 2);

      assert.deepOwnInclude(settings[0], {
        repo_id: repository.id,
        cause: CauseType.COMMIT_SETTINGS_CHANGED,
        commit: 'e184e26a8e0d519ea0f17c6e4e32832b43870714',
        imported_from_dependabot: false,
        imported_from_renovate: false,
      });
      assert.deepEqual(settings[0].settings, { bots: { files: {} } });
      assert.deepEqual(settings[0].validation_errors, {
        schema: [
          {
            instancePath: '/bots/files',
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'groups' },
            message: "must have required property 'groups'",
          },
        ],
      });

      assert.deepOwnInclude(settings[1], {
        repo_id: repository.id,
        cause: CauseType.APP_INSTALLED_WITH_REPOSITORY,
        commit: 'a2006e2015d93931f00fc3a8a04d24d66b7059da',
        validation_errors: null,
        imported_from_dependabot: false,
        imported_from_renovate: false,
      });
      assert.deepEqual(settings[1].settings, {});
    });
  });
});
