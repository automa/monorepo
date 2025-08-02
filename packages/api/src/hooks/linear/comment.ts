import { FastifyInstance } from 'fastify';
import { LinearClient } from '@linear/sdk';
import { sleep } from 'zx';

import { integration, task_item, task_state } from '@automa/prisma';

import { env } from '../../env';

import { getRegex, getSelectedBotAndRepo } from '../utils';

import { taskCreate } from '../../db';

import { LinearEventActionHandler } from './types';
import { checkConnection, commentEventKey } from './utils';

// We also handle comment events in case the user forgets to mention the bot
// and simply writes it as text. But, since we don't want to create duplicate tasks,
// we wait to see if an agent session event is handled in a different hook.
const create: LinearEventActionHandler<{
  url: string;
  organizationId: string;
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
}> = async (app, body) => {
  // Short-circuit if the comment is not a mention
  const text = body.data.body.trim();
  const regex = getRegex(true);

  if (!regex.test(text)) {
    return;
  }

  // Wait to see if an agent session is created in a different hook
  await sleep(3000);

  // We need to check if the comment is already associated with an agent session
  if ((await app.redis.get(commentEventKey(body.data.id))) === text) {
    return;
  }

  const result = await handleAssignment(app, {
    organizationId: body.organizationId,
    issue: body.data.issue,
    comment: {
      id: body.data.id,
      body: text,
    },
    parentCommentId: body.data.parentId,
    actor: body.actor,
  });

  if (!result) {
    return;
  }

  const { client, content } = result;

  // Create a comment to notify the user
  await client.createComment({
    body: content.body,
    issueId: body.data.issue.id,
    parentId: body.data.parentId || body.data.id,
  });
};

export const handleAssignment = async (
  app: FastifyInstance,
  body: {
    organizationId: string;
    agentSessionId?: string;
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

  const { accessToken, orgId, orgName } = await checkConnection(
    app,
    body.organizationId,
  );

  if (!orgId) {
    return;
  }

  const client = new LinearClient({ accessToken });

  // Find if a task already exists for this issue
  const existingTask = await app.prisma.tasks.findFirst({
    where: {
      org_id: orgId,
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
    // Only reply if it's an agent session
    if (!body.agentSessionId) {
      return;
    }

    return {
      client,
      content: {
        type: 'error',
        body: `A task already exists for this issue: ${env.CLIENT_URI}/${orgName}/tasks/${existingTask.id}`,
      },
    };
  }

  // Select the bot and repo
  const { selectedBot, selectedRepo, problems } = await getSelectedBotAndRepo(
    app,
    orgId,
    text,
    regex,
  );

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
      org_id: orgId,
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
              integration: integration.linear,
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
              agentSessionId: body.agentSessionId,
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

    return {
      client,
      content: {
        type: 'action',
        action: 'Created task',
        parameter: orgName,
        result: `${env.CLIENT_URI}/${orgName}/tasks/${task.id}`,
        body: `Created task: ${env.CLIENT_URI}/${orgName}/tasks/${task.id}`,
      },
    };
  }

  // Notify the user if there were any problems
  if (problems.length) {
    const problemsMessage = problems
      .map((problem) => `- ${problem}`)
      .join('\n');

    return {
      client,
      content: {
        type: 'error',
        body: `We encountered the following issues while creating the task:\n${problemsMessage}\n\n*NOTE: We don't support assigning issues yet.*`,
      },
    };
  }

  // Not sure if we should reach here, but just in case
  return {
    client,
    content: {
      type: 'error',
      body: 'We encountered an unknown error while creating the task and are looking into it.',
    },
  };
};

// TODO: Handle the following:
// - remove
export default {
  create,
  update: create,
};
