import { FastifyInstance } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import axios from 'axios';

import { orgs, provider, repos, users } from '@automa/prisma';

import { seedOrgs, seedRepos, seedUserOrgs, seedUsers, server } from '../utils';

import syncGithubRepoUsers from '../../src/events/jobs/syncGithubRepoUsers';

suite('events/syncGithubRepoUsers', () => {
  let app: FastifyInstance;
  let sandbox: SinonSandbox, postStub: SinonStub, getStub: SinonStub;
  let org: orgs, repo: repos, user: users, oldUser: users, newUser: users;

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();

    [user, oldUser, newUser] = await seedUsers(app, 3);

    await app.prisma.user_providers.createMany({
      data: [
        {
          user_id: user.id,
          provider_email: user.email,
          provider_type: provider.github,
          provider_id: '592296270',
        },
        {
          user_id: newUser.id,
          provider_email: newUser.email,
          provider_type: provider.github,
          provider_id: '674157076',
        },
      ],
    });
  });

  suiteTeardown(async () => {
    await app.prisma.users.deleteMany();
    await app.close();
  });

  setup(async () => {
    [org] = await seedOrgs(app, 1);
    [repo] = await seedRepos(app, [], [org]);

    await seedUserOrgs(app, user, [org]);
    await seedUserOrgs(app, oldUser, [org]);

    await app.prisma.user_repos.createMany({
      data: [
        {
          user_id: user.id,
          repo_id: repo.id,
        },
        {
          user_id: oldUser.id,
          repo_id: repo.id,
        },
      ],
    });

    postStub = sandbox
      .stub(axios, 'post')
      .resolves({ data: { token: 'abcdef' } });

    getStub = sandbox.stub(axios, 'get');
    getStub.withArgs('/repos/org-0/repo-0/collaborators').resolves({
      config: {},
      headers: {
        link: '</repos/org-0/repo-0/collaborators?page=2>; rel="next"',
      },
      data: [
        {
          id: 592296270,
        },
        {
          id: 292834722,
        },
      ],
    });
    getStub.withArgs('/repos/org-0/repo-0/collaborators?page=2').resolves({
      config: {},
      headers: {},
      data: [
        {
          id: 674157076,
        },
      ],
    });

    // @ts-ignore
    sandbox.stub(axios, 'create').returns({
      get: getStub,
    });
  });

  teardown(async () => {
    await app.prisma.orgs.deleteMany();
    sandbox.restore();
  });

  test('should not get information about repo members', async () => {
    await syncGithubRepoUsers.handler?.(app, { repoId: repo.id });

    assert.isTrue(postStub.notCalled);
    assert.isTrue(getStub.notCalled);
  });

  test('with deleted org should not get information about org members', async () => {
    await app.prisma.orgs.deleteMany();

    await syncGithubRepoUsers.handler?.(app, { repoId: repo.id });

    assert.isTrue(postStub.notCalled);
    assert.isTrue(getStub.notCalled);
  });

  test('with deleted repo should not get information about org members', async () => {
    await app.prisma.repos.deleteMany();

    await syncGithubRepoUsers.handler?.(app, { repoId: repo.id });

    assert.isTrue(postStub.notCalled);
    assert.isTrue(getStub.notCalled);
  });

  suite('with github installation', () => {
    setup(async () => {
      await app.prisma.orgs.update({
        where: {
          id: org.id,
        },
        data: {
          github_installation_id: 123,
        },
      });

      await syncGithubRepoUsers.handler?.(app, { repoId: repo.id });
    });

    test('should get information about org members', async () => {
      assert.equal(postStub.callCount, 1);
      assert.equal(getStub.callCount, 2);
      assert.equal(
        getStub.withArgs('/repos/org-0/repo-0/collaborators').callCount,
        1,
      );
      assert.equal(
        getStub.withArgs('/repos/org-0/repo-0/collaborators?page=2').callCount,
        1,
      );
    });

    test('should not create new users or user providers', async () => {
      assert.equal(await app.prisma.users.count(), 3);
      assert.equal(await app.prisma.user_providers.count(), 2);
    });

    test('should not change old user from org that was not removed', async () => {
      const oldUserProvider = await app.prisma.user_orgs.findUnique({
        where: {
          user_id_org_id: {
            user_id: user.id,
            org_id: org.id,
          },
        },
      });

      assert.isNotNull(oldUserProvider);
    });

    test('should add new user to org', async () => {
      const newUserOrg = await app.prisma.user_orgs.findUnique({
        where: {
          user_id_org_id: {
            user_id: newUser.id,
            org_id: org.id,
          },
        },
      });

      assert.isNotNull(newUserOrg);
    });

    test('should not change old user from repo that was not removed', async () => {
      const oldUserProvider = await app.prisma.user_orgs.findUnique({
        where: {
          user_id_org_id: {
            user_id: user.id,
            org_id: org.id,
          },
        },
      });

      assert.isNotNull(oldUserProvider);
    });

    test('should not remove old user from org', async () => {
      const oldUserRepo = await app.prisma.user_repos.findUnique({
        where: {
          user_id_repo_id: {
            user_id: oldUser.id,
            repo_id: repo.id,
          },
        },
      });

      assert.isNotNull(oldUserRepo);
    });

    test('should add new user to repo', async () => {
      const newUserRepo = await app.prisma.user_repos.findUnique({
        where: {
          user_id_repo_id: {
            user_id: newUser.id,
            repo_id: repo.id,
          },
        },
      });

      assert.isNotNull(newUserRepo);
    });

    test.skip('should remove old user from repo', async () => {
      const oldUserRepo = await app.prisma.user_repos.findUnique({
        where: {
          user_id_repo_id: {
            user_id: oldUser.id,
            repo_id: repo.id,
          },
        },
      });

      assert.isNull(oldUserRepo);
    });
  });
});
