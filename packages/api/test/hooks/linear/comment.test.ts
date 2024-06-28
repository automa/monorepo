import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import { CommentPayload, Issue, LinearClient } from '@linear/sdk';

import { orgs, users } from '@automa/prisma';

import { seedOrgs, seedUsers, server } from '../../utils';

import { callWithFixture } from './utils';

suite('linear hook Comment event', () => {
  let app: FastifyInstance,
    user: users,
    org: orgs,
    response: LightMyRequestResponse;
  let sandbox: SinonSandbox, issueStub: SinonStub, createCommentStub: SinonStub;

  suiteSetup(async () => {
    app = await server();
    sandbox = createSandbox();

    [user] = await seedUsers(app, 1);
    [org] = await seedOrgs(app, 1);
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.prisma.users.deleteMany();
    await app.close();
  });

  setup(async () => {
    await app.prisma.integrations.create({
      data: {
        org_id: org.id,
        integration_type: 'linear',
        secrets: {
          access_token: 'abcdef',
        },
        config: {
          id: '6cb652a9-8f3f-40b7-9695-df81e161fe07',
          name: 'Automa',
          slug: 'automa',
        },
        created_by: user.id,
      },
    });

    issueStub = sandbox.stub(LinearClient.prototype, 'issue').resolves({
      id: 'f2f72e62-b1a4-46c3-b605-0962d24792d8',
      title: 'Delete tokens when user revokes Github App',
      description:
        '- Delete the github refresh token stored in DB\n- Clear all sessions for the user',
    } as Issue);

    createCommentStub = sandbox
      .stub(LinearClient.prototype, 'createComment')
      .resolves({} as CommentPayload);
  });

  teardown(async () => {
    sandbox.restore();
    await app.prisma.integrations.deleteMany();
    await app.prisma.tasks.deleteMany();
  });

  suite('create', () => {
    setup(async () => {
      response = await callWithFixture(app, 'Comment', 'create');
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should create task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(tasks.length, 1);
      assert.deepOwnInclude(tasks[0], {
        org_id: org.id,
        title: 'Delete tokens when user revokes Github App',
        created_by: null,
      });

      const taskItems = await app.prisma.task_items.findMany({
        where: {
          task_id: tasks[0].id,
        },
      });

      assert.equal(taskItems.length, 1);
      assert.deepOwnInclude(taskItems[0], {
        type: 'message',
        content:
          'Delete tokens when user revokes Github App\n\n- Delete the github refresh token stored in DB\n- Clear all sessions for the user',
      });
    });

    test('should get information about issue', async () => {
      assert.equal(issueStub.callCount, 1);
      assert.equal(
        issueStub.firstCall.args[0],
        'f2f72e62-b1a4-46c3-b605-0962d24792d8',
      );
    });

    test('should create comment about the task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(createCommentStub.callCount, 1);
      assert.deepEqual(createCommentStub.firstCall.args[0], {
        body: `Created task: http://localhost:3000/org-0/tasks/${tasks[0].id}`,
        issueId: 'f2f72e62-b1a4-46c3-b605-0962d24792d8',
        parentId: 'a41c315a-3130-4c8e-a9ca-6e9219c156b7',
      });
    });
  });

  suite('create in comment thread', () => {
    setup(async () => {
      response = await callWithFixture(app, 'Comment', 'create_with_parent');
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should create task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(tasks.length, 1);
      assert.deepOwnInclude(tasks[0], {
        org_id: org.id,
        title: 'Delete tokens when user revokes Github App',
        created_by: null,
      });

      const taskItems = await app.prisma.task_items.findMany({
        where: {
          task_id: tasks[0].id,
        },
      });

      assert.equal(taskItems.length, 1);
      assert.deepOwnInclude(taskItems[0], {
        type: 'message',
        content:
          'Delete tokens when user revokes Github App\n\n- Delete the github refresh token stored in DB\n- Clear all sessions for the user',
      });
    });

    test('should get information about issue', async () => {
      assert.equal(issueStub.callCount, 1);
      assert.equal(
        issueStub.firstCall.args[0],
        'f2f72e62-b1a4-46c3-b605-0962d24792d8',
      );
    });

    test('should create comment about the task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(createCommentStub.callCount, 1);
      assert.deepEqual(createCommentStub.firstCall.args[0], {
        body: `Created task: http://localhost:3000/org-0/tasks/${tasks[0].id}`,
        issueId: 'f2f72e62-b1a4-46c3-b605-0962d24792d8',
        parentId: 'a41c315a-3130-4c8e-a9ca-6e9219c156b7',
      });
    });
  });

  suite('create with non-automa comment', () => {
    setup(async () => {
      response = await callWithFixture(app, 'Comment', 'create_ignore');
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should not create task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(tasks.length, 0);
    });

    test('should not get information about issue', async () => {
      assert.equal(issueStub.callCount, 0);
    });

    test('should not be able to create any comment', async () => {
      assert.equal(createCommentStub.callCount, 0);
    });
  });

  suite('create with missing integration', () => {
    setup(async () => {
      await app.prisma.integrations.update({
        where: {
          org_id_integration_type: {
            org_id: org.id,
            integration_type: 'linear',
          },
        },
        data: {
          config: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Workspace',
            slug: 'workspace',
          },
        },
      });

      response = await callWithFixture(app, 'Comment', 'create');
    });

    test('should return 200', async () => {
      assert.equal(response.statusCode, 200);
    });

    test('should not create task', async () => {
      const tasks = await app.prisma.tasks.findMany();

      assert.equal(tasks.length, 0);
    });

    test('should not get information about issue', async () => {
      assert.equal(issueStub.callCount, 0);
    });

    test('should not be able to create any comment', async () => {
      assert.equal(createCommentStub.callCount, 0);
    });
  });
});
