import { connectToDatabase } from 'utils';

export type Bot = Awaited<ReturnType<typeof getBotBySlug>>;

const botSelectFields = {
  id: true,
  name: true,
  type: true,
  short_description: true,
  image_url: true,
  description: true,
  homepage: true,
  paths: true,
  is_preview: true,
  is_deterministic: true,
  orgs: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const listBots = async () => {
  const client = await connectToDatabase();

  const listBots = await client.bots.findMany({
    where: {
      is_published: true,
    },
    select: botSelectFields,
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
        bot_installations: {
          _count: 'desc',
        },
      },
    ],
  });

  await client.$disconnect();

  return listBots.map((bot) => ({
    slug: [bot.orgs.name, bot.name],
    ...bot,
  }));
};

export const getBotBySlug = async (slug: string[]) => {
  const client = await connectToDatabase();

  if (slug.length !== 2) {
    throw new Error('Invalid slug format. Expected format: [orgName, botName]');
  }

  const [orgName, botName] = slug;

  // Find the bot by name and org name
  const bot = await client.bots.findFirst({
    where: {
      name: botName,
      is_published: true,
      orgs: {
        name: orgName,
      },
    },
    select: botSelectFields,
  });

  await client.$disconnect();

  if (!bot) {
    throw new Error(`Bot not found for slug: ${slug.join('/')}`);
  }

  return bot;
};
