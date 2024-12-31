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
import { logger, SeverityNumber } from '../../telemetry';

import { JobDefinition } from '../types';

const taskCreated: JobDefinition<{
  taskId: number;
}> = {
  handler: async (app, { taskId }) => {
    logger.emit({
      severityNumber: SeverityNumber.INFO,
      body: 'Processing task created event',
      attributes: {
        taskId,
      },
    });

    const task = await app.prisma.tasks.findUnique({
      where: {
        id: taskId,
      },
      include: {
        task_items: true,
      },
    });

    if (!task) {
      logger.emit({
        severityNumber: SeverityNumber.WARN,
        body: 'Unable to find task for task created event',
        attributes: {
          taskId,
        },
      });

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
      logger.emit({
        severityNumber: SeverityNumber.INFO,
        body: 'Deciding on repo for task',
        attributes: {
          taskId,
        },
      });

      // Get all repos for the org
      const repos = await app.prisma.repos.findMany({
        where: {
          org_id: task.org_id,
        },
        include: {
          orgs: true,
        },
      });

      // TODO: Handle gracefully if no active repos are found
      if (!repos.length) {
        logger.emit({
          severityNumber: SeverityNumber.WARN,
          body: 'No active repos found for task',
          attributes: {
            taskId,
          },
        });

        return;
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
      logger.emit({
        severityNumber: SeverityNumber.INFO,
        body: 'Deciding on bot for task',
        attributes: {
          taskId,
        },
      });

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
        logger.emit({
          severityNumber: SeverityNumber.WARN,
          body: 'No active bots found for task',
          attributes: {
            taskId,
          },
        });

        return;
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

    const payload = {
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
    };

    // Create webhook signature
    const signature = createHmac('sha256', botInstallation.bots.webhook_secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    // Send webhook to bot
    return axios.post(botInstallation.bots.webhook_url, payload, {
      headers: {
        'x-automa-server-host': env.BASE_URI,
        'x-automa-signature': signature,
      },
    });
  },
};

export default taskCreated;
