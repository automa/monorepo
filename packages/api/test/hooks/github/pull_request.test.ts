import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { assert } from 'chai';

import {
  bots,
  orgs,
  repos,
  task_item,
  task_items,
  tasks,
  users,
} from '@automa/prisma';

import { seedBots, seedOrgs, seedRepos, seedUsers, server } from '../../utils';

import { callWithFixture } from './utils';

suite('github hook pull_request event', () => {
  let app: FastifyInstance, response: LightMyRequestResponse;
  let org: orgs, repo: repos, bot: bots;
  let task: tasks, proposal: task_items;

  suiteSetup(async () => {
    app = await server();

    [org] = await seedOrgs(app, 1);
    [repo] = await seedRepos(app, [org]);
    [bot] = await seedBots(app, [org]);
  });

  suiteTeardown(async () => {
    await app.prisma.orgs.deleteMany();
    await app.close();
  });

  setup(async () => {
    task = await app.prisma.tasks.create({
      data: {
        title: 'Task 1',
        org_id: org.id,
        token: 'abcdef',
        state: 'submitted',
      },
    });

    proposal = await app.prisma.task_items.create({
      data: {
        task_id: task.id,
        type: task_item.proposal,
        repo_id: repo.id,
        bot_id: bot.id,
        data: {
          prId: 2094521303,
          prNumber: 103,
          prTitle: 'PR Title',
          prState: 'open',
          prMerged: false,
          prHead: `org-0:automa/bot-0/${task.id}`,
          prBase: 'default-branch',
        },
      },
    });
  });

  teardown(async () => {
    await app.prisma.tasks.deleteMany();
  });

  suite('with no matching proposal', () => {
    setup(async () => {
      await app.prisma.task_items.deleteMany();
      response = await callWithFixture(app, 'pull_request', 'merged');
    });

    test('should return 200', () => {
      assert.equal(response.statusCode, 200);
    });

    test('should not update task state', async () => {
      task = await app.prisma.tasks.findFirstOrThrow({
        where: {
          id: task.id,
        },
      });

      assert.equal(task.state, 'submitted');
    });

    test('should not create task activity', async () => {
      const activities = await app.prisma.task_items.findMany({
        where: {
          task_id: task.id,
          type: task_item.activity,
        },
      });

      assert.isEmpty(activities);
    });
  });

  // eslint-disable-next-line mocha/no-setup-in-describe
  [
    {
      name: 'merged',
      state: 'completed',
      prState: 'closed',
      prMerged: true,
    },
    {
      name: 'closed',
      state: 'cancelled',
      prState: 'closed',
      prMerged: false,
    },
  ].forEach(({ name, state, prState, prMerged }) => {
    suite(name, () => {
      setup(async () => {
        response = await callWithFixture(app, 'pull_request', name);
      });

      test('should return 200', () => {
        assert.equal(response.statusCode, 200);
      });

      test(`should mark the task as ${state}`, async () => {
        task = await app.prisma.tasks.findFirstOrThrow({
          where: {
            id: task.id,
          },
        });

        assert.equal(task.state, state);
      });

      test('should update the task item', async () => {
        const taskItem = await app.prisma.task_items.findFirstOrThrow({
          where: {
            id: proposal.id,
          },
        });

        assert.deepEqual(taskItem.data, {
          prId: 2094521303,
          prNumber: 103,
          prTitle: 'PR Title',
          prState,
          prMerged,
          prHead: `org-0:automa/bot-0/${task.id}`,
          prBase: 'default-branch',
        });
      });

      test('should create task activity', async () => {
        const activities = await app.prisma.task_items.findMany({
          where: {
            task_id: task.id,
            type: task_item.activity,
          },
          include: {
            task_activities: true,
          },
        });

        assert.lengthOf(activities, 1);
        assert.deepOwnInclude(activities[0], {
          actor_user_id: null,
          bot_id: null,
          data: {
            integration: 'github',
            userId: 174703,
            userName: 'pksunkara',
          },
        });
        assert.deepOwnInclude(activities[0].task_activities, {
          type: 'state',
          from_state: 'submitted',
          to_state: state,
        });
      });
    });
  });

  suite('reopened', () => {
    setup(async () => {
      await app.prisma.tasks.update({
        where: {
          id: task.id,
        },
        data: {
          state: 'completed',
        },
      });
      await app.prisma.task_items.update({
        where: {
          id: proposal.id,
        },
        data: {
          data: {
            ...(proposal.data as object),
            prState: 'closed',
            prMerged: true,
          },
        },
      });

      response = await callWithFixture(app, 'pull_request', 'reopened');
    });

    test('should return 200', () => {
      assert.equal(response.statusCode, 200);
    });

    test('should not update task state', async () => {
      task = await app.prisma.tasks.findFirstOrThrow({
        where: {
          id: task.id,
        },
      });

      assert.equal(task.state, 'completed');
    });

    test('should not update the task item', async () => {
      const taskItem = await app.prisma.task_items.findFirstOrThrow({
        where: {
          id: proposal.id,
        },
      });

      assert.deepEqual(taskItem.data, {
        prId: 2094521303,
        prNumber: 103,
        prTitle: 'PR Title',
        prState: 'closed',
        prMerged: true,
        prHead: `org-0:automa/bot-0/${task.id}`,
        prBase: 'default-branch',
      });
    });

    test('should not create task activity', async () => {
      const activities = await app.prisma.task_items.findMany({
        where: {
          task_id: task.id,
          type: task_item.activity,
        },
      });

      assert.isEmpty(activities);
    });
  });

  suite('with matching user', () => {
    let user: users;

    suiteSetup(async () => {
      [user] = await seedUsers(app, 1);

      await app.prisma.user_providers.create({
        data: {
          provider_type: 'github',
          provider_id: '174703',
          provider_email: 'pavan.sunkara@automa.app',
          user_id: user.id,
        },
      });
    });

    suiteTeardown(async () => {
      await app.prisma.users.deleteMany();
    });

    setup(async () => {
      response = await callWithFixture(app, 'pull_request', 'merged');
    });

    test('should return 200', () => {
      assert.equal(response.statusCode, 200);
    });

    test('should mark the task as completed', async () => {
      task = await app.prisma.tasks.findFirstOrThrow({
        where: {
          id: task.id,
        },
      });

      assert.equal(task.state, 'completed');
    });

    test('should update the task item', async () => {
      const taskItem = await app.prisma.task_items.findFirstOrThrow({
        where: {
          id: proposal.id,
        },
      });

      assert.deepEqual(taskItem.data, {
        prId: 2094521303,
        prNumber: 103,
        prTitle: 'PR Title',
        prState: 'closed',
        prMerged: true,
        prHead: `org-0:automa/bot-0/${task.id}`,
        prBase: 'default-branch',
      });
    });

    test('should create task activity', async () => {
      const activities = await app.prisma.task_items.findMany({
        where: {
          task_id: task.id,
          type: task_item.activity,
        },
        include: {
          task_activities: true,
        },
      });

      assert.lengthOf(activities, 1);
      assert.deepOwnInclude(activities[0], {
        actor_user_id: user.id,
        bot_id: null,
        data: {},
      });
      assert.deepOwnInclude(activities[0].task_activities, {
        type: 'state',
        from_state: 'submitted',
        to_state: 'completed',
      });
    });
  });
});
