import { randomBytes } from 'node:crypto';

import {
  botCreateSchema,
  botUpdateSchema,
  MutationResolvers,
  publicBotFields,
  publicOrgFields,
  QueryResolvers,
  Resolvers,
} from '@automa/common';
import { Prisma } from '@automa/prisma';

import { env } from '../../env';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  bots: async (root, { org_id }, { prisma }) => {
    return prisma.bots.findMany({
      where: {
        org_id,
      },
      orderBy: {
        id: 'asc',
      },
    });
  },
  bot: async (root, { org_id, name }, { prisma }) => {
    return prisma.bots.findFirstOrThrow({
      where: {
        org_id,
        name,
      },
    });
  },
  // TODO: Allow taking an org_id as parameter in order to not return cross-org non-published bots
  publicBots: async (root, { filter }, { userId, prisma }) => {
    return prisma.bots.findMany({
      where: {
        OR: [
          {
            is_published: true,
          },
          ...(!!userId
            ? [
                {
                  orgs: {
                    user_orgs: {
                      some: {
                        user_id: userId,
                      },
                    },
                  },
                },
              ]
            : []),
        ],
        type: filter?.type ?? undefined,
        is_deterministic: filter?.is_deterministic ?? undefined,
      },
      orderBy: [
        {
          is_sponsored: 'desc',
        },
        {
          is_preview: 'asc',
        },
        {
          is_deterministic: 'asc',
        },
        {
          id: 'asc',
        },
      ],
      select: publicBotFields,
    });
  },
  publicBot: async (root, { org_name, name }, { userId, prisma }) => {
    return prisma.bots.findFirstOrThrow({
      where: {
        name,
        orgs: {
          name: org_name,
        },
        OR: [
          {
            is_published: true,
          },
          ...(!!userId
            ? [
                {
                  orgs: {
                    user_orgs: {
                      some: {
                        user_id: userId,
                      },
                    },
                  },
                },
              ]
            : []),
        ],
      },
      select: publicBotFields,
    });
  },
};

export const Mutation: MutationResolvers<Context> = {
  botCreate: async (_, { org_id, input }, { prisma }) => {
    const data = botCreateSchema.parse(input);

    // Generate a webhook secret
    const webhook_secret = `atma_whsec_${randomBytes(32).toString(
      'base64url',
    )}`;

    // TODO: Handle unique bot error
    return prisma.bots.create({
      data: {
        org_id,
        webhook_secret,
        paths: data.draft_paths,
        ...data,
      },
    });
  },
  botUpdate: async (_, { org_id, name, input }, { prisma }) => {
    const data = botUpdateSchema.parse(input);

    const bot = await prisma.bots.findUniqueOrThrow({
      where: {
        org_id_name: {
          org_id,
          name,
        },
      },
    });

    // We need approval if:
    // - The bot has updated paths
    // - The bot is published
    // - The server is cloud
    const needsApproval = data.draft_paths && bot.is_published && env.CLOUD;

    return prisma.bots.update({
      where: {
        org_id_name: {
          org_id,
          name,
        },
      },
      data: {
        ...(data as Prisma.botsUpdateInput),
        ...(!needsApproval
          ? {
              paths: data.draft_paths ?? undefined,
            }
          : {}),
      },
    });
  },
  botPublish: async (_, { org_id, name }, { prisma }) => {
    return prisma.bots.update({
      where: {
        org_id_name: {
          org_id,
          name,
        },
        is_published: false,
      },
      data: {
        published_at: new Date(),
      },
    });
  },
};

export const PublicBot: Resolvers<Context>['PublicBot'] = {
  org: ({ id }, args, { prisma }) => {
    return prisma.bots
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .orgs({
        select: publicOrgFields,
      });
  },
  installation: async (
    { id, org_id: botOrgId },
    { org_id },
    { userId, prisma },
  ) => {
    // TODO: This is blocking prisma from optimizing N+1 queries, caching orgs in session would fix this
    // Check if the user is a member of the given org or the bot's org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: userId,
        org_id: {
          in: [org_id, botOrgId],
        },
      },
    });

    const installations = await prisma.bots
      .findUnique({
        where: {
          id,
        },
      })
      .bot_installations({
        where: {
          org_id,
        },
        take: 1,
      });

    return installations?.[0] ?? null;
  },
};

export const Bot: Resolvers<Context>['Bot'] = {
  org: ({ id }, args, { prisma }) => {
    return prisma.bots
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .orgs();
  },
};
