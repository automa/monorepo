import { connectToDatabase } from 'utils';

export type Bot = Awaited<ReturnType<typeof getAgentBySlug>>;

const botSelectFields = {
  id: true,
  name: true,
  type: true,
  short_description: true,
  paths: true,
  image_url: true,
  description: true,
  homepage: true,
  is_preview: true,
  is_deterministic: true,
  orgs: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const listAgents = async () => {
  const client = await connectToDatabase();

  const listAgents = await client.bots.findMany({
    where: {
      is_published: true,
    },
    select: botSelectFields,
    orderBy: [
      {
        is_preview: 'asc',
      },
      {
        bot_installations: {
          _count: 'desc',
        },
      },
    ],
  });

  await client.$disconnect();

  return listAgents.map((agent) => ({
    slug: [agent.orgs.name, agent.name],
    ...agent,
  }));
};

export const getAgentBySlug = async (slug: string[]) => {
  const client = await connectToDatabase();

  if (slug.length !== 2) {
    throw new Error(
      'Invalid slug format. Expected format: [orgName, agentName]',
    );
  }

  const [orgName, agentName] = slug;

  // Find the agent by name and org name
  const agent = await client.bots.findFirst({
    where: {
      name: agentName,
      is_published: true,
      orgs: {
        name: orgName,
      },
    },
    select: botSelectFields,
  });

  await client.$disconnect();

  if (!agent) {
    throw new Error(`Agent not found for slug: ${slug.join('/')}`);
  }

  return agent;
};
