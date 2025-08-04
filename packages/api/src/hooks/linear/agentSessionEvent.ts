import { FastifyInstance } from 'fastify';

import { integration, task_item, task_state } from '@automa/prisma';

import { getMentionUsername } from '../utils';

import { LinearEventActionHandler } from './types';
import { checkConnection, commentEventKey } from './utils';

import { handleAssignment } from './comment';

const created: LinearEventActionHandler<{
  agentSession: {
    id: string;
    organizationId: string;
    issue: {
      id: string;
      team: {
        id: string;
        key: string;
        name: string;
      };
    };
    sourceMetadata: {
      agentSessionMetadata: {
        sourceCommentId: string;
      };
    };
    creator: {
      id: string;
      name: string;
      email: string;
    };
  };
  previousComments: {
    id?: string;
    body: string;
  }[];
}> = async (app, body) => {
  let comment;

  if (body.agentSession.sourceMetadata) {
    comment = body.previousComments.find(
      ({ id }) =>
        id ===
        body.agentSession.sourceMetadata.agentSessionMetadata.sourceCommentId,
    );
  }

  const result = await handleCommentCreate(
    app,
    {
      agentSessionId: body.agentSession.id,
      actor: body.agentSession.creator,
      ...body.agentSession,
    },
    comment,
  );

  if (!result) {
    return;
  }

  const { client, content } = result;

  // Create an agent session activity to notify the user
  await client.createAgentActivity({
    agentSessionId: body.agentSession.id,
    content,
  });
};

const prompted: LinearEventActionHandler<{
  agentSession: {
    id: string;
    organizationId: string;
    issue: {
      id: string;
      team: {
        id: string;
        key: string;
        name: string;
      };
    };
    creator: {
      id: string;
      name: string;
      email: string;
    };
  };
  agentActivity: {
    sourceCommentId: string;
    content: {
      body: string;
    };
  };
}> = async (app, body) => {
  const { orgId } = await checkConnection(
    app,
    body.agentSession.organizationId,
  );

  if (!orgId) {
    return;
  }

  // Check if a task exists with the agent session
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
                path: ['agentSessionId'],
                equals: body.agentSession.id,
              },
            },
          ],
        },
      },
    },
  });

  if (existingTask) {
    // TODO: Consider these comments as review
    return;
  }

  const result = await handleCommentCreate(
    app,
    {
      agentSessionId: body.agentSession.id,
      actor: body.agentSession.creator,
      ...body.agentSession,
    },
    {
      id: body.agentActivity.sourceCommentId,
      body: body.agentActivity.content.body,
    },
  );

  if (!result) {
    return;
  }

  const { client, content } = result;

  // Create an agent session activity to notify the user
  await client.createAgentActivity({
    agentSessionId: body.agentSession.id,
    content,
  });
};

const handleCommentCreate = async (
  app: FastifyInstance,
  body: Omit<Parameters<typeof handleAssignment>[1], 'comment'>,
  comment?: {
    id?: string;
    body: string;
  },
) => {
  comment = comment ?? {
    id: undefined,
    body: getMentionUsername(),
  };

  // Store the agent session comment ID in Redis to prevent duplicate events
  if (comment.id) {
    app.redis.set(
      commentEventKey(comment.id),
      comment.body.trim(),
      'EX',
      60 * 60 * 24 * 7, // 1 week
    );
  }

  return handleAssignment(app, {
    ...body,
    comment,
  });
};

export default {
  created,
  prompted,
};
