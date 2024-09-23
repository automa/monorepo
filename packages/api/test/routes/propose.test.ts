import { existsSync, mkdirSync } from 'node:fs';

import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import axios from 'axios';

import { bots, orgs, repos, tasks } from '@automa/prisma';

import { call, seedBots, seedOrgs, seedRepos, server } from '../utils';

import { quibbleSandbox, zxCmdArgsStub, zxCmdStub } from '../mocks';

suite('code propose', () => {
  let app: FastifyInstance, response: LightMyRequestResponse;
  let org: orgs, bot: bots, repo: repos, task: tasks;
  let sandbox: SinonSandbox, postStub: SinonStub, getStub: SinonStub;

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();
  });

  suiteTeardown(async () => {
    await app.close();
  });

  setup(async () => {
    [org] = await seedOrgs(app, 1);
    [bot] = await seedBots(app, [org]);
    [repo] = await seedRepos(app, [org]);

    await app.prisma.orgs.update({
      where: {
        id: org.id,
      },
      data: {
        github_installation_id: 123,
        has_installation: true,
      },
    });

    task = await app.prisma.tasks.create({
      data: {
        title: 'Task 1',
        org_id: org.id,
        token: 'abcdef',
        task_items: {
          create: [
            { type: 'repo', data: { repoId: repo.id } },
            { type: 'bot', data: { botId: bot.id } },
          ],
        },
        proposal_token: 'ghijkl',
        proposal_base_commit: '123456',
      },
    });

    mkdirSync(`/tmp/automa/propose/tasks/${task.id}`, { recursive: true });

    postStub = sandbox.stub(axios, 'post');
    postStub
      .withArgs('https://api.github.com/app/installations/123/access_tokens')
      .resolves({ data: { token: 'abcdef' } });
    postStub.withArgs('/repos/org-0/repo-0/pulls').resolves({
      data: {
        number: 123,
        title: 'PR Title',
        state: 'open',
        merged: false,
        head: {
          label: `org-0:automa/org-0/bot-0/${task.id}`,
        },
        base: {
          ref: 'default-branch',
        },
      },
    });

    getStub = sandbox.stub(axios, 'get');
    getStub.withArgs('/repos/org-0/repo-0').resolves({
      data: {
        default_branch: 'default-branch',
      },
    });
    getStub.withArgs('/repos/org-0/repo-0/pulls').resolves({
      data: [],
    });

    // @ts-ignore
    sandbox.stub(axios, 'create').returns({
      get: getStub,
      post: postStub,
    });
  });

  teardown(async () => {
    quibbleSandbox.resetHistory();
    sandbox.restore();
    await app.prisma.orgs.deleteMany();
  });

  suite('non-existent task', () => {
    setup(async () => {
      response = await propose(app, {
        id: 0,
        token: 'abcdef',
      });
    });

    test('should return 404', () => {
      assert.equal(response.statusCode, 404);
    });

    test('should return error message', () => {
      const data = response.json();

      assert.equal(data.message, 'Task not found');
      assert.equal(data.error, 'Not Found');
      assert.equal(data.statusCode, 404);
    });

    test('should not get token from github', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(getStub.callCount, 0);
      assert.equal(zxCmdStub.callCount, 0);
    });
  });

  suite('invalid task token', () => {
    setup(async () => {
      response = await propose(app, {
        id: task.id,
        token: 'invalid',
      });
    });

    test('should return 404', () => {
      assert.equal(response.statusCode, 404);
    });

    test('should return error message', () => {
      const data = response.json();

      assert.equal(data.message, 'Task not found');
      assert.equal(data.error, 'Not Found');
      assert.equal(data.statusCode, 404);
    });

    test('should not get token from github', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(getStub.callCount, 0);
      assert.equal(zxCmdStub.callCount, 0);
    });
  });

  suite('old task', () => {
    setup(async () => {
      await app.prisma.tasks.update({
        where: {
          id: task.id,
        },
        data: {
          created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        },
      });

      response = await propose(app, {
        id: task.id,
        token: 'abcdef',
      });
    });

    test('should return 403', () => {
      assert.equal(response.statusCode, 403);
    });

    test('should return error message', () => {
      const data = response.json();

      assert.equal(
        data.message,
        'Task is older than 7 days and thus cannot be worked upon anymore',
      );
      assert.equal(data.error, 'Forbidden');
      assert.equal(data.statusCode, 403);
    });

    test('should not get token from github', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(getStub.callCount, 0);
      assert.equal(zxCmdStub.callCount, 0);
    });
  });

  suite('invalid proposal token', () => {
    setup(async () => {
      response = await propose(
        app,
        {
          id: task.id,
          token: 'abcdef',
        },
        {
          token: 'invalid',
        },
      );
    });

    test('should return 403', () => {
      assert.equal(response.statusCode, 403);
    });

    test('should return error message', () => {
      const data = response.json();

      assert.equal(data.message, 'Wrong proposal token provided');
      assert.equal(data.error, 'Forbidden');
      assert.equal(data.statusCode, 403);
    });

    test('should not get token from github', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(getStub.callCount, 0);
      assert.equal(zxCmdStub.callCount, 0);
    });
  });

  suite('missing repo task item', () => {
    setup(async () => {
      await app.prisma.task_items.deleteMany({
        where: {
          type: 'repo',
        },
      });

      response = await propose(app, {
        id: task.id,
        token: 'abcdef',
      });
    });

    test('should return 500', () => {
      assert.equal(response.statusCode, 500);
    });

    test('should return error message', () => {
      const data = response.json();

      assert.equal(data.message, 'Internal Server Error');
      assert.equal(data.error, 'Internal Server Error');
      assert.equal(data.statusCode, 500);
    });

    test('should not get token from github', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(getStub.callCount, 0);
      assert.equal(zxCmdStub.callCount, 0);
    });
  });

  suite('missing repo', () => {
    setup(async () => {
      await app.prisma.repos.deleteMany();

      response = await propose(app, {
        id: task.id,
        token: 'abcdef',
      });
    });

    test('should return 404', () => {
      assert.equal(response.statusCode, 404);
    });

    test('should return error message', () => {
      const data = response.json();

      assert.equal(data.message, 'Repository not found');
      assert.equal(data.error, 'Not Found');
      assert.equal(data.statusCode, 404);
    });

    test('should not get token from github', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(getStub.callCount, 0);
      assert.equal(zxCmdStub.callCount, 0);
    });
  });

  suite('with existing proposal', () => {
    setup(async () => {
      await app.prisma.task_items.create({
        data: {
          task_id: task.id,
          type: 'proposal',
          data: {
            repoName: 'repo-0',
            repoOrgProviderName: 'org-0',
            repoOrgProviderType: 'github',
            botName: 'bot-0',
            botImageUrl: 'https://example.com/image/0.png',
            botOrgName: 'org-0',
            prId: 123,
            prTitle: 'PR Title',
            prHead: 'repo-0:pr-head',
            prBase: 'pr-base',
          },
        },
      });

      response = await propose(app, {
        id: task.id,
        token: 'abcdef',
      });
    });

    test('should return 200', () => {
      assert.equal(response.statusCode, 200);
    });

    test('should return proposal', () => {
      const data = response.json();

      assert.deepEqual(data, {
        proposal: {
          type: 'github',
          id: 123,
          title: 'PR Title',
          head: 'repo-0:pr-head',
          base: 'pr-base',
        },
      });
    });

    test('should not get token from github', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(getStub.callCount, 0);
      assert.equal(zxCmdStub.callCount, 0);
    });
  });

  suite('org without installation', () => {
    setup(async () => {
      await app.prisma.orgs.update({
        where: {
          id: org.id,
        },
        data: {
          github_installation_id: null,
          has_installation: false,
        },
      });

      response = await propose(app, {
        id: task.id,
        token: 'abcdef',
      });
    });

    test('should return 404', () => {
      assert.equal(response.statusCode, 404);
    });

    test('should return error message', () => {
      const data = response.json();

      assert.equal(
        data.message,
        'Automa has not been installed for the organization',
      );
      assert.equal(data.error, 'Not Found');
      assert.equal(data.statusCode, 404);
    });

    test('should not get token from github', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(getStub.callCount, 0);
      assert.equal(zxCmdStub.callCount, 0);
    });
  });

  suite('org with suspended installation', () => {
    setup(async () => {
      await app.prisma.orgs.update({
        where: {
          id: org.id,
        },
        data: {
          has_installation: false,
        },
      });

      response = await propose(app, {
        id: task.id,
        token: 'abcdef',
      });
    });

    test('should return 404', () => {
      assert.equal(response.statusCode, 404);
    });

    test('should return error message', () => {
      const data = response.json();

      assert.equal(
        data.message,
        'Automa has been suspended for the organization',
      );
      assert.equal(data.error, 'Not Found');
      assert.equal(data.statusCode, 404);
    });

    test('should not get token from github', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(getStub.callCount, 0);
      assert.equal(zxCmdStub.callCount, 0);
    });
  });

  suite('repo without installation', () => {
    setup(async () => {
      await app.prisma.repos.update({
        where: {
          id: repo.id,
        },
        data: {
          has_installation: false,
        },
      });

      response = await propose(app, {
        id: task.id,
        token: 'abcdef',
      });
    });

    test('should return 404', () => {
      assert.equal(response.statusCode, 404);
    });

    test('should return error message', () => {
      const data = response.json();

      assert.equal(
        data.message,
        'Automa has not been installed for the repository',
      );
      assert.equal(data.error, 'Not Found');
      assert.equal(data.statusCode, 404);
    });

    test('should not get token from github', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(getStub.callCount, 0);
      assert.equal(zxCmdStub.callCount, 0);
    });
  });

  suite('archived repo', () => {
    setup(async () => {
      await app.prisma.repos.update({
        where: {
          id: repo.id,
        },
        data: {
          is_archived: true,
        },
      });

      response = await propose(app, {
        id: task.id,
        token: 'abcdef',
      });
    });

    test('should return 404', () => {
      assert.equal(response.statusCode, 404);
    });

    test('should return error message', () => {
      const data = response.json();

      assert.equal(data.message, 'Repository is archived');
      assert.equal(data.error, 'Not Found');
      assert.equal(data.statusCode, 404);
    });

    test('should not get token from github', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(getStub.callCount, 0);
      assert.equal(zxCmdStub.callCount, 0);
    });
  });

  suite('missing bot task item', () => {
    setup(async () => {
      await app.prisma.task_items.deleteMany({
        where: {
          type: 'bot',
        },
      });

      response = await propose(app, {
        id: task.id,
        token: 'abcdef',
      });
    });

    test('should return 500', () => {
      assert.equal(response.statusCode, 500);
    });

    test('should return error message', () => {
      const data = response.json();

      assert.equal(data.message, 'Internal Server Error');
      assert.equal(data.error, 'Internal Server Error');
      assert.equal(data.statusCode, 500);
    });

    test('should not get token from github', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(getStub.callCount, 0);
      assert.equal(zxCmdStub.callCount, 0);
    });
  });

  suite('missing bot', () => {
    setup(async () => {
      await app.prisma.bots.deleteMany();

      response = await propose(app, {
        id: task.id,
        token: 'abcdef',
      });
    });

    test('should return 404', () => {
      assert.equal(response.statusCode, 404);
    });

    test('should return error message', () => {
      const data = response.json();

      assert.equal(data.message, 'Bot not found');
      assert.equal(data.error, 'Not Found');
      assert.equal(data.statusCode, 404);
    });

    test('should not get token from github', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(getStub.callCount, 0);
      assert.equal(zxCmdStub.callCount, 0);
    });
  });

  suite('empty diff', () => {
    setup(async () => {
      response = await propose(
        app,
        {
          id: task.id,
          token: 'abcdef',
        },
        {
          diff: '',
        },
      );
    });

    test('should return 204', () => {
      assert.equal(response.statusCode, 204);
    });

    test('should not return any data', () => {
      assert.isEmpty(response.body);
    });

    test('should complete the task', async () => {
      task = await app.prisma.tasks.findFirstOrThrow({
        where: { id: task.id },
      });

      assert.isNotNull(task.completed_at);
      assert.isTrue(task.is_completed);
    });

    test('should not get token from github', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(getStub.callCount, 0);
      assert.equal(zxCmdStub.callCount, 0);
    });
  });

  suite('valid proposal', () => {
    setup(async () => {
      response = await propose(app, {
        id: task.id,
        token: 'abcdef',
      });
    });

    test('should return 201', () => {
      assert.equal(response.statusCode, 201);
    });

    test('should return proposal', () => {
      const data = response.json();

      assert.deepEqual(data, {
        proposal: {
          type: 'github',
          id: 123,
          title: 'PR Title',
          head: `org-0:automa/org-0/bot-0/${task.id}`,
          base: 'default-branch',
        },
      });
    });

    test('should get token from github', async () => {
      assert.equal(postStub.callCount, 2);
      assert.equal(
        postStub.firstCall.args[0],
        'https://api.github.com/app/installations/123/access_tokens',
      );
    });

    test('should commit and push the diff', async () => {
      assert.equal(zxCmdStub.callCount, 9);
      assert.equal(zxCmdArgsStub.callCount, 9);

      assert.deepEqual(zxCmdStub.getCall(0).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(1).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(2).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(3).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(4).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(5).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(6).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(7).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(8).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);

      assert.deepEqual(zxCmdArgsStub.getCall(0).args, [['git init']]);
      assert.deepEqual(zxCmdArgsStub.getCall(1).args, [
        [
          'git remote add origin https://x-access-token:',
          '@github.com/',
          '/',
          '',
        ],
        'abcdef',
        'org-0',
        'repo-0',
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(2).args, [
        ['git fetch --depth 1 origin ', ''],
        '123456',
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(3).args, [
        ['git config user.name "automa[bot]"'],
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(4).args, [
        [
          'git config user.email "60525818+automa[bot]@users.noreply.github.com"',
        ],
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(5).args, [
        ['git checkout ', ''],
        '123456',
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(6).args, [
        ['git apply --index ', '.diff'],
        `/tmp/automa/propose/tasks/${task.id}`,
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(7).args, [
        ['git commit -m ', ''],
        `Implemented automa#${task.id} using org-0/bot-0 bot`,
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(8).args, [
        ['git push -f origin HEAD:refs/heads/', ''],
        `automa/org-0/bot-0/${task.id}`,
      ]);
    });

    test('should create a PR', async () => {
      assert.equal(getStub.callCount, 2);

      assert.equal(getStub.getCall(0).args[0], '/repos/org-0/repo-0');
      assert.equal(getStub.getCall(1).args[0], '/repos/org-0/repo-0/pulls');
      assert.deepEqual(getStub.getCall(1).args[1], {
        params: {
          head: `org-0:automa/org-0/bot-0/${task.id}`,
          base: 'default-branch',
        },
      });

      assert.equal(postStub.getCall(1).args[0], '/repos/org-0/repo-0/pulls');

      assert.deepEqual(postStub.getCall(1).args[1], {
        title: `Implemented automa#${task.id} using org-0/bot-0 bot`,
        head: `automa/org-0/bot-0/${task.id}`,
        base: 'default-branch',
        maintainer_can_modify: true,
      });
    });

    test('should update the task with the proposal', async () => {
      const proposals = await app.prisma.task_items.findMany({
        where: { type: 'proposal' },
      });

      assert.lengthOf(proposals, 1);
      assert.deepOwnInclude(proposals[0], {
        task_id: task.id,
        data: {
          repoName: 'repo-0',
          repoOrgProviderName: 'org-0',
          repoOrgProviderType: 'github',
          botName: 'bot-0',
          botImageUrl: 'https://example.com/image/0.png',
          botOrgName: 'org-0',
          prId: 123,
          prTitle: 'PR Title',
          prState: 'open',
          prMerged: false,
          prHead: `org-0:automa/org-0/bot-0/${task.id}`,
          prBase: 'default-branch',
        },
      });
    });

    test('should delete the cloned repo', async () => {
      assert.isFalse(existsSync(`/tmp/automa/propose/tasks/${task.id}`));
    });

    test('should delete the diff', async () => {
      assert.isFalse(existsSync(`/tmp/automa/propose/tasks/${task.id}.diff`));
    });
  });

  suite('for bot by us should remove redundant automa', () => {
    setup(async () => {
      const automaOrg = await app.prisma.orgs.create({
        data: {
          name: 'automa',
          provider_type: 'github',
          provider_id: '789',
          provider_name: 'automa',
          is_user: false,
        },
      });
      await app.prisma.bots.update({
        where: {
          id: bot.id,
        },
        data: {
          org_id: automaOrg.id,
        },
      });

      postStub.withArgs('/repos/org-0/repo-0/pulls').resolves({
        data: {
          number: 123,
          title: 'PR Title',
          state: 'open',
          merged: false,
          head: {
            label: `org-0:automa/bot-0/${task.id}`,
          },
          base: {
            ref: 'default-branch',
          },
        },
      });

      response = await propose(app, {
        id: task.id,
        token: 'abcdef',
      });
    });

    test('should return 201', () => {
      assert.equal(response.statusCode, 201);
    });

    test('should return proposal', () => {
      const data = response.json();

      assert.deepEqual(data, {
        proposal: {
          type: 'github',
          id: 123,
          title: 'PR Title',
          head: `org-0:automa/bot-0/${task.id}`,
          base: 'default-branch',
        },
      });
    });

    test('should get token from github', async () => {
      assert.equal(postStub.callCount, 2);
      assert.equal(
        postStub.firstCall.args[0],
        'https://api.github.com/app/installations/123/access_tokens',
      );
    });

    test('should commit and push the diff', async () => {
      assert.equal(zxCmdStub.callCount, 9);
      assert.equal(zxCmdArgsStub.callCount, 9);

      assert.deepEqual(zxCmdStub.getCall(0).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(1).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(2).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(3).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(4).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(5).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(6).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(7).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(8).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);

      assert.deepEqual(zxCmdArgsStub.getCall(0).args, [['git init']]);
      assert.deepEqual(zxCmdArgsStub.getCall(1).args, [
        [
          'git remote add origin https://x-access-token:',
          '@github.com/',
          '/',
          '',
        ],
        'abcdef',
        'org-0',
        'repo-0',
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(2).args, [
        ['git fetch --depth 1 origin ', ''],
        '123456',
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(3).args, [
        ['git config user.name "automa[bot]"'],
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(4).args, [
        [
          'git config user.email "60525818+automa[bot]@users.noreply.github.com"',
        ],
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(5).args, [
        ['git checkout ', ''],
        '123456',
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(6).args, [
        ['git apply --index ', '.diff'],
        `/tmp/automa/propose/tasks/${task.id}`,
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(7).args, [
        ['git commit -m ', ''],
        `Implemented automa#${task.id} using bot-0 bot`,
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(8).args, [
        ['git push -f origin HEAD:refs/heads/', ''],
        `automa/bot-0/${task.id}`,
      ]);
    });

    test('should create a PR', async () => {
      assert.equal(getStub.callCount, 2);

      assert.equal(getStub.getCall(0).args[0], '/repos/org-0/repo-0');
      assert.equal(getStub.getCall(1).args[0], '/repos/org-0/repo-0/pulls');
      assert.deepEqual(getStub.getCall(1).args[1], {
        params: {
          head: `org-0:automa/bot-0/${task.id}`,
          base: 'default-branch',
        },
      });

      assert.equal(postStub.getCall(1).args[0], '/repos/org-0/repo-0/pulls');

      assert.deepEqual(postStub.getCall(1).args[1], {
        title: `Implemented automa#${task.id} using bot-0 bot`,
        head: `automa/bot-0/${task.id}`,
        base: 'default-branch',
        maintainer_can_modify: true,
      });
    });

    test('should update the task with the proposal', async () => {
      const proposals = await app.prisma.task_items.findMany({
        where: { type: 'proposal' },
      });

      assert.lengthOf(proposals, 1);
      assert.deepOwnInclude(proposals[0], {
        task_id: task.id,
        data: {
          repoName: 'repo-0',
          repoOrgProviderName: 'org-0',
          repoOrgProviderType: 'github',
          botName: 'bot-0',
          botImageUrl: 'https://example.com/image/0.png',
          botOrgName: 'automa',
          prId: 123,
          prTitle: 'PR Title',
          prState: 'open',
          prMerged: false,
          prHead: `org-0:automa/bot-0/${task.id}`,
          prBase: 'default-branch',
        },
      });
    });

    test('should delete the cloned repo', async () => {
      assert.isFalse(existsSync(`/tmp/automa/propose/tasks/${task.id}`));
    });

    test('should delete the diff', async () => {
      assert.isFalse(existsSync(`/tmp/automa/propose/tasks/${task.id}.diff`));
    });
  });

  suite('with proposal options', () => {
    setup(async () => {
      response = await propose(
        app,
        {
          id: task.id,
          token: 'abcdef',
        },
        {
          message: 'Custom message',
        },
      );
    });

    test('should return 201', () => {
      assert.equal(response.statusCode, 201);
    });

    test('should return proposal', () => {
      const data = response.json();

      assert.deepEqual(data, {
        proposal: {
          type: 'github',
          id: 123,
          title: 'PR Title',
          head: `org-0:automa/org-0/bot-0/${task.id}`,
          base: 'default-branch',
        },
      });
    });

    test('should get token from github', async () => {
      assert.equal(postStub.callCount, 2);
      assert.equal(
        postStub.firstCall.args[0],
        'https://api.github.com/app/installations/123/access_tokens',
      );
    });

    test('should commit and push the diff', async () => {
      assert.equal(zxCmdStub.callCount, 9);
      assert.equal(zxCmdArgsStub.callCount, 9);

      assert.deepEqual(zxCmdStub.getCall(0).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(1).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(2).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(3).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(4).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(5).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(6).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(7).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(8).args, [
        { cwd: `/tmp/automa/propose/tasks/${task.id}` },
      ]);

      assert.deepEqual(zxCmdArgsStub.getCall(0).args, [['git init']]);
      assert.deepEqual(zxCmdArgsStub.getCall(1).args, [
        [
          'git remote add origin https://x-access-token:',
          '@github.com/',
          '/',
          '',
        ],
        'abcdef',
        'org-0',
        'repo-0',
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(2).args, [
        ['git fetch --depth 1 origin ', ''],
        '123456',
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(3).args, [
        ['git config user.name "automa[bot]"'],
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(4).args, [
        [
          'git config user.email "60525818+automa[bot]@users.noreply.github.com"',
        ],
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(5).args, [
        ['git checkout ', ''],
        '123456',
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(6).args, [
        ['git apply --index ', '.diff'],
        `/tmp/automa/propose/tasks/${task.id}`,
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(7).args, [
        ['git commit -m ', ''],
        'Custom message',
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(8).args, [
        ['git push -f origin HEAD:refs/heads/', ''],
        `automa/org-0/bot-0/${task.id}`,
      ]);
    });

    test('should create a PR', async () => {
      assert.equal(getStub.callCount, 2);

      assert.equal(getStub.getCall(0).args[0], '/repos/org-0/repo-0');
      assert.equal(getStub.getCall(1).args[0], '/repos/org-0/repo-0/pulls');
      assert.deepEqual(getStub.getCall(1).args[1], {
        params: {
          head: `org-0:automa/org-0/bot-0/${task.id}`,
          base: 'default-branch',
        },
      });

      assert.equal(postStub.getCall(1).args[0], '/repos/org-0/repo-0/pulls');

      assert.deepEqual(postStub.getCall(1).args[1], {
        title: 'Custom message',
        head: `automa/org-0/bot-0/${task.id}`,
        base: 'default-branch',
        maintainer_can_modify: true,
      });
    });

    test('should update the task with the proposal', async () => {
      const proposals = await app.prisma.task_items.findMany({
        where: { type: 'proposal' },
      });

      assert.lengthOf(proposals, 1);
      assert.deepOwnInclude(proposals[0], {
        task_id: task.id,
        data: {
          repoName: 'repo-0',
          repoOrgProviderName: 'org-0',
          repoOrgProviderType: 'github',
          botName: 'bot-0',
          botImageUrl: 'https://example.com/image/0.png',
          botOrgName: 'org-0',
          prId: 123,
          prTitle: 'PR Title',
          prState: 'open',
          prMerged: false,
          prHead: `org-0:automa/org-0/bot-0/${task.id}`,
          prBase: 'default-branch',
        },
      });
    });

    test('should delete the cloned repo', async () => {
      assert.isFalse(existsSync(`/tmp/automa/propose/tasks/${task.id}`));
    });

    test('should delete the diff', async () => {
      assert.isFalse(existsSync(`/tmp/automa/propose/tasks/${task.id}.diff`));
    });
  });

  suite('with existing pr', () => {
    setup(async () => {
      getStub.withArgs('/repos/org-0/repo-0/pulls').resolves({
        data: [
          {
            number: 123,
            title: 'PR Title',
            state: 'open',
            merged: false,
            head: {
              label: `org-0:automa/org-0/bot-0/${task.id}`,
            },
            base: {
              ref: 'default-branch',
            },
          },
        ],
      });

      response = await propose(app, {
        id: task.id,
        token: 'abcdef',
      });
    });

    test('should return 201', () => {
      assert.equal(response.statusCode, 201);
    });

    test('should return proposal', () => {
      const data = response.json();

      assert.deepEqual(data, {
        proposal: {
          type: 'github',
          id: 123,
          title: 'PR Title',
          head: `org-0:automa/org-0/bot-0/${task.id}`,
          base: 'default-branch',
        },
      });
    });

    test('should get token from github', async () => {
      assert.equal(postStub.callCount, 1);
      assert.equal(
        postStub.firstCall.args[0],
        'https://api.github.com/app/installations/123/access_tokens',
      );
    });

    test('should not fetch, commit or push the diff', async () => {
      assert.equal(zxCmdStub.callCount, 0);
    });

    test('should check for PR', async () => {
      assert.equal(getStub.callCount, 2);

      assert.equal(getStub.getCall(0).args[0], '/repos/org-0/repo-0');
      assert.equal(getStub.getCall(1).args[0], '/repos/org-0/repo-0/pulls');
      assert.deepEqual(getStub.getCall(1).args[1], {
        params: {
          head: `org-0:automa/org-0/bot-0/${task.id}`,
          base: 'default-branch',
        },
      });
    });

    test('should update the task with the proposal', async () => {
      const proposals = await app.prisma.task_items.findMany({
        where: { type: 'proposal' },
      });

      assert.lengthOf(proposals, 1);
      assert.deepOwnInclude(proposals[0], {
        task_id: task.id,
        data: {
          repoName: 'repo-0',
          repoOrgProviderName: 'org-0',
          repoOrgProviderType: 'github',
          botName: 'bot-0',
          botImageUrl: 'https://example.com/image/0.png',
          botOrgName: 'org-0',
          prId: 123,
          prTitle: 'PR Title',
          prState: 'open',
          prMerged: false,
          prHead: `org-0:automa/org-0/bot-0/${task.id}`,
          prBase: 'default-branch',
        },
      });
    });

    test('should delete the diff', async () => {
      assert.isFalse(existsSync(`/tmp/automa/propose/tasks/${task.id}.diff`));
    });
  });
});

const propose = async (
  app: FastifyInstance,
  task: Pick<tasks, 'id' | 'token'>,
  proposal?: {
    token?: string;
    diff?: string;
    message?: string;
  },
) =>
  call(app, '/code/propose', {
    method: 'POST',
    payload: {
      task,
      proposal: {
        message: proposal?.message ?? '',
        token: proposal?.token ?? 'ghijkl',
        diff:
          proposal?.diff ??
          [
            'diff --git a/file.txt b/file.txt',
            'new file mode 100644',
            'index 0000000..81ab81a',
            '--- /dev/null',
            '+++ b/file.txt',
            '@@ -0,0 +1,1 @@',
            '+new',
          ].join('\n'),
      },
    },
  });
