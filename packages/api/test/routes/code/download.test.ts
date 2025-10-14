import { existsSync, mkdirSync } from 'node:fs';
import { Readable } from 'node:stream';

import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import axios from 'axios';
import * as tar from 'tar';

import { bots, orgs, repos, tasks } from '@automa/prisma';

import { getStubs } from '../../mocks';
import { call, seedBots, seedOrgs, seedRepos, server } from '../../utils';

suite('code/download', () => {
  let app: FastifyInstance, response: LightMyRequestResponse;
  let org: orgs, bot: bots, repo: repos, task: tasks;
  let sandbox: SinonSandbox, postStub: SinonStub, tarCreateStub: SinonStub;
  let zxCmdStub: SinonStub, zxCmdArgsStub: SinonStub;

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();
    ({ zxCmdStub, zxCmdArgsStub } = getStubs());
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
            { type: 'repo', repo_id: repo.id },
            { type: 'bot', bot_id: bot.id },
          ],
        },
      },
    });

    mkdirSync(`/tmp/automa/download/tasks/${task.id}`, { recursive: true });

    postStub = sandbox
      .stub(axios, 'post')
      .resolves({ data: { token: 'abcdef' } });

    tarCreateStub = sandbox
      .stub()
      .returns(Readable.from(Buffer.from('1234567890')));

    sandbox.replaceGetter(tar, 'c', () => tarCreateStub as any);
  });

  teardown(async () => {
    zxCmdStub.resetHistory();
    zxCmdArgsStub.resetHistory();
    sandbox.restore();
    await app.prisma.tasks.deleteMany();
    await app.prisma.orgs.deleteMany();
  });

  suite('with empty body', () => {
    setup(async () => {
      // @ts-ignore
      response = await download(app);
    });

    test('should return 400', () => {
      assert.equal(response.statusCode, 400);
    });

    test('should return error message', () => {
      const data = response.json();

      assert.equal(data.error, 'Bad Request');
      assert.equal(data.statusCode, 400);

      const errors = JSON.parse(data.message);

      assert.deepEqual(errors, [
        {
          code: 'invalid_type',
          expected: 'object',
          received: 'undefined',
          path: ['task'],
          message: 'Required',
        },
      ]);
    });

    test('should not get token from github', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(zxCmdStub.callCount, 0);
      assert.equal(tarCreateStub.callCount, 0);
    });
  });

  suite('with missing task id', () => {
    setup(async () => {
      response = await download(
        app,
        // @ts-ignore
        {
          token: 'abcdef',
        },
      );
    });

    test('should return 400', () => {
      assert.equal(response.statusCode, 400);
    });

    test('should return error message', () => {
      const data = response.json();

      assert.equal(data.error, 'Bad Request');
      assert.equal(data.statusCode, 400);

      const errors = JSON.parse(data.message);

      assert.deepEqual(errors, [
        {
          code: 'invalid_type',
          expected: 'number',
          received: 'undefined',
          path: ['task', 'id'],
          message: 'Required',
        },
      ]);
    });

    test('should not get token from github', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(zxCmdStub.callCount, 0);
      assert.equal(tarCreateStub.callCount, 0);
    });
  });

  suite('with null task id', () => {
    setup(async () => {
      response = await download(app, {
        // @ts-ignore
        id: null,
        token: 'abcdef',
      });
    });

    test('should return 400', () => {
      assert.equal(response.statusCode, 400);
    });

    test('should return error message', () => {
      const data = response.json();

      assert.equal(data.error, 'Bad Request');
      assert.equal(data.statusCode, 400);

      const errors = JSON.parse(data.message);

      assert.deepEqual(errors, [
        {
          code: 'invalid_type',
          expected: 'number',
          received: 'null',
          path: ['task', 'id'],
          message: 'Expected number, received null',
        },
      ]);
    });

    test('should not get token from github', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(zxCmdStub.callCount, 0);
      assert.equal(tarCreateStub.callCount, 0);
    });
  });

  suite('with missing task token', () => {
    setup(async () => {
      response = await download(
        app,
        // @ts-ignore
        {
          id: 1,
        },
      );
    });

    test('should return 400', () => {
      assert.equal(response.statusCode, 400);
    });

    test('should return error message', () => {
      const data = response.json();

      assert.equal(data.error, 'Bad Request');
      assert.equal(data.statusCode, 400);

      const errors = JSON.parse(data.message);

      assert.deepEqual(errors, [
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: ['task', 'token'],
          message: 'Required',
        },
      ]);
    });

    test('should not get token from github', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(zxCmdStub.callCount, 0);
      assert.equal(tarCreateStub.callCount, 0);
    });
  });

  suite('with null task token', () => {
    setup(async () => {
      response = await download(app, {
        id: 1,
        // @ts-ignore
        token: null,
      });
    });

    test('should return 400', () => {
      assert.equal(response.statusCode, 400);
    });

    test('should return error message', () => {
      const data = response.json();

      assert.equal(data.error, 'Bad Request');
      assert.equal(data.statusCode, 400);

      const errors = JSON.parse(data.message);

      assert.deepEqual(errors, [
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'null',
          path: ['task', 'token'],
          message: 'Expected string, received null',
        },
      ]);
    });

    test('should not get token from github', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(zxCmdStub.callCount, 0);
      assert.equal(tarCreateStub.callCount, 0);
    });
  });

  suite('non-existent task', () => {
    setup(async () => {
      response = await download(app, {
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
      assert.equal(zxCmdStub.callCount, 0);
      assert.equal(tarCreateStub.callCount, 0);
    });
  });

  suite('invalid task token', () => {
    setup(async () => {
      response = await download(app, {
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
      assert.equal(zxCmdStub.callCount, 0);
      assert.equal(tarCreateStub.callCount, 0);
    });
  });

  suite('old task', () => {
    setup(async () => {
      await app.prisma.tasks.update({
        where: {
          id: task.id,
        },
        data: {
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
        },
      });

      response = await download(app, {
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
        'Task is older than a week and thus cannot be worked upon anymore',
      );
      assert.equal(data.error, 'Forbidden');
      assert.equal(data.statusCode, 403);
    });

    test('should not get token from github', async () => {
      assert.equal(postStub.callCount, 0);
      assert.equal(zxCmdStub.callCount, 0);
      assert.equal(tarCreateStub.callCount, 0);
    });
  });

  suite('missing repo task item', () => {
    setup(async () => {
      await app.prisma.task_items.deleteMany({
        where: {
          type: 'repo',
        },
      });

      response = await download(app, {
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
      assert.equal(zxCmdStub.callCount, 0);
      assert.equal(tarCreateStub.callCount, 0);
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

      response = await download(app, {
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
      assert.equal(zxCmdStub.callCount, 0);
      assert.equal(tarCreateStub.callCount, 0);
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

      response = await download(app, {
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
      assert.equal(zxCmdStub.callCount, 0);
      assert.equal(tarCreateStub.callCount, 0);
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

      response = await download(app, {
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
      assert.equal(zxCmdStub.callCount, 0);
      assert.equal(tarCreateStub.callCount, 0);
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

      response = await download(app, {
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
      assert.equal(zxCmdStub.callCount, 0);
      assert.equal(tarCreateStub.callCount, 0);
    });
  });

  suite('archived repo without installation', () => {
    setup(async () => {
      await app.prisma.repos.update({
        where: {
          id: repo.id,
        },
        data: {
          is_archived: true,
          has_installation: false,
        },
      });

      response = await download(app, {
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
      assert.equal(zxCmdStub.callCount, 0);
      assert.equal(tarCreateStub.callCount, 0);
    });
  });

  suite('missing bot task item', () => {
    setup(async () => {
      await app.prisma.task_items.deleteMany({
        where: {
          type: 'bot',
        },
      });

      response = await download(app, {
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
      assert.equal(zxCmdStub.callCount, 0);
      assert.equal(tarCreateStub.callCount, 0);
    });
  });

  suite('valid task', () => {
    setup(async () => {
      response = await download(app, {
        id: task.id,
        token: 'abcdef',
      });

      task = await app.prisma.tasks.findFirstOrThrow({
        where: {
          id: task.id,
        },
      });
    });

    test('should return 200', () => {
      assert.equal(response.statusCode, 200);
    });

    test('should return direct url with token', () => {
      assert.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      );

      assert.deepEqual(response.json(), {
        type: 'direct',
        url: 'https://x-access-token:abcdef@github.com/org-0/repo-0',
      });
    });

    test('should update task with proposal token', async () => {
      assert.lengthOf(task.proposal_token ?? '', 171);
      assert.isNull(task.proposal_base_commit);
    });

    test('should get token from github', async () => {
      assert.equal(postStub.callCount, 1);
      assert.equal(
        postStub.firstCall.args[0],
        'https://api.github.com/app/installations/123/access_tokens',
      );
      assert.deepEqual(postStub.firstCall.args[1], {
        repository_ids: [Number(repo.provider_id)],
        permissions: {
          contents: 'read',
        },
      });
    });

    test('should return proposal token in response', () => {
      assert.equal(
        response.headers['x-automa-proposal-token'],
        task.proposal_token,
      );
    });

    test('should not clone and checkout the repo', async () => {
      assert.equal(zxCmdStub.callCount, 0);
      assert.equal(zxCmdArgsStub.callCount, 0);
    });
  });

  suite('valid task with bot paths', () => {
    setup(async () => {
      await app.prisma.bots.update({
        where: {
          id: bot.id,
        },
        data: {
          paths: ['path-1', 'path-2'],
        },
      });

      response = await download(app, {
        id: task.id,
        token: 'abcdef',
      });

      task = await app.prisma.tasks.findFirstOrThrow({
        where: {
          id: task.id,
        },
      });
    });

    test('should return 200', () => {
      assert.equal(response.statusCode, 200);
    });

    test('should return code', () => {
      assert.equal(response.headers['content-type'], 'application/gzip');

      assert.equal(response.body, '1234567890');
    });

    test('should update task with commit hash and proposal token', async () => {
      assert.lengthOf(task.proposal_token ?? '', 171);
      assert.equal(
        task.proposal_base_commit,
        '353fabbf70ac7a2cad3d9e27889bfc77f419d61b',
      );
    });

    test('should return proposal token in response', () => {
      assert.equal(
        response.headers['x-automa-proposal-token'],
        task.proposal_token,
      );
    });

    test('should get token from github', async () => {
      assert.equal(postStub.callCount, 1);
      assert.equal(
        postStub.firstCall.args[0],
        'https://api.github.com/app/installations/123/access_tokens',
      );
      assert.deepEqual(postStub.firstCall.args[1], {});
    });

    test('should clone and checkout the repo', async () => {
      assert.equal(zxCmdStub.callCount, 7);
      assert.equal(zxCmdArgsStub.callCount, 6);

      assert.deepEqual(zxCmdStub.getCall(0).args, [
        [
          'git clone --filter=tree:0 --no-checkout --depth=1 https://x-access-token:',
          '@github.com/',
          '/',
          ' ',
          '',
        ],
        'abcdef',
        'org-0',
        'repo-0',
        `/tmp/automa/download/tasks/${task.id}`,
      ]);
      assert.deepEqual(zxCmdStub.getCall(1).args, [
        { cwd: `/tmp/automa/download/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(2).args, [
        { cwd: `/tmp/automa/download/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(3).args, [
        { cwd: `/tmp/automa/download/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(4).args, [
        { cwd: `/tmp/automa/download/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(5).args, [
        { cwd: `/tmp/automa/download/tasks/${task.id}` },
      ]);
      assert.deepEqual(zxCmdStub.getCall(6).args, [
        { cwd: `/tmp/automa/download/tasks/${task.id}` },
      ]);

      assert.deepEqual(zxCmdArgsStub.getCall(0).args, [
        [
          'git -c core.ignoreCase=true sparse-checkout set --no-cone .gitignore ',
          '',
        ],
        ['path-1', 'path-2'],
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(1).args, [
        ['git -c core.ignoreCase=true checkout'],
      ]);
      assert.deepEqual(zxCmdArgsStub.getCall(2).args, [['git rev-parse HEAD']]);
      assert.deepEqual(zxCmdArgsStub.getCall(3).args, [['git init']]);
      assert.deepEqual(zxCmdArgsStub.getCall(4).args, [['git add .']]);
      assert.deepEqual(zxCmdArgsStub.getCall(5).args, [
        [
          'git -c user.name="automa[bot]" -c user.email="60525818+automa[bot]@users.noreply.github.com" commit --allow-empty -m "Downloaded code"',
        ],
      ]);
    });

    test('should compress code', () => {
      assert.equal(tarCreateStub.callCount, 1);
      assert.deepEqual(tarCreateStub.firstCall.args, [
        {
          gzip: true,
          cwd: `/tmp/automa/download/tasks/${task.id}`,
        },
        ['.'],
      ]);
    });

    test('should delete the cloned repo', async () => {
      assert.isFalse(existsSync(`/tmp/automa/download/tasks/${task.id}`));
    });
  });
});

const download = async (
  app: FastifyInstance,
  task: Pick<tasks, 'id' | 'token'>,
) =>
  call(app, '/code/download', {
    method: 'POST',
    payload: {
      task,
    },
  });
