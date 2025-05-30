import { createHmac } from 'node:crypto';

import axios from 'axios';

import {
  bot_installations,
  bots,
  orgs,
  Prisma,
  repos,
  task_item,
} from '@automa/prisma';

import { env } from '../../env';

import { JobDefinition } from '../types';

const sendTaskWebhook: JobDefinition<{
  taskId: number;
}> = {
  handler: async (app, { taskId }) => {
    const task = await app.prisma.tasks.findUnique({
      where: {
        id: taskId,
      },
      include: {
        task_items: true,
      },
    });

    if (!task) {
      return app.log.warn(
        { task_id: taskId },
        'Unable to find task for sendTaskWebhook event',
      );

      return;
    }

    const repoTaskItem = task.task_items.find(
      (item) => item.type === task_item.repo,
    );
    const botTaskItem = task.task_items.find(
      (item) => item.type === task_item.bot,
    );

    let repo: repos & { orgs: orgs },
      botInstallation: bot_installations & { bots: bots & { orgs: orgs } };

    // If the task does not have a repo, select one
    if (!repoTaskItem) {
      app.log.info({ task_id: taskId }, 'Deciding on repo for task');

      // Get all repos for the org
      const repos = await app.prisma.repos.findMany({
        where: {
          org_id: task.org_id,
          is_archived: false,
          has_installation: true,
        },
        include: {
          orgs: true,
        },
      });

      // TODO: Handle gracefully if no active repos are found
      if (!repos.length) {
        return app.log.warn(
          { task_id: taskId },
          'No active repos found for task',
        );
      }

      // TODO: Use AI to select the best repo
      repo = repos[0];

      // Update the task with the selected repo
      await app.prisma.task_items.create({
        data: {
          task_id: taskId,
          type: task_item.repo,
          repo_id: repo.id,
        },
      });
    } else {
      repo = await app.prisma.repos.findFirstOrThrow({
        where: {
          id: (repoTaskItem.data as Prisma.JsonObject).repoId as number,
        },
        include: {
          orgs: true,
        },
      });
    }

    // If the task does not have a bot, select one
    if (!botTaskItem) {
      app.log.info({ task_id: taskId }, 'Deciding on bot for task');

      // Get all bot installations for the org
      const botInstallations = await app.prisma.bot_installations.findMany({
        where: {
          org_id: task.org_id,
        },
        include: {
          bots: {
            include: {
              orgs: true,
            },
          },
        },
      });

      // TODO: Handle gracefully if no bot installations are found
      if (!botInstallations.length) {
        return app.log.warn(
          { task_id: taskId },
          'No active bots found for task',
        );
      }

      // TODO: Use AI to select the best bot
      botInstallation = botInstallations[0];

      // Update the task with the selected bot
      await app.prisma.task_items.create({
        data: {
          task_id: taskId,
          type: task_item.bot,
          bot_id: botInstallation.bots.id,
        },
      });
    } else {
      // TODO: Handle case where bot has been uninstalled after task creation
      botInstallation = await app.prisma.bot_installations.findFirstOrThrow({
        where: {
          bot_id: (botTaskItem.data as Prisma.JsonObject).botId as number,
          org_id: task.org_id,
        },
        include: {
          bots: {
            include: {
              orgs: true,
            },
          },
        },
      });
    }

    const id = `whmsg_task_created_${taskId}`;
    const timestamp = new Date();
    const unixTimestamp = Math.floor(timestamp.getTime() / 1000);

    const payload = {
      id,
      type: 'task.created',
      data: {
        task: {
          id: taskId,
          token: task.token,
          title: task.title,
          items: task.task_items
            .filter(({ type }) =>
              ([task_item.message, task_item.origin] as task_item[]).includes(
                type,
              ),
            )
            .map(({ id, type, data }) => ({
              id,
              type,
              data,
            })),
        },
        repo: {
          id: repo.id,
          name: repo.name,
          is_private: repo.is_private,
        },
        org: {
          id: repo.orgs.id,
          name: repo.orgs.name,
          provider_type: repo.orgs.provider_type,
        },
      },
      // Better to keep the timestamp last to avoid issues with JSON serialization
      // in tests for generating the signature
      timestamp: timestamp.toISOString(),
    };

    // Create webhook signature
    const signature = createHmac(
      'sha256',
      botInstallation.bots.webhook_secret.slice(11),
    )
      .update(`${id}.${unixTimestamp}.${JSON.stringify(payload)}`)
      .digest('base64');

    // Send webhook to bot
    return axios.post(botInstallation.bots.webhook_url, payload, {
      headers: {
        'webhook-id': id,
        'webhook-timestamp': unixTimestamp,
        'webhook-signature': `v1,${signature}`,
        'x-automa-server-host': env.BASE_URI,
      },
    });
  },
};

export default sendTaskWebhook;
