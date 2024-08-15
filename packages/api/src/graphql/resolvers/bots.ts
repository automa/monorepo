import { randomBytes } from 'node:crypto';

import {
  botCreateSchema,
  BotResolvers,
  MutationResolvers,
  publicBotFields,
  PublicBotResolvers,
  publicOrgFields,
  QueryResolvers,
} from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  bots: async (root, { org_id }, { userId, prisma }) => {
    // TODO: Convert the org check into a directive and/or use resolver composition, and cache this in session
    // Check if the user is a member of the org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: userId,
        org_id,
      },
    });

    return prisma.bots.findMany({
      where: {
        org_id,
      },
      orderBy: {
        id: 'asc',
      },
    });
  },
  bot: async (root, { org_id, name }, { userId, prisma }) => {
    // Check if the user is a member of the org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: userId,
        org_id,
      },
    });

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
      orderBy: {
        id: 'asc',
      },
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
  botCreate: async (_, { org_id, input }, { userId, prisma }) => {
    // Check if the user is a member of the org
    await prisma.user_orgs.findFirstOrThrow({
      where: {
        user_id: userId,
        org_id,
      },
    });

    const data = botCreateSchema.parse(input);

    // Generate a webhook secret
    const webhook_secret = `atma_whsec_${randomBytes(32).toString(
      'base64url',
    )}`;

    return prisma.bots.create({
      data: {
        org_id,
        webhook_secret,
        ...data,
      },
    });
  },
};

export const PublicBot: PublicBotResolvers<Context> = {
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

export const Bot: BotResolvers<Context> = {
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
