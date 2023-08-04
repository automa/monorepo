import { assert } from 'chai';
import { FastifyInstance, LightMyRequestResponse } from 'fastify';

import { repos } from '@automa/prisma';

import { server } from '../../utils';
import { callWithFixture } from './utils';

suite('github hook repository event', () => {
  let app: FastifyInstance, response: LightMyRequestResponse, repository: repos;

  suiteSetup(async () => {
    app = await server();

    const org = await app.prisma.orgs.create({
      data: {
        name: 'automa',
        provider_type: 'github',
        provider_id: '65730741',
        is_user: false,
        has_installation: true,
        github_installation_id: 40335964,
      },
    });

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

  suiteTeardown(async () => {
    await app.close();
    await app.prisma.orgs.deleteMany();
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
});
