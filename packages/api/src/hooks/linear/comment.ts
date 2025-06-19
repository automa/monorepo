import { FastifyInstance } from 'fastify';
import { LinearClient } from '@linear/sdk';

import { integration, task_item, task_state } from '@automa/prisma';

import { env } from '../../env';

import { getRegex, getSelectedBotAndRepo } from '../utils';

import { taskCreate } from '../../db';

import { LinearEventActionHandler } from './types';

const create: LinearEventActionHandler<{
  url: string;
  actor: {
    id: string;
    name: string;
    email: string;
  };
  data: {
    id: string;
    parentId?: string;
    body: string;
    issue: {
      id: string;
      team: {
        id: string;
        key: string;
        name: string;
      };
    };
  };
  organizationId: string;
}> = (app, body) =>
  handleMention(app, {
    organizationId: body.organizationId,
    issue: body.data.issue,
    comment: {
      id: body.data.id,
      body: body.data.body,
    },
    parentCommentId: body.data.parentId,
    actor: body.actor,
  });

export const handleMention = async (
  app: FastifyInstance,
  body: {
    organizationId: string;
    issue: {
      id: string;
      team: {
        id: string;
        key: string;
        name: string;
      };
    };
    comment: {
      id?: string;
      body: string;
    };
    parentCommentId?: string;
    actor: {
      id: string;
      name: string;
      email: string;
    };
  },
) => {
  const text = body.comment.body.trim();
  const regex = getRegex(true);

  if (!regex.test(text)) {
    return;
  }

  // Find the integration for the organization
  const connection = await app.prisma.integrations.findFirst({
    where: {
      type: integration.linear,
      config: {
        path: ['id'],
        equals: body.organizationId,
      },
    },
    include: {
      orgs: true,
    },
  });

  // Check if we have the access token
  if (
    !(
      connection?.secrets &&
      typeof connection.secrets === 'object' &&
      !Array.isArray(connection.secrets) &&
      connection.secrets.access_token
    )
  ) {
    return;
  }

  // Find if a task already exists for this issue
  const existingTask = await app.prisma.tasks.findFirst({
    where: {
      org_id: connection.org_id,
      state: {
        notIn: [task_state.cancelled, task_state.failed],
      },
      task_items: {
        some: {
          type: task_item.origin,
          AND: [
            {
              data: {
                path: ['integration'],
                equals: integration.linear,
              },
            },
            {
              data: {
                path: ['issueId'],
                equals: body.issue.id,
              },
            },
          ],
        },
      },
    },
  });

  if (existingTask) {
    return;
  }

  // Select the bot and repo
  const { selectedBot, selectedRepo, problems } = await getSelectedBotAndRepo(
    app,
    connection.org_id,
    text,
    regex,
  );

  const client = new LinearClient({
    accessToken: connection.secrets.access_token as string,
  });

  const reponseComment = [];

  // Only create the task if we have a bot and repo
  if (selectedBot && selectedRepo) {
    // Retrieve the issue
    const [issue, org] = await Promise.all([
      client.issue(body.issue.id),
      client.organization,
    ]);

    // Find automa user using email if they exist
    // TODO: Unify this logic across the app in db/users.ts
    const automaUser = await app.prisma.users.findFirst({
      where: {
        email: body.actor.email,
      },
    });
    const userData = !automaUser
      ? {
          integration: integration.linear,
          userId: body.actor.id,
          userName: body.actor.name,
          userEmail: body.actor.email,
        }
      : {};

    // Create the task
    const task = await taskCreate(app, {
      org_id: connection.org_id,
      title: issue.title.slice(0, 255),
      task_items: {
        create: [
          ...(issue.description
            ? [
                {
                  type: task_item.message,
                  // Linear returns the description as Markdown
                  data: { content: issue.description },
                },
              ]
            : []),
          {
            type: task_item.origin,
            data: {
              organizationId: org.id,
              organizationUrlKey: org.urlKey,
              organizationName: org.name,
              teamId: body.issue.team.id,
              teamKey: body.issue.team.key,
              teamName: body.issue.team.name,
              ...userData,
              issueId: issue.id,
              issueIdentifier: issue.identifier,
              issueTitle: issue.title,
              commentId: body.comment.id,
              parentId: body.parentCommentId,
            },
            actor_user_id: automaUser?.id,
          },
          ...(selectedRepo
            ? [
                {
                  type: task_item.repo,
                  data: {
                    ...userData,
                  },
                  actor_user_id: automaUser?.id,
                  repo_id: selectedRepo.id,
                },
              ]
            : []),
          ...(selectedBot
            ? [
                {
                  type: task_item.bot,
                  data: {
                    ...userData,
                  },
                  actor_user_id: automaUser?.id,
                  bot_id: selectedBot.bots.id,
                },
              ]
            : []),
        ],
      },
    });

    reponseComment.push(
      `Created task: ${env.CLIENT_URI}/${connection.orgs.name}/tasks/${task.id}`,
    );
  }

  // Notify the user if there were any problems
  if (problems.length) {
    const problemsMessage = problems
      .map((problem) => `- ${problem}`)
      .join('\n');

    reponseComment.push(
      `We encountered the following issues while creating the task:\n${problemsMessage}\n\n*NOTE: We don't support assigning issues yet.*`,
    );
  }

  // Create a comment to notify the user
  await client.createComment({
    body: reponseComment.join('\n\n'),
    issueId: body.issue.id,
    parentId: body.parentCommentId || body.comment.id,
  });

  return;
};

// TODO: Handle the following:
// - remove
export default {
  create,
  update: create,
};
