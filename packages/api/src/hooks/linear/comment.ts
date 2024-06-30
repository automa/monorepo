import { LinearClient } from '@linear/sdk';

import { integration, task_item } from '@automa/prisma';

import { env } from '../../env';

import { LinearEventActionHandler } from './types';

const automaRegex = /^\/automa\s?/;

const create: LinearEventActionHandler<{
  url: string;
  actor: {
    id: string;
    name: string;
  };
  data: {
    id: string;
    parentId?: string;
    body: string;
    issue: {
      id: string;
      title: string;
      teamId: string;
    };
  };
  organizationId: string;
}> = async (app, body) => {
  if (!automaRegex.test(body.data.body)) {
    return;
  }

  // Find the integration for the organization
  const connection = await app.prisma.integrations.findFirst({
    where: {
      integration_type: integration.linear,
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

  const client = new LinearClient({
    accessToken: connection.secrets.access_token as string,
  });

  // Retrieve the issue
  const issue = await client.issue(body.data.issue.id);

  const task = await app.prisma.tasks.create({
    data: {
      org_id: connection.org_id,
      title: issue.title.slice(0, 255),
      task_items: {
        create: [
          ...(issue.description
            ? [
                {
                  type: task_item.message,
                  content: issue.description,
                },
              ]
            : []),
          {
            type: task_item.origin,
            origin: {
              integration: integration.linear,
              organizationId: body.organizationId,
              teamId: body.data.issue.teamId,
              userId: body.actor.id,
              issueId: issue.id,
              issueIdentifier: issue.identifier,
              issueTitle: issue.title,
              commentId: body.data.id,
              parentId: body.data.parentId,
              url: body.url,
            },
          },
        ],
      },
    },
  });

  await client.createComment({
    body: `Created task: ${env.CLIENT_URI}/${connection.orgs.name}/tasks/${task.id}`,
    issueId: body.data.issue.id,
    parentId: body.data.parentId || body.data.id,
  });

  return;
};

export default {
  create,
};
