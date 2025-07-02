import { task_item } from '@automa/prisma';

import { JobDefinition } from '../types';
import { sendWebhook } from '../utils';

const sendWebhookProposalClosed: JobDefinition<{
  proposalItemId: number;
}> = {
  handler: async (app, { proposalItemId }) => {
    // NOTE: Incorrect reading might occur if we have db replicas
    const item = await app.prisma.task_items.findUnique({
      where: {
        id: proposalItemId,
      },
      select: {
        id: true,
        type: true,
        data: true,
        bot_id: true,
        repo_id: true,
        tasks: {
          include: {
            orgs: true,
          },
        },
      },
    });

    if (!item || item.type !== task_item.proposal) {
      return app.log.warn(
        { proposal_item_id: proposalItemId },
        'Unable to find proposal item for sendWebhookProposalClosed event',
      );
    }

    if (!item.bot_id) {
      return app.log.warn(
        { proposal_item_id: proposalItemId },
        'Unable to find bot for the proposal item for sendWebhookProposalClosed event',
      );
    }

    const bot = await app.prisma.bots.findUnique({
      where: {
        id: item.bot_id,
      },
    });

    if (!bot) {
      return app.log.warn(
        { proposal_item_id: proposalItemId, bot_id: item.bot_id },
        'Unable to find bot for sendWebhookProposalClosed event',
      );
    }

    const type = (item.data as any).prMerged
      ? 'proposal.accepted'
      : 'proposal.rejected';

    const data = {
      proposal: {
        id: item.id,
        type: item.type,
        data: item.data,
        bot_id: item.bot_id,
        repo_id: item.repo_id,
      },
      task: {
        id: item.tasks.id,
        title: item.tasks.title,
      },
      org: {
        id: item.tasks.orgs.id,
        name: item.tasks.orgs.name,
        provider_type: item.tasks.orgs.provider_type,
      },
    };

    return sendWebhook(type, `${proposalItemId}`, bot, data);
  },
};

export default sendWebhookProposalClosed;
