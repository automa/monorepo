import { bots, orgs } from '@prisma/client';

export const publicOrgFields = {
  id: true,
  name: true,
  provider_type: true,
  provider_id: true,
};

export const publicBotFields = {
  id: true,
  org_id: true,
  name: true,
  short_description: true,
  description: true,
  homepage: true,
  is_published: true,
};

export type public_orgs = Pick<orgs, keyof typeof publicOrgFields>;

export type public_bots = Pick<bots, keyof typeof publicBotFields>;
